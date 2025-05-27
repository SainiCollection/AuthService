import { Request, Response } from "express";
import {
  deactivateAccount,
  reactivateAccount,
  findUserByIdService,
} from "../service/accountDeactivate.service";

// deactivate user account
export const deactivateUserAccount = async (req: Request, res: Response) => {
  try {
    const { id, deactivateReason } = req.body;
    const userId = parseInt(id);
    if (!userId || !deactivateReason) {
      return res
        .status(401)
        .json({ status: "error", message: "All fields are required" });
    }
    const user = await findUserByIdService(userId);
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "User not found" });
    }

    if (user.is_deactivated) {
      return res
        .status(402)
        .json({
          status: "error",
          message: "User account is already deactivated",
        });
    }
    await deactivateAccount(userId, deactivateReason);
    return res
      .status(200)
      .json({
        status: "success",
        message: "User account deactivated successfully",
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", messgae: "Internal server error" });
  }
};


// reactivate user account
export const reactivateUserAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const userId = parseInt(id);
    if (!userId) {
      return res
        .status(401)
        .json({ status: "error", message: "User ID is required" });
    }
    const user = await findUserByIdService(userId);
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "User not found" });
    }

    if (!user.is_deactivated) {
      return res
        .status(402)
        .json({
          status: "error",
          message: "User account is already active",
        });
    }
    await reactivateAccount(userId);
    return res
      .status(200)
      .json({
        status: "success",
        message: "User account reactivated successfully",
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", messgae: "Internal server error" });
  }
}