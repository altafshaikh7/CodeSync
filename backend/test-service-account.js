import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAuth } from 'google-auth-library';

async function testServiceAccount() {
    try {
        // Use the service account to get a token
        const auth = new GoogleAuth({
            keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });

        const client = await auth.getClient();
        const token = await client.getAccessToken();
        console.log('🔑 Service account token obtained:', token.token?.substring(0, 20) + '...');

        // Test with the Gemini API using the token
        const genAI = new GoogleGenerativeAI(token.token);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log('✅ Success:', result.response.text());

    } catch (error) {
        console.error('❌ Service account test failed:', error.message);
        console.log('🔑 Make sure Gemini API is enabled for your project');
    }
}

testServiceAccount();