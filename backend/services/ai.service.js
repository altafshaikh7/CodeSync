import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_AI_KEY;

if (!API_KEY) {
    console.error('❌ GOOGLE_AI_KEY is missing');
    throw new Error("GOOGLE_AI_KEY is missing");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// ✅ All available models - try in order
const MODEL_NAMES = [
    "gemini-1.5-flash",    // Fast, reliable
    "gemini-1.5-pro",      // More capable  
    "gemini-pro"           // Legacy fallback
];

// ============================================================
// SYSTEM INSTRUCTION
// ============================================================

const SYSTEM_INSTRUCTION = `
You are CodeSync AI, an expert MERN stack developer.

Always return ONE valid JSON object with this structure:
{
    "text": "Explain what was created",
    "fileTree": {},
    "buildCommand": { "mainItem": "npm", "commands": ["install"] },
    "startCommand": { "mainItem": "npm", "commands": ["start"] }
}

File Tree Rules:
- Every file MUST use: "filename.ext": { "file": { "contents": "file content" } }
- Folders are plain objects
- ALWAYS include package.json for generated apps

For React + Vite apps:
- Use React components with proper imports
- Include package.json, index.html, src/main.jsx, src/App.jsx
- In package.json, set "start": "vite"
- Include dependencies: react, react-dom, vite, @vitejs/plugin-react

For Node/Express apps:
- Include package.json with "start": "node server.js"
- Include server.js with proper Express setup

Return ONLY valid JSON. No markdown, no explanations outside JSON.
`;

// ============================================================
// MODEL CREATION
// ============================================================

function createModel(modelName) {
    try {
        return genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: SYSTEM_INSTRUCTION,
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.4,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 4096,
            }
        });
    } catch (error) {
        console.error(`❌ Failed to create model ${modelName}:`, error.message);
        return null;
    }
}

// ============================================================
// SAFE JSON PARSER
// ============================================================

function safeJsonParse(text) {
    if (!text || typeof text !== "string") {
        throw new Error("AI returned an empty response");
    }

    console.log('📄 Raw AI response length:', text.length);

    try {
        return JSON.parse(text);
    } catch (e) {
        console.log('Direct JSON parse failed');
    }

    const cleaned = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    try {
        return JSON.parse(cleaned);
    } catch (e) {
        console.log('Cleaned JSON parse failed');
    }

    const start = cleaned.indexOf("{");
    if (start === -1) {
        if (cleaned.length < 500) {
            return { text: cleaned, fileTree: {} };
        }
        throw new Error("AI response does not contain valid JSON");
    }

    let depth = 0;
    let inString = false;
    let escapeNext = false;

    for (let i = start; i < cleaned.length; i++) {
        const char = cleaned[i];

        if (escapeNext) {
            escapeNext = false;
            continue;
        }

        if (char === "\\") {
            escapeNext = true;
            continue;
        }

        if (char === '"') {
            inString = !inString;
            continue;
        }

        if (inString) continue;

        if (char === "{") depth++;
        if (char === "}") {
            depth--;
            if (depth === 0) {
                const jsonString = cleaned.slice(start, i + 1);
                try {
                    return JSON.parse(jsonString);
                } catch (error) {
                    throw new Error(`Malformed JSON: ${error.message}`);
                }
            }
        }
    }

    throw new Error("Incomplete JSON response");
}

// ============================================================
// VALIDATE FILE TREE
// ============================================================

function validateFileTree(tree) {
    if (!tree || typeof tree !== "object") {
        console.error('Invalid tree: not an object');
        return false;
    }

    if (Array.isArray(tree)) {
        console.error('Invalid tree: is an array');
        return false;
    }

    let hasValidFile = false;

    function walk(node, path = '') {
        if (!node || typeof node !== "object") return false;

        for (const [key, value] of Object.entries(node)) {
            const currentPath = path ? `${path}/${key}` : key;
            
            if (value?.file) {
                if (typeof value.file.contents !== "string") {
                    console.error(`❌ File ${currentPath} has invalid contents`);
                    return false;
                }
                if (value.file.contents.trim() === "") {
                    console.warn(`⚠️ File ${currentPath} is empty`);
                }
                hasValidFile = true;
                continue;
            }

            if (value && typeof value === "object") {
                if (!walk(value, currentPath)) {
                    return false;
                }
            }
        }
        return true;
    }

    const result = walk(tree);
    if (!result) return false;
    if (!hasValidFile) {
        console.warn('⚠️ File tree has no files with content');
    }
    return true;
}

// ============================================================
// FIND PACKAGE.JSON
// ============================================================

function findPackageJson(tree) {
    if (!tree || typeof tree !== "object") return null;

    for (const [key, value] of Object.entries(tree)) {
        if (key === "package.json" && value && value.file && typeof value.file.contents === "string") {
            return value;
        }
        if (value && typeof value === "object" && !value.file) {
            const result = findPackageJson(value);
            if (result) return result;
        }
    }
    return null;
}

// ============================================================
// FIND ENTRY FILE
// ============================================================

function findEntryFile(tree) {
    if (!tree || typeof tree !== "object") return "server.js";

    const candidates = ["server.js", "index.js", "app.js", "main.jsx", "App.jsx"];
    for (const name of candidates) {
        if (tree[name] && tree[name].file) return name;
        if (tree.src && tree.src[name] && tree.src[name].file) return `src/${name}`;
    }
    return "server.js";
}

// ============================================================
// ENSURE START SCRIPT
// ============================================================

function ensureStartScript(fileTree) {
    if (!fileTree || typeof fileTree !== "object") return fileTree;

    const packageNode = findPackageJson(fileTree);
    if (!packageNode) {
        const defaultPackage = {
            name: "codesync-generated-app",
            version: "1.0.0",
            scripts: { start: "node server.js" }
        };
        fileTree["package.json"] = {
            file: { contents: JSON.stringify(defaultPackage, null, 2) }
        };
        console.log('📦 Created default package.json');
        return fileTree;
    }

    let packageJson;
    try {
        packageJson = JSON.parse(packageNode.file.contents);
    } catch (e) {
        console.error('❌ Invalid package.json, recreating...');
        packageJson = {
            name: "codesync-generated-app",
            version: "1.0.0",
            scripts: {}
        };
    }

    if (!packageJson.scripts) packageJson.scripts = {};
    
    if (!packageJson.scripts.start) {
        const deps = { ...(packageJson.dependencies || {}), ...(packageJson.devDependencies || {}) };
        if (deps.vite) {
            packageJson.scripts.start = "vite";
        } else if (deps["react-scripts"]) {
            packageJson.scripts.start = "react-scripts start";
        } else {
            const entry = findEntryFile(fileTree);
            packageJson.scripts.start = `node ${entry}`;
        }
        console.log(`📦 Added start script: ${packageJson.scripts.start}`);
    }

    if (!packageJson.scripts.dev && packageJson.dependencies?.vite) {
        packageJson.scripts.dev = "vite";
    }

    packageNode.file.contents = JSON.stringify(packageJson, null, 2);
    return fileTree;
}

// ============================================================
// NORMALIZE RESPONSE
// ============================================================

function normalizeResponse(parsed) {
    if (!parsed || typeof parsed !== "object") {
        throw new Error("Invalid AI response");
    }

    if (typeof parsed.text !== "string") {
        parsed.text = "Code generated successfully.";
    }

    if (!parsed.fileTree) {
        parsed.fileTree = {};
    }

    if (typeof parsed.fileTree !== "object" || Array.isArray(parsed.fileTree)) {
        throw new Error("Invalid fileTree structure");
    }

    if (!parsed.buildCommand) {
        parsed.buildCommand = { mainItem: "npm", commands: ["install"] };
    }

    if (!parsed.startCommand) {
        parsed.startCommand = { mainItem: "npm", commands: ["start"] };
    }

    if (parsed.fileTree && Object.keys(parsed.fileTree).length > 0) {
        if (!validateFileTree(parsed.fileTree)) {
            console.warn('⚠️ File tree validation failed, but continuing...');
        }
        parsed.fileTree = ensureStartScript(parsed.fileTree);
    }

    return parsed;
}

// ============================================================
// RETRY LOGIC
// ============================================================

function isRetryableError(error) {
    const message = error?.message?.toLowerCase() || "";
    return (
        message.includes("503") ||
        message.includes("429") ||
        message.includes("quota") ||
        message.includes("rate limit") ||
        message.includes("timeout") ||
        message.includes("500") ||
        message.includes("unavailable") ||
        message.includes("overloaded")
    );
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
// GENERATE RESULT
// ============================================================

export const generateResult = async (prompt) => {
    if (typeof prompt !== "string" || prompt.trim().length === 0) {
        throw new Error("Prompt is required");
    }

    if (prompt.length > 20000) {
        throw new Error("Prompt is too long. Maximum 20,000 characters.");
    }

    console.log('🤖 CodeSync AI: Starting generation...');
    console.log(`📝 Prompt: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`);

    const maxRetries = 2;
    const baseDelay = 2000;
    let lastError = null;

    for (const modelName of MODEL_NAMES) {
        console.log(`🔄 Trying model: ${modelName}`);
        const model = createModel(modelName);
        if (!model) {
            console.warn(`⚠️ Could not create model: ${modelName}`);
            continue;
        }

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                console.log(`📡 Attempt ${attempt + 1}/${maxRetries} with ${modelName}`);
                
                const result = await model.generateContent(prompt);
                const response = result.response;
                const text = response.text();

                if (!text) {
                    throw new Error("Empty response from Gemini");
                }

                console.log('📄 Parsing JSON response...');
                const parsed = safeJsonParse(text);
                console.log('✅ JSON parsed successfully');

                const normalized = normalizeResponse(parsed);
                console.log(`✅ CodeSync AI → Success using ${modelName}`);
                
                return normalized;

            } catch (error) {
                lastError = error;
                console.error(`❌ CodeSync AI error [${modelName}] attempt ${attempt + 1}:`, error.message);
                
                if (error.message?.includes('API key')) {
                    throw new Error('Invalid or missing Google AI API key. Please check your environment variables.');
                }

                if (error.message?.includes('permission') || error.message?.includes('enabled')) {
                    throw new Error('Gemini API is not enabled. Please enable it at: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
                }

                if (error.message?.includes('model') || error.message?.includes('not found') || error.message?.includes('available')) {
                    console.log(`⛔ Model ${modelName} not available, trying next...`);
                    break;
                }

                if (!isRetryableError(error)) {
                    console.log('⛔ Non-retryable error, moving to next model');
                    break;
                }

                if (attempt < maxRetries - 1) {
                    const delay = baseDelay * Math.pow(2, attempt);
                    console.log(`⏳ Retrying in ${delay / 1000}s...`);
                    await sleep(delay);
                }
            }
        }
    }

    if (lastError) {
        const message = lastError.message || "Unknown error";

        if (message.includes("API key") || message.includes("API_KEY")) {
            throw new Error("Google AI API key is invalid or missing. Please check your .env file.");
        }

        if (message.includes("permission") || message.includes("enabled")) {
            throw new Error("Gemini API is not enabled. Please enable it at: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com");
        }

        if (message.includes("model") || message.includes("not found") || message.includes("available")) {
            throw new Error(`Gemini model not available. Please check your API key and model permissions. Error: ${message}`);
        }

        if (message.includes("quota") || message.includes("429")) {
            throw new Error("Google AI quota/rate limit reached. Please try again later.");
        }

        throw new Error(`CodeSync AI failed: ${message}`);
    }

    throw new Error("CodeSync AI failed to generate a response. Please try again.");
};

export default { generateResult };