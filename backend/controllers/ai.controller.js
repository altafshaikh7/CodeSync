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
                message: "Prompt is required"
            });
        }


        const result =
            await ai.generateResult(prompt);


        return res.status(200).json(result);

    } catch (error) {

        console.error(
            "AI generation error:",
            error
        );


        return res.status(500).json({
            message: error.message
        });
    }
};


// ============================================================
// GENERATE PROJECT USING AI
// ============================================================

export const generateProject = async (req, res) => {

    try {

        const {
            projectId,
            prompt
        } = req.body;


        // ----------------------------------------------------
        // Validate project ID
        // ----------------------------------------------------

        if (!projectId) {

            return res.status(400).json({
                message: "projectId is required"
            });
        }


        // ----------------------------------------------------
        // Validate prompt
        // ----------------------------------------------------

        if (
            !prompt ||
            typeof prompt !== "string" ||
            !prompt.trim()
        ) {

            return res.status(400).json({
                message: "prompt is required"
            });
        }


        // ----------------------------------------------------
        // Generate using Gemini
        // ----------------------------------------------------

        const result =
            await ai.generateResult(
                prompt.trim()
            );


        // ----------------------------------------------------
        // Validate AI response
        // ----------------------------------------------------

        if (
            !result ||
            !result.fileTree ||
            typeof result.fileTree !== "object"
        ) {

            return res.status(500).json({
                message:
                    "AI did not generate a valid file tree"
            });
        }


        // ----------------------------------------------------
        // Save AI generated file tree
        // ----------------------------------------------------

        const project =
            await projectService.updateFileTree({

                projectId,

                fileTree: result.fileTree,

                userId: req.user._id

            });


        // ----------------------------------------------------
        // Return result
        // ----------------------------------------------------

        return res.status(200).json({

            success: true,

            message:
                "AI project generated successfully",

            project,

            ai: result

        });

    } catch (error) {

        console.error(
            "Generate project error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: error.message

        });
    }
};