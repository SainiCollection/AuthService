import { Request, Response, Router } from "express";
import { signup, verifyEmail } from "../controller/signup.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and verification endpoints
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: Register a new user. Handles existing users (verified and unverified), sends email verification.
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
 *               - appName
 *               - redirectUrl
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
 *                 example: StrongPass123!
 *               appName:
 *                 type: string
 *                 example: PortfolioApp
 *               redirectUrl:
 *                 type: string
 *                 example: https://portfolio.example.com
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
 *                   example: user_exists
 *                 message:
 *                   type: string
 *                   example: User already exists, new app access granted.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     appName:
 *                       type: string
 *                     redirectUrl:
 *                       type: string
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
router.post("/signup", (req: Request, res: Response) => {
  signup(req, res);
});

/**
 * @swagger
 * /verify-email:
 *   get:
 *     summary: Verify email using token
 *     tags: [Auth]
 *     description: Verifies a user's email using a token provided in the query parameter.
 *     parameters:
 *       - in: query
 *         name: emailVerifyToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token sent to the user
 *     responses:
 *       200:
 *         description: Email verified successfully (redirects to frontend)
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Redirect to frontend success page
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
router.get("/verify-email", (req: Request, res: Response) => {
  verifyEmail(req, res);
});

export default router;
