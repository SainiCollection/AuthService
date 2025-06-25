import { Request, Response, Router } from "express";
import { signup, verifyEmail } from '../controller/signup.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: |
 *       Registers a new user.
 *       - If the email is already registered and verified, returns an error.
 *       - If the email is registered but not verified, a new verification email is sent.
 *       - If not registered, creates the user and sends a verification email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - app_name
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *              app_name:
 *                type: string
 *               example: MyApp
 *     responses:
 *       201:
 *         description: Signup successful, verification email sent
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
 *                   example: Signup successful! Please check your email to verify your account.
 *       200:
 *         description: User exists but not verified, verification email resent
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
 *                   example: Already registered but not verified. Verification email resent.
 *       400:
 *         description: Missing required fields
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
 *                   example: All fields are required
 *       401:
 *         description: User already exists and is verified
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
 *                   example: User already exists and is verified!
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
 *                   example: Signup failed
 */

router.post("/api/v1/auth/signup", (req: Request, res: Response) => {
    signup(req, res)
})

/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   get:
 *     summary: Verify a user's email
 *     tags: [Auth]
 *     description: |
 *       Verifies a user's email using a token provided as a query parameter.
 *       - If the token is missing or invalid, an error is returned.
 *       - If the token is valid, the user is marked as verified.
 *     parameters:
 *       - in: query
 *         name: emailVerifyToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Email verified successfully!
 *       400:
 *         description: Missing token
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
 *                   example: Missing token
 *       401:
 *         description: Invalid or expired token
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
 *                   example: Invalid or expired token
 */

router.get("/api/v1/auth/verify-email", (req: Request, res: Response) => {
    verifyEmail(req, res)
})

export default router;