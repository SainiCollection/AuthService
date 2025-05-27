import { recoveryUserEmail } from "../controller/recoveryEmail.controller";
import { Router } from "express";
const router = Router();

/**
 * @swagger
 * /api/v1/auth/recovery-email:
 *   post:
 *     summary: Update user's recovery email
 *     tags: [User]
 *     description: Updates the recovery email address for the specified user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - recoveryEmail
 *             properties:
 *               id:
 *                 type: string
 *                 description: User ID
 *                 example: "123"
 *               recoveryEmail:
 *                 type: string
 *                 format: email
 *                 description: New recovery email address
 *                 example: "user.recovery@example.com"
 *     responses:
 *       200:
 *         description: Recovery email updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Recovery email updated successfully
 *       400:
 *         description: Missing user ID or recovery email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User ID and recovery email are required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.post("/api/v1/auth/recovery-email", recoveryUserEmail);
export default router;
