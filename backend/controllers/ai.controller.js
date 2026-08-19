import * as ai from "../services/ai.service.js";
import * as projectService from "../services/project.service.js";

// ============================================================
// GET AI RESULT
// ============================================================

export const getResult = async (req, res) => {
    try {
        const { prompt } = req.query;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required"
            });
        }

        const result = await ai.generateResult(prompt);
        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("AI generation error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to generate AI response"
        });
    }
};

// ============================================================
// GENERATE PROJECT USING AI
// ============================================================

export const generateProject = async (req, res) => {
    try {
        const { projectId, prompt } = req.body;

        console.log('📝 AI Generation Request:', { 
            projectId, 
            prompt: prompt?.slice(0, 50),
            hasUser: !!req.user
        });

        // ----------------------------------------------------
        // Validate project ID
        // ----------------------------------------------------
        if (!projectId) {
            console.error('❌ Missing projectId');
            return res.status(400).json({
                success: false,
                message: "projectId is required"
            });
        }

        // ----------------------------------------------------
        // Validate prompt
        // ----------------------------------------------------
        if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
            console.error('❌ Missing or invalid prompt');
            return res.status(400).json({
                success: false,
                message: "prompt is required and must be a non-empty string"
            });
        }

        // ----------------------------------------------------
        // Generate using Gemini AI
        // ----------------------------------------------------
        console.log('🤖 Calling AI service...');
        let result;
        try {
            result = await ai.generateResult(prompt.trim());
        } catch (aiError) {
            console.error('❌ AI service error:', aiError.message);
            console.error('Stack:', aiError.stack);
            return res.status(500).json({
                success: false,
                message: aiError.message || "AI service failed to generate a response"
            });
        }

        // ----------------------------------------------------
        // Validate AI response
        // ----------------------------------------------------
        if (!result) {
            console.error('❌ AI returned null/undefined');
            return res.status(500).json({
                success: false,
                message: "AI did not return any response"
            });
        }

        console.log('✅ AI service response received');

        // ----------------------------------------------------
        // Validate fileTree
        // ----------------------------------------------------
        if (!result.fileTree || typeof result.fileTree !== "object") {
            console.error('❌ Invalid fileTree:', typeof result.fileTree);
            return res.status(500).json({
                success: false,
                message: "AI did not generate a valid file tree"
            });
        }

        const fileCount = Object.keys(result.fileTree).length;
        console.log(`📁 File tree has ${fileCount} top-level items`);

        if (fileCount === 0) {
            console.error('❌ Empty fileTree');
            return res.status(500).json({
                success: false,
                message: "AI generated an empty file tree. Please try again with a more specific prompt."
            });
        }

        // ----------------------------------------------------
        // Save file tree to project
        // ----------------------------------------------------
        console.log('💾 Saving file tree to project...');
        let project;
        try {
            project = await projectService.updateFileTree({
                projectId,
                fileTree: result.fileTree,
                userId: req.user?._id
            });
        } catch (dbError) {
            console.error('❌ Database error:', dbError.message);
            console.error('Stack:', dbError.stack);
            return res.status(500).json({
                success: false,
                message: "Failed to save generated files to database"
            });
        }

        if (!project) {
            console.error('❌ Project not found or unauthorized');
            return res.status(404).json({
                success: false,
                message: "Project not found or you don't have access"
            });
        }

        console.log('✅ Project saved successfully');

        // ----------------------------------------------------
        // Return success response
        // ----------------------------------------------------
        return res.status(200).json({
            success: true,
            message: "AI project generated successfully",
            project: project,
            ai: {
                text: result.text || "Project generated successfully!",
                fileTree: result.fileTree,
                buildCommand: result.buildCommand || { mainItem: "npm", commands: ["install"] },
                startCommand: result.startCommand || { mainItem: "npm", commands: ["start"] }
            }
        });

    } catch (error) {
        console.error('❌ Generate project error:', error);
        console.error('Stack:', error.stack);
        
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to generate project. Please try again."
        });
    }
};