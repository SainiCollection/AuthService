import { Request, Response, Router } from "express";
import { forgotPassword, resetPassword } from "../controller/forgotPassword.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Initiate password reset
 *     tags: [Auth]
 *     description: Sends a reset link to the user's email (primary or recovery email).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               useRecoveryEmail:
 *                 type: boolean
 *                 description: Send reset link to recovery email if true
 *                 example: true
 *     responses:
 *       201:
 *         description: Password reset link sent
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
 *                   example: Reset password link sent to recovery email
 *       401:
 *         description: Missing or invalid email
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
 *                   example: Email is required
 */
router.post("/forgot-password", (req: Request, res: Response) => {
  forgotPassword(req, res);
});

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     description: Resets the user's password using a valid token sent via email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resetPasswordToken
 *               - newPassword
 *             properties:
 *               resetPasswordToken:
 *                 type: string
 *                 description: Token sent to the user’s email
 *                 example: "abc123def456ghi789"
 *               newPassword:
 *                 type: string
 *                 description: New password to set
 *                 example: "NewSecurePassword@123"
 *     responses:
 *       201:
 *         description: Password reset successful
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
 *                   example: Password reset Successfully!
 *       400:
 *         description: Missing token or password
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
 *                   example: Token and new password are required
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
 *                   example: Reset failed
 */
router.post("/reset-password", (req: Request, res: Response) => {
  resetPassword(req, res);
});

export default router;
