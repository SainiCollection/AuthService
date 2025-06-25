import { Router } from "express";
import { defaultMessage } from "../controller/default.controller";

const router = Router();

/**
 * 
 * @swagger
 * /:
 *   get:
 *     summary: Default welcome message
 *     tags: [Default]
 *     description: Returns a confirmation message indicating the AuthService is running.
 *     responses:
 *       202:
 *         description: Service confirmation message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: This is AuthService Service
 */
router.get("/", defaultMessage);

export default router;
