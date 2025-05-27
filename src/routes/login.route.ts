import { loginUser } from "../controller/login.controller";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     description: Logs in a user using email and password. Handles account lockout, suspension, deactivation, deletion, and email verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: yourPassword123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: jwt_token_string_here
 *                 message:
 *                   type: string
 *                   example: User login successfully!!
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *       400:
 *         description: User not found
 *       401:
 *         description: Missing email or password
 *       402:
 *         description: Account is locked due to too many failed login attempts
 *       403:
 *         description: Invalid password
 *       404:
 *         description: User is suspended
 *       405:
 *         description: User is deactivated
 *       406:
 *         description: User is deleted
 *       407:
 *         description: User is not verified
 *       500:
 *         description: Server error
 */

router.post("/api/v1/auth/login", loginUser);

export default router;