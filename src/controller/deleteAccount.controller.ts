import { deleteAccountService , recoverDeletedAccountService} from "../service/deleteAccount.service";
import { Request, Response } from "express";

// delete user account
export const deleteUserAccount = async (req: Request,res: Response) => {
  const { id } = req.body;
  const userId = parseInt(id);
  if (!userId) {
    return res
      .status(400)
      .json({ status: "error", message: "User ID is required" });
  }
  try {
    await deleteAccountService(userId);
    return res
      .status(200)
      .json({
        status: "success",
        message: "User account deleted successfully",
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};


// recover deleted user account
export const recoverDeletedUserAccount = async (req: Request, res: Response) => {
  const { id } = req.body;
  const userId = parseInt(id);
  if (!userId) {
    return res
      .status(400)
      .json({ status: "error", message: "User ID is required" });
  }
  try {
    await recoverDeletedAccountService(userId);
    return res
      .status(200)
      .json({
        status: "success",
        message: "User account recovered successfully",
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
}