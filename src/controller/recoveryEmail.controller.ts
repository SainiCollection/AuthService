import { recoveryEmailService } from "../service/recoveryEmail.service";
import { Request, Response } from "express";

// Handle recovery email request
export const recoveryUserEmail = async (req:Request, res:Response)=>{
  try {
    const { id, recoveryEmail } = req.body;
    const userId = parseInt(id);
    
    if (!userId || !recoveryEmail) {
      return res
        .status(400)
        .json({ status: "error", message: "User ID and recovery email are required" });
    }

    await recoveryEmailService(userId, recoveryEmail);
    
    return res
      .status(200)
      .json({ status: "success", message: "Recovery email updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
}