import { loginUser } from "../controller/login.controller";
import { Request, Response, Router } from "express";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     description: Logs in a user using email and password. Handles lockout, suspension, deactivation, deletion, and verification checks.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - app_name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: yourPassword123
 *               app_name:
 *                 type: string
 *                 example: MyApp
 *     responses:
 *       200:
 *         description: Login response (success or conditional errors)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: success
 *                     token:
 *                       type: string
 *                       example: jwt_token_string_here
 *                     message:
 *                       type: string
 *                       example: User login successfully!
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         email:
 *                           type: string
 *                         username:
 *                           type: string
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         appName:
 *                           type: string
 *                         redirectUrl:
 *                           type: string
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       enum:
 *                         - fill_all_feilds
 *                         - user_not_found
 *                         - account_locked
 *                         - invalid_password
 *                         - user_suspended
 *                         - user_deactivated
 *                         - user_deleted
 *                         - user_not_verified
 *                     message:
 *                       type: string
 *                       example: One of the conditional error messages
 *       500:
 *         description: Server or unexpected error
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
 *                   example: Server error or unexpected issue. Please try again.
 */

router.post("/login", (req: Request, res: Response) => {
  loginUser(req, res);
});

export default router;
