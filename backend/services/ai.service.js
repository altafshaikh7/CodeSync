import { GoogleGenerativeAI } from "@google/generative-ai";


// ============================================================
// CONFIGURATION
// ============================================================

const API_KEY = process.env.GOOGLE_AI_KEY;

if (!API_KEY) {
    throw new Error("GOOGLE_AI_KEY is missing from environment variables");
}

const genAI = new GoogleGenerativeAI(API_KEY);


// Primary model = better for code generation
// Fallback model = lightweight + structured JSON friendly
const MODEL_NAMES = [
    "gemini-flash-latest",
    "gemini-3.5-flash-lite"
];


// ============================================================
// SYSTEM INSTRUCTION
// ============================================================

const SYSTEM_INSTRUCTION = `
You are CodeSync AI, an expert MERN stack developer with 10+ years
of professional software engineering experience.

You build production-quality applications using:

- React
- Vite
- Node.js
- Express.js
- MongoDB
- Mongoose
- JavaScript
- TypeScript
- REST APIs
- Authentication
- JWT
- WebSockets
- Socket.IO
- Tailwind CSS

You write:

- modular code
- scalable architecture
- secure code
- maintainable code
- reusable components
- clean APIs
- proper error handling
- production-ready implementations


============================================================
RESPONSE FORMAT
============================================================

ALWAYS return ONE valid JSON object.

The JSON structure MUST be:

{
    "text": "Explain what was created",
    "fileTree": {},
    "buildCommand": {
        "mainItem": "npm",
        "commands": ["install"]
    },
    "startCommand": {
        "mainItem": "npm",
        "commands": ["start"]
    }
}


============================================================
FILE TREE RULES
============================================================

Every file MUST use:

{
    "filename.ext": {
        "file": {
            "contents": "file content"
        }
    }
}


Example:

{
    "src": {
        "App.jsx": {
            "file": {
                "contents": "export default function App() {}"
            }
        }
    }
}


Folders are plain objects.

Files MUST contain:

{
    "file": {
        "contents": "..."
    }
}


NEVER use this:

{
    "src/App.jsx": {
        "file": {
            "contents": "..."
        }
    }
}


Instead use:

{
    "src": {
        "App.jsx": {
            "file": {
                "contents": "..."
            }
        }
    }
}


============================================================
PACKAGE.JSON RULES
============================================================

ALWAYS include package.json for generated applications.

package.json MUST:

1. Contain all required dependencies.
2. Contain all packages imported by the source code.
3. Contain a valid start script.
4. Contain valid JSON.
5. Use compatible package versions.


For Vite:

"scripts": {
    "dev": "vite",
    "start": "vite",
    "build": "vite build"
}


For Express:

"scripts": {
    "start": "node server.js"
}


For Node:

"scripts": {
    "start": "node index.js"
}


============================================================
REACT RULES
============================================================

For React + Vite applications:

- Use React components.
- Use proper imports.
- Use Vite.
- Include package.json.
- Include index.html.
- Include src/main.jsx.
- Include src/App.jsx.
- Include CSS when required.
- Ensure all imports point to existing files.


============================================================
MERN RULES
============================================================

For MERN applications:

Frontend:

React + Vite

Backend:

Node.js + Express

Database:

MongoDB + Mongoose


Use a clean structure such as:

client/
server/

or:

frontend/
backend/


Do not invent dependencies that are not required.


============================================================
ERROR HANDLING
============================================================

Generated applications should handle:

- invalid input
- missing parameters
- database errors
- API errors
- authentication errors
- network errors

Do not expose secrets in frontend code.


============================================================
SECURITY
============================================================

NEVER hardcode:

- API keys
- passwords
- JWT secrets
- database passwords
- OAuth secrets

Use environment variables.


============================================================
CODE QUALITY
============================================================

Write complete working code.

Do not generate:

- TODO placeholders
- "implement later"
- empty functions
- undefined variables
- fake imports
- missing dependencies
- broken paths


============================================================
SIMPLE REQUESTS
============================================================

If the user asks a normal question instead of requesting an application,
return:

{
    "text": "Your helpful answer",
    "fileTree": {}
}


============================================================
FINAL REQUIREMENT
============================================================

Return ONLY valid JSON.

Do not wrap the JSON in markdown.

Do not add explanations outside the JSON.
`;


// ============================================================
// MODEL CREATION
// ============================================================

function createModel(modelName) {
    return genAI.getGenerativeModel({
        model: modelName,

        systemInstruction: SYSTEM_INSTRUCTION,

        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.4
        }
    });
}


// ============================================================
// SAFE JSON PARSER
// ============================================================

function safeJsonParse(text) {

    if (!text || typeof text !== "string") {
        throw new Error("AI returned an empty response");
    }


    // --------------------------------------------------------
    // Attempt 1: Direct JSON parse
    // --------------------------------------------------------

    try {
        return JSON.parse(text);
    } catch {
        // Continue to fallback parser
    }


    // --------------------------------------------------------
    // Remove markdown code fences
    // --------------------------------------------------------

    const cleaned = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();


    try {
        return JSON.parse(cleaned);
    } catch {
        // Continue
    }


    // --------------------------------------------------------
    // Find first JSON object
    // --------------------------------------------------------

    const start = cleaned.indexOf("{");

    if (start === -1) {
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


        if (inString) {
            continue;
        }


        if (char === "{") {
            depth++;
        }


        if (char === "}") {

            depth--;


            if (depth === 0) {

                const jsonString = cleaned.slice(start, i + 1);

                try {
                    return JSON.parse(jsonString);
                } catch (error) {
                    throw new Error(
                        `AI returned malformed JSON: ${error.message}`
                    );
                }
            }
        }
    }


    throw new Error("AI response contains incomplete JSON");
}


// ============================================================
// FIND PACKAGE.JSON
// ============================================================

function findPackageJson(tree) {

    if (!tree || typeof tree !== "object") {
        return null;
    }


    for (const [key, value] of Object.entries(tree)) {

        if (
            key === "package.json" &&
            value &&
            value.file &&
            typeof value.file.contents === "string"
        ) {
            return value;
        }


        if (
            value &&
            typeof value === "object" &&
            !value.file
        ) {

            const result = findPackageJson(value);

            if (result) {
                return result;
            }
        }
    }


    return null;
}


// ============================================================
// FIND ENTRY FILE
// ============================================================

function findEntryFile(tree) {

    if (!tree || typeof tree !== "object") {
        return "server.js";
    }


    const candidates = [
        "server.js",
        "index.js",
        "app.js"
    ];


    for (const fileName of candidates) {

        if (
            tree[fileName] &&
            tree[fileName].file &&
            tree[fileName].file.contents
        ) {
            return fileName;
        }
    }


    return "server.js";
}


// ============================================================
// ENSURE PACKAGE.JSON START SCRIPT
// ============================================================

function ensureStartScript(fileTree) {

    if (!fileTree || typeof fileTree !== "object") {
        return fileTree;
    }


    const packageNode = findPackageJson(fileTree);


    if (!packageNode) {
        return fileTree;
    }


    let packageJson;


    try {

        packageJson = JSON.parse(
            packageNode.file.contents
        );

    } catch {

        packageJson = {
            name: "codesync-generated-app",
            version: "1.0.0"
        };
    }


    if (!packageJson.scripts) {
        packageJson.scripts = {};
    }


    if (!packageJson.scripts.start) {

        const dependencies = {
            ...(packageJson.dependencies || {}),
            ...(packageJson.devDependencies || {})
        };


        if (dependencies["vite"]) {

            packageJson.scripts.start = "vite";

        } else if (dependencies["react-scripts"]) {

            packageJson.scripts.start =
                "react-scripts start";

        } else {

            packageJson.scripts.start =
                `node ${findEntryFile(fileTree)}`;
        }
    }


    packageNode.file.contents =
        JSON.stringify(packageJson, null, 2);


    return fileTree;
}


// ============================================================
// VALIDATE FILE TREE
// ============================================================

function validateFileTree(tree) {

    if (!tree || typeof tree !== "object") {
        return false;
    }


    function walk(node) {

        if (!node || typeof node !== "object") {
            return false;
        }


        for (const [key, value] of Object.entries(node)) {

            // File
            if (value?.file) {

                if (
                    typeof value.file.contents !== "string" ||
                    value.file.contents.trim() === ""
                ) {
                    return false;
                }

                continue;
            }


            // Folder
            if (!walk(value)) {
                return false;
            }
        }


        return true;
    }


    return walk(tree);
}


// ============================================================
// NORMALIZE AI RESPONSE
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


    if (
        typeof parsed.fileTree !== "object" ||
        Array.isArray(parsed.fileTree)
    ) {
        throw new Error("AI returned an invalid fileTree");
    }


    if (!parsed.buildCommand) {

        parsed.buildCommand = {
            mainItem: "npm",
            commands: ["install"]
        };
    }


    if (!parsed.startCommand) {

        parsed.startCommand = {
            mainItem: "npm",
            commands: ["start"]
        };
    }


    if (parsed.fileTree && Object.keys(parsed.fileTree).length > 0) {

        if (!validateFileTree(parsed.fileTree)) {
            throw new Error("AI generated an invalid file tree");
        }


        parsed.fileTree =
            ensureStartScript(parsed.fileTree);
    }


    return parsed;
}


// ============================================================
// DETECT RETRYABLE ERRORS
// ============================================================

function isRetryableError(error) {

    const message =
        error?.message?.toLowerCase() || "";


    return (
        message.includes("503") ||
        message.includes("service unavailable") ||
        message.includes("429") ||
        message.includes("too many requests") ||
        message.includes("rate limit") ||
        message.includes("quota") ||
        message.includes("temporarily unavailable") ||
        message.includes("overloaded") ||
        message.includes("deadline exceeded")
    );
}


// ============================================================
// DELAY
// ============================================================

function sleep(ms) {

    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}


// ============================================================
// GENERATE RESULT
// ============================================================

export const generateResult = async (prompt) => {

    // --------------------------------------------------------
    // Validate prompt
    // --------------------------------------------------------

    if (
        typeof prompt !== "string" ||
        prompt.trim().length === 0
    ) {
        throw new Error("Prompt is required");
    }


    if (prompt.length > 20000) {
        throw new Error(
            "Prompt is too long. Maximum allowed length is 20,000 characters."
        );
    }


    // --------------------------------------------------------
    // Configuration
    // --------------------------------------------------------

    const maxRetries = 3;

    const baseDelay = 2000;


    let lastError = null;


    // --------------------------------------------------------
    // Try each model
    // --------------------------------------------------------

    for (const modelName of MODEL_NAMES) {

        const model = createModel(modelName);


        for (let attempt = 0; attempt < maxRetries; attempt++) {

            try {

                console.log(
                    `CodeSync AI → ${modelName} | attempt ${attempt + 1}/${maxRetries}`
                );


                const result =
                    await model.generateContent(prompt);


                const response =
                    result.response;


                const text =
                    response.text();


                if (!text) {
                    throw new Error(
                        "Gemini returned an empty response"
                    );
                }


                const parsed =
                    safeJsonParse(text);


                const normalized =
                    normalizeResponse(parsed);


                console.log(
                    `CodeSync AI → Success using ${modelName}`
                );


                return normalized;


            } catch (error) {

                lastError = error;


                console.error(
                    `CodeSync AI error [${modelName}] attempt ${attempt + 1}:`,
                    error.message
                );


                // ------------------------------------------------
                // Don't retry permanent errors
                // ------------------------------------------------

                if (!isRetryableError(error)) {

                    break;
                }


                // ------------------------------------------------
                // Retry with exponential backoff
                // ------------------------------------------------

                if (attempt < maxRetries - 1) {

                    const delay =
                        baseDelay * Math.pow(2, attempt);


                    console.log(
                        `Retrying in ${delay / 1000}s...`
                    );


                    await sleep(delay);
                }
            }
        }


        console.warn(
            `CodeSync AI → ${modelName} unavailable. Trying fallback model...`
        );
    }


    // ========================================================
    // FINAL ERROR
    // ========================================================

    if (lastError) {

        const message =
            lastError.message || "Unknown Gemini API error";


        if (
            message.includes("API key") ||
            message.includes("API_KEY")
        ) {

            throw new Error(
                "Google AI API key is invalid or missing."
            );
        }


        if (
            message.includes("quota") ||
            message.includes("429")
        ) {

            throw new Error(
                "Google AI quota/rate limit reached. Please try again later."
            );
        }


        if (
            message.includes("503") ||
            message.includes("Service Unavailable")
        ) {

            throw new Error(
                "Google Gemini is temporarily unavailable. Please try again shortly."
            );
        }


        throw new Error(
            `CodeSync AI failed: ${message}`
        );
    }


    throw new Error(
        "CodeSync AI failed to generate a response."
    );
};