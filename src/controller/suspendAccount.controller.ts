import { suspendAccountService, reactivateSuspendedAccountService } from "../service/suspendAccount.service";
import { Request, Response } from "express";

// suspend user account
export const suspendUserAccount = async (req: Request, res: Response) => {
  const { id, suspendReason } = req.body;
  const userId = parseInt(id);

  if (!userId || !suspendReason) {
    return res
      .status(400)
      .json({ status: "error", message: "User ID and suspendReason are required" });
  }

  try {
    await suspendAccountService(userId, suspendReason);
    return res
      .status(200)
      .json({
        status: "success",
        message: "User account suspended successfully",
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
}

// reactivate suspended user account
export const reactivateSuspendedUserAccount = async (req: Request, res: Response) => {
  const { id } = req.body;
  const userId = parseInt(id);

  if (!userId) {
    return res
      .status(400)
      .json({ status: "error", message: "User ID is required" });
  }

  try {
    await reactivateSuspendedAccountService(userId);
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
      .json({ status: "error", message: "Internal server error" });
  }
}