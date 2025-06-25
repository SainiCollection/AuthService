import { recoveryUserEmail } from "../controller/recoveryEmail.controller";
import { Request, Response, Router } from "express";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile and account utilities
 */

/**
 * @swagger
 * /recovery-email:
 *   post:
 *     summary: Update user's recovery email
 *     tags: [User]
 *     description: Updates the recovery email address for a user account.
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
router.post("/recovery-email", (req: Request, res: Response) => {
  recoveryUserEmail(req, res);
});

export default router;
