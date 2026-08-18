import { Router } from "express";

import * as aiController from "../controllers/ai.controller.js";

import { authUser } from "../middleware/auth.middleware.js";


const router = Router();


// ============================================================
// AI RESULT
// ============================================================

router.get(
    "/get-result",

    authUser,

    aiController.getResult
);


// ============================================================
// AI → GENERATE PROJECT
// ============================================================

router.post(
    "/generate-project",

    authUser,

    aiController.generateProject
);


export default router;