import { Request, Response, Router } from "express";
import { forgotPassword, resetPassword } from "../controller/forgotPassword.controller";

const router = Router();

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Initiate password reset
 *     tags: [Auth]
 *     description: Sends a password reset link to the user's email. Optionally, a recovery email can be used if available.
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
 *                 description: Whether to send the reset link to a recovery email
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

router.post('/api/v1/auth/forgot-password', (req:Request, res:Response)=>{
    forgotPassword(req, res)
} )


/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     description: Resets the user's password using a valid reset token.
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
 *                 description: The password reset token sent to the user's email
 *                 example: "e3f3f9909e2b2c8e4d62db847f30dc27"
 *               newPassword:
 *                 type: string
 *                 description: The new password to be set
 *                 example: "MyNewSecurePassword123!"
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
 */

router.post('/api/v1/auth/reset-password', (req:Request, res:Response)=>{
    resetPassword(req, res)
} )

export default router