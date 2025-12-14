'use client';

import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '@/types';
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

// Format timestamp consistently to avoid hydration mismatches
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

export default function ChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Initialize messages only on client to avoid hydration mismatch
  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your BLUEFORT security assistant. I can help you detect and report cyberattacks, phishing attempts, malware, and scams. How can I help you today?',
        timestamp: new Date(),
      },
    ]);
  }, []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleReport = async (assistantMessage: ChatMessage) => {
    // Find the corresponding user message (the one before the assistant message)
    const messageIndex = messages.findIndex(m => m.id === assistantMessage.id);
    const userMessage = messages[messageIndex - 1];
    
    if (!userMessage || !assistantMessage.threatDetected) return;

    // Direct report without confirmation popup, as requested ("use as verifier")
    try {
      const userResponse = await fetch('/api/auth/user').catch(() => null);
      let userId = null;
      let userName = null;
      
      if (userResponse?.ok) {
        const userData = await userResponse.json();
        userId = userData.user?.$id;
        userName = userData.user?.name;
      }

      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || 'anonymous',
          userName: userName || 'Anonymous',
          type: assistantMessage.threatType,
          title: `Potential ${assistantMessage.threatType} threat detected`,
          description: userMessage.content,
          confidence: 0.8,
          tags: [assistantMessage.threatType, 'auto-detected'],
          source: 'chatbot',
        }),
      });

      // Delete the threat message and warning from chat
      setMessages((prev) => prev.filter((msg) => 
        msg.id !== userMessage.id && msg.id !== assistantMessage.id
      ));
      
      // Add a system notice that content was removed
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: '🚫 The malicious content has been removed and reported to the community.',
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Error sharing threat:', error);
      alert('Failed to share threat report. Please try again.');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send to detection API which handles both chat and threat detection
      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || 'I apologize, but I couldn\'t process your message.',
        timestamp: new Date(),
        threatDetected: data.threatDetected || false,
        threatType: data.threatType,
        entities: data.entities,
        verdict: data.verdict,
        riskScore: data.riskScore
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // Removed automatic alert/confirm loop here to allow "verifier" mode usage.

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 text-white p-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
           🛡️ BLUEFORT AI
        </h2>
        <p className="text-sm text-neutral-400">Your personal cybersecurity defense assistant</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 backdrop-blur-sm ${
                message.role === 'user'
                  ? 'bg-blue-600/80 text-white border border-blue-500/30 rounded-tr-none shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                  : message.threatDetected
                  ? 'bg-red-500/10 border border-red-500/30 text-red-100 rounded-tl-none shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  : 'bg-white/10 border border-white/5 text-neutral-200 rounded-tl-none'
              }`}
            >
              {message.verdict && (
                <div className={`mt-0 mb-3 p-2 rounded-lg text-xs font-bold flex items-center justify-between border ${
                  message.verdict === 'SAFE' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                  message.verdict === 'SUSPICIOUS' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                  'bg-red-500/20 text-red-300 border-red-500/30'
                }`}>
                  <span className="flex items-center gap-2">
                    {message.verdict === 'SAFE' ? '✅ VERIFIED SAFE' :
                     message.verdict === 'SUSPICIOUS' ? '⚠️ SUSPICIOUS' :
                     '🚫 THREAT DETECTED'}
                  </span>
                  {message.riskScore !== undefined && (
                    <span className="bg-black/40 px-2 py-0.5 rounded-full">
                      Risk: {message.riskScore}/100
                    </span>
                  )}
                </div>
              )}
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              {message.threatDetected && (
                <div className="mt-3 text-xs font-semibold text-red-300 flex items-center gap-1">
                  ⚠️ Detected: {message.threatType?.toUpperCase()}
                </div>
              )}
              
              {/* Display Extracted Entities */}
              {message.entities && (
                <div className="mt-3 space-y-2">
                  {message.entities.urls && message.entities.urls.length > 0 && (
                    <div className="bg-red-950/30 border border-red-500/20 p-2 rounded text-xs">
                      <p className="font-semibold text-red-400 mb-1">Suspicious Links:</p>
                      <ul className="list-disc pl-4 text-red-300/80 space-y-1">
                        {message.entities.urls.map((url, i) => (
                          <li key={i} className="break-all">{url}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {message.entities.emails && message.entities.emails.length > 0 && (
                    <div className="bg-red-950/30 border border-red-500/20 p-2 rounded text-xs">
                      <p className="font-semibold text-red-400 mb-1">Suspicious Emails:</p>
                      <ul className="list-disc pl-4 text-red-300/80 space-y-1">
                        {message.entities.emails.map((email, i) => (
                          <li key={i}>{email}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {message.threatDetected && message.role === 'assistant' && (
                <button
                  onClick={() => handleReport(message)}
                  className="mt-4 text-xs bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 w-full justify-center"
                >
                  📢 Report to Community & Remove
                </button>
              )}
              <div className="text-[10px] opacity-50 mt-2 text-right" suppressHydrationWarning>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-2xl rounded-tl-none p-4 border border-white/5">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-4 bg-white/5">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message, email content, or URL to verify..."
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-neutral-500 transition-all font-light"
            disabled={isLoading}
          />
          <HoverBorderGradient
            containerClassName="rounded-xl"
            as="button"
            className="bg-blue-600 text-white flex items-center justify-center px-6 h-full font-medium tracking-wide"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
             <span>Send</span>
          </HoverBorderGradient>
        </div>
      </div>
    </div>
  );
}
