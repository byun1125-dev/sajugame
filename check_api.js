
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function check() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Checking API Key: " + (key ? key.substring(0, 8) + "..." : "NOT FOUND"));

    if (!key || key.startsWith("your-actual")) {
        console.error("❌ ERROR: Please put your real API key in .env.local file!");
        return;
    }

    const genAI = new GoogleGenerativeAI(key);

    console.log("1. Testing Model: gemini-pro...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("✅ gemini-pro SUCCESS!");
        console.log("Response:", response.text());
    } catch (error) {
        console.error("❌ gemini-pro FAILED:");
        console.error(error.message);
    }

    console.log("\n2. Testing Model: gemini-1.5-flash...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("✅ gemini-1.5-flash SUCCESS!");
        console.log("Response:", response.text());
    } catch (error) {
        console.error("❌ gemini-1.5-flash FAILED:");
        console.error(error.message);
    }
}

check();
