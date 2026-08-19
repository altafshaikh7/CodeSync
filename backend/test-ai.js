import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_AI_KEY;
console.log('🔑 API Key exists:', !!API_KEY);
console.log('🔑 Key starts with:', API_KEY?.substring(0, 15));

if (!API_KEY || !API_KEY.startsWith('AIzaSy')) {
    console.error('❌ Invalid API key! Get a new one from https://aistudio.google.com/apikey');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function testModel(modelName) {
    try {
        console.log(`🔄 Testing ${modelName}...`);
        const model = genAI.getGenerativeModel({ 
            model: modelName,
            generationConfig: { temperature: 0.7, maxOutputTokens: 50 }
        });
        const result = await model.generateContent("Say 'Hello' in one word");
        const response = await result.response;
        console.log(`✅ ${modelName} WORKS! Response:`, response.text());
        return true;
    } catch (error) {
        console.log(`❌ ${modelName} failed:`, error.message);
        return false;
    }
}

async function testAllModels() {
    console.log('\n🧪 Testing Gemini Models...\n');
    
    const models = ["gemini-2.0-flash-exp", "gemini-1.5-flash", "gemini-pro"];
    let workingModel = null;
    
    for (const model of models) {
        if (await testModel(model)) {
            workingModel = model;
            break;
        }
    }
    
    if (workingModel) {
        console.log(`\n🎉 SUCCESS! Use model: ${workingModel}`);
        console.log('✅ Your API key is working!');
    } else {
        console.log('\n❌ No model works!');
        console.log('🔑 Make sure Gemini API is enabled for your project:');
        console.log('1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
        console.log('2. Select your project');
        console.log('3. Click ENABLE');
        console.log('4. Wait 2-3 minutes');
        console.log('5. Create a NEW API key');
    }
}

testAllModels();