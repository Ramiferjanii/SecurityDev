const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

async function test() {
    let apiKey = process.env.GEMINI_API_KEY;
    
    // meaningful fallback to check files if env not loaded in this shell
    if (!apiKey) {
        try {
            if (fs.existsSync('.env.local')) {
                const content = fs.readFileSync('.env.local', 'utf8');
                const match = content.match(/GEMINI_API_KEY=(.+)/);
                if (match) apiKey = match[1].trim();
            } else if (fs.existsSync('.env')) {
                const content = fs.readFileSync('.env', 'utf8');
                const match = content.match(/GEMINI_API_KEY=(.+)/);
                if (match) apiKey = match[1].trim();
            }
        } catch(e) {
            console.log("Error reading env files");
        }
    }

    if (!apiKey) {
        console.error("No API Key found to test.");
        return;
    }

    console.log("Using API Key: " + apiKey.substring(0, 4) + "***" + apiKey.substring(apiKey.length - 4));
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const modelsToTry = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash-001",
        "gemini-1.5-pro",
        "gemini-pro",
        "gemini-1.0-pro"
    ];

    for (const modelName of modelsToTry) {
        console.log(`\nTesting model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, are you there?");
            console.log(`✅ SUCCESS: ${modelName} worked! Response: ${result.response.text().substring(0, 20)}...`);
            return; // Found a working one
        } catch (error) {
            console.log(`❌ FAILED: ${modelName}`);
            // Extract meaningful part of error
            const msg = error.message || error.toString();
            if (msg.includes("404")) console.log("   -> 404 Not Found (Model likely not available or key invalid for this model)");
            else console.log("   -> Error: " + msg.substring(0, 100));
        }
    }
    console.log("\nAll attempts failed.");
}

test();
