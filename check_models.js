
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Checking API Key: " + (key ? key.substring(0, 8) + "..." : "NOT FOUND"));

    if (!key) return;

    // We have to access the API directly to list models because the SDK might abstract it
    // But let's try the SDK first if there is a method, or just try a basic fetch

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("\n✅ AVAILABLE MODELS:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name.replace('models/', '')}`);
                }
            });
        } else {
            console.error("❌ Failed to list models:", JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("❌ Network Error:", error.message);
    }
}

listModels();
