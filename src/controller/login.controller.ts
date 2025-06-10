import { Request, Response } from "express";
import jwtTokenGenerator from "../utils/jwtTokenGenerator";
import { findUserByEmail, checkPassword, lockuserAccount, updateFailedLoginAttempts, resetFailedLoginAttempts,findAppByUserIdAndAppName } from "../service/login.service";

const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password, app_name } = req.body;

    //----------------------------------------------------------------------------------check all feilds required
    if (!email || !password || !app_name) {
      return res
        .status(401)
        .json({ status: "error", message: "All feilds are required" });
    }

    // -----------------------------------------------------------------------------find user
    const user = await findUserByEmail(email);
    const appName = await findAppByUserIdAndAppName(user.id, app_name);
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "User not found" });
    }

    // check if the user is locked out
    if (
      user.account_locked_until &&
      new Date(user.account_locked_until) > new Date()
    ) {
      const minutesLeft = Math.ceil(
        (new Date(user.account_locked_until).getTime() - new Date().getTime()) /
          60000
      );
      return res.status(402).json({
        status: "error",
        message: `Account is locked. Try again after ${minutesLeft} minutes.`,
      });
    }

    // ---------------------------------------------------------------------------pass word match
    const isPasswordMatch = await checkPassword(password, user.password);
    if (!isPasswordMatch) {
      const failedLoginAttempts = user.failed_login_attempts + 1;
      if (failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
        const lockUntil = new Date(Date.now() + LOCK_DURATION_MINUTES * 60000);
        await lockuserAccount(user.email, failedLoginAttempts, lockUntil);
        await user.update({
          failed_login_attempts: failedLoginAttempts,
          account_locked_until: lockUntil,
        });
        return res.status(402).json({
          status: "error",
          message: `Account is locked. Try again after ${LOCK_DURATION_MINUTES} minutes.`,
        });
      }
      await updateFailedLoginAttempts(user.email, failedLoginAttempts);
      return res
        .status(403)
        .json({ status: "error", message: "Invalid Credentials" });
    }

    // --------------------------------------------------------------------------check user suspended
    if (user.is_suspended === true) {
      return res.status(404).json({
        status: "error",
        message: "User is suspended, Please contact admin",
      });
    }
    // --------------------------------------------------------------------------check user deactivated
    if (user.is_deactivated === true) {
      return res.status(405).json({
        status: "error",
        message: "User is deactivated, Please Activate your account",
      });
    }
    // --------------------------------------------------------------------------check user deleted
    if (user.is_deleted === true) {
      return res.status(406).json({
        status: "error",
        message: "User is deleted",
      });
    }

    // --------------------------------------------------------------------------check user verified
    if (user.is_verified === true) {
      await resetFailedLoginAttempts(email);
      // Generate JWT token
      const token = await jwtTokenGenerator(user.id, user.email, appName.app_name);
      return res.status(200).json({
        status: "success",
        token,
        message: "User login successfully!!",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          appName: appName.app_name,
        },
      });
    } else {
      return res.status(407).json({
        status: "error",
        message: "User not verified, Please Signup again and Varify email",
      });
    }
  } catch (error) {
    console.log("Error while login", error);
    return res.status(500).json({
      status: "error",
      message: "Server Error or Wrong Credentials, Please try again",
    });
  }
};
