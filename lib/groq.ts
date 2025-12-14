
import OpenAI from 'openai';
import type { VAPIResponse } from '@/types';

const API_KEY = process.env.GROQ_API_KEY || '';
const openai = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true 
});

const THREAT_PATTERNS = {
  phishing: [
    'suspicious email', 'phishing', 'fake email', 'verify account', 'click here',
    'urgent action required', 'account suspended', 'verify identity', 'verify email',
    'email verification', 'confirm email', 'verify your email', 'email is fake',
    'suspicious link', 'phishing email', 'fake verification', 'email scam',
    'is this email', 'this email is', 'email suspicious', 'verify address'
  ],
  account_compromise: [
    'hacked', 'account compromised', 'unauthorized access', 'someone logged in',
    'account breach', 'stolen password', 'account takeover', 'password stolen',
    'someone accessed', 'unauthorized login', 'account hacked'
  ],
  malware: [
    'virus', 'malware', 'trojan', 'ransomware', 'infected', 'suspicious software',
    'computer slow', 'popup ads', 'browser hijacked', 'computer virus'
  ],
  scam: [
    'fake prize', 'lottery winner', 'nigerian prince', 'inheritance', 'fake job',
    'too good to be true', 'wire transfer', 'gift card payment', 'scam',
    'is this a scam', 'this is scam', 'is scam', 'scam email', 'email scam',
    'this email scam', 'is this scam', 'scam?', 'scam ?', 'sscam', 'scamm'
  ]
};

export async function detectWithGroq(message: string): Promise<{
    detected: boolean;
    type?: 'phishing' | 'account_compromise' | 'malware' | 'scam' | 'other';
    confidence: number;
    riskScore: number;
    verdict: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS';
    entities?: {
      urls: string[];
      emails: string[];
    };
    analysis?: string;
}> {
    try {
        if (!API_KEY) throw new Error('Groq API Key missing');

        const prompt = `
        Analyze the following text for cybersecurity threats (phishing, scams, malware, account compromise).
        
        Text to analyze: "${message}"

        Return ONLY a JSON object with this structure (no markdown, no other text):
        {
            "detected": boolean,
            "type": "phishing" | "account_compromise" | "malware" | "scam" | "other" | null,
            "confidence": number (0-1),
            "riskScore": number (0-100),
            "verdict": "SAFE" | "SUSPICIOUS" | "MALICIOUS",
            "entities": {
                "urls": string[],
                "emails": string[]
            },
            "analysis": "Short explanation of why"
        }
        `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        const responseText = completion.choices[0].message.content || "{}";
        const data = JSON.parse(responseText);

        return data;

    } catch (error) {
        console.error("Groq Detection Failed:", error);
        return localDetect(message);
    }
}

export async function sendMessageToGroq(message: string, history: any[] = []): Promise<VAPIResponse> {
    try {
        if (!API_KEY) throw new Error("Groq API Key missing");

        // 1. First, detect threats
        const detection = await detectWithGroq(message);

        // 2. Generate conversational response
        let systemPrompt = `You are a cybersecurity assistant. 
        User message: "${message}"
        Analysis result: ${JSON.stringify(detection)}
        
        If a threat is detected (${detection.verdict}), warn the user clearly and explain the risks based on the analysis.
        If it is Safe, confirm it.
        If the user is just saying hello, be helpful and introduce yourself as a Cyber Security Verifier powered by Groq (Llama 3).`;

        const messages: any[] = history.map(h => ({
            role: h.role, 
            content: h.content
        }));
        messages.push({ role: "system", content: systemPrompt });

        const completion = await openai.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile"
        });

        const responseText = completion.choices[0].message.content || "";

        return {
            message: responseText,
            detectedThreat: detection.detected,
            threatType: detection.type,
            confidence: detection.confidence,
            riskScore: detection.riskScore,
            verdict: detection.verdict,
            entities: detection.entities
        };

    } catch (error) {
        console.error("error", error);
        return {
             message: "I'm having trouble connecting to my brain (Groq). But based on local analysis: " + (await localDetect(message)).verdict,
             detectedThreat: false,
             verdict: 'SUSPICIOUS',
             riskScore: 50
        }
    }
}

// Fallback regex-based detection
function localDetect(message: string) {
  const lowerMessage = message.toLowerCase();
  
  // Extract entities
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  
  const urls = message.match(urlRegex) || [];
  const emails = message.match(emailRegex) || [];
  
  const entities = {
    urls: Array.from(new Set(urls)), // Deduplicate
    emails: Array.from(new Set(emails))
  };

  let highestConfidence = 0;
  let detectedType: 'phishing' | 'account_compromise' | 'malware' | 'scam' | 'other' | undefined;
  
  // Scan for threat patterns
  for (const [type, patterns] of Object.entries(THREAT_PATTERNS)) {
    const matches = patterns.filter(pattern => {
      const patternLower = pattern.toLowerCase();
      // Check for exact word match or phrase match
      return lowerMessage.includes(patternLower) || 
             new RegExp(`\\b${patternLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(lowerMessage);
    });
    
    if (matches.length > 0) {
      // Calculate confidence for this category
      const confidence = Math.min(0.75 + (matches.length * 0.1), 0.99);
      
      if (confidence > highestConfidence) {
        highestConfidence = confidence;
        detectedType = type as any;
      }
    }
  }

  // Risk Score Calculation (0-100)
  let riskScore = 0;
  if (detectedType) {
    riskScore = highestConfidence * 100;
  }
  
  // Boost risk if input has suspicious elements
  if (lowerMessage.includes('urgent') || lowerMessage.includes('immediately')) riskScore += 10;
  if (lowerMessage.includes('password') || lowerMessage.includes('bank')) riskScore += 10;
  if (entities.urls.length > 0) riskScore += 5;
  
  riskScore = Math.min(riskScore, 100);

  // Determine Verdict
  let verdict: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS' = 'SAFE';
  
  if (riskScore >= 75) {
    verdict = 'MALICIOUS';
  } else if (riskScore >= 40) {
    verdict = 'SUSPICIOUS';
  } else {
    verdict = 'SAFE';
  }

  if (detectedType) {
    return {
      detected: true,
      type: detectedType,
      confidence: highestConfidence,
      riskScore,
      verdict,
      entities
    };
  }
  
  // No patterns matched, but is it verifiable content?
  const isVerifiable = message.length > 20 || entities.urls.length > 0 || entities.emails.length > 0;

  if (isVerifiable) {
    return { 
      detected: false, 
      confidence: 0.1, 
      riskScore: 0, 
      verdict: 'SAFE' as const,
      entities 
    };
  }

  return { 
    detected: false, 
    confidence: 0, 
    riskScore: 0, 
    verdict: 'SAFE' as const, 
    entities 
  };
}
