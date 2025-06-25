import { Router, Request, Response } from "express";
import {
  suspendUserAccount,
  reactivateSuspendedUserAccount,
} from "../controller/suspendAccount.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User account suspension management
 */

/**
 * @swagger
 * /suspend-account:
 *   post:
 *     summary: Suspend a user account
 *     tags: [User]
 *     description: Suspend a user account by providing the user ID and a suspend reason.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - suspendReason
 *             properties:
 *               id:
 *                 type: string
 *                 description: User ID to suspend
 *                 example: "123"
 *               suspendReason:
 *                 type: string
 *                 description: Reason for suspension
 *                 example: "Violation of community guidelines"
 *     responses:
 *       200:
 *         description: User account suspended successfully
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
 *                   example: User account suspended successfully
 *       400:
 *         description: Missing or invalid fields
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
 *                   example: User ID and suspendReason are required
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
router.post("/suspend-account", (req: Request, res: Response) => {
  suspendUserAccount(req, res);
});

/**
 * @swagger
 * /unsuspend-account:
 *   post:
 *     summary: Reactivate a suspended user account
 *     tags: [User]
 *     description: Reactivates a previously suspended user account by providing the user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: User ID to reactivate
 *                 example: "123"
 *     responses:
 *       200:
 *         description: User account reactivated successfully
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
 *                   example: User account reactivated successfully
 *       400:
 *         description: Missing user ID
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
 *                   example: User ID is required
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
router.post("/unsuspend-account", (req: Request, res: Response) => {
  reactivateSuspendedUserAccount(req, res);
});

export default router;
