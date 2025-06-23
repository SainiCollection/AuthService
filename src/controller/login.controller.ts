import { Request, Response } from "express";
import jwtTokenGenerator from "../utils/jwtTokenGenerator";
import {
  findUserByEmail,
  checkPassword,
  lockuserAccount,
  updateFailedLoginAttempts,
  resetFailedLoginAttempts,
  findAppByUserIdAndAppName
} from "../service/login.service";

const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password, app_name, redirect_url } = req.body;

    // 🛑 Validate fields
    if (!email || !password || !app_name || !redirect_url) {
      return res.status(200).json({
        status: "fill_all_feilds",
        message: "All fields are required"
      });
    }

    // 🔍 Find user first
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(200).json({
        status: "user_not_found",
        message: "User not found! Try again."
      });
    }

    // 🔍 Then find app mapping
    const appName = await findAppByUserIdAndAppName(user.id, app_name, redirect_url);

    // 🔒 Check if account is locked
    if (
      user.account_locked_until &&
      new Date(user.account_locked_until) > new Date()
    ) {
      const minutesLeft = Math.ceil(
        (new Date(user.account_locked_until).getTime() - new Date().getTime()) / 60000
      );
      return res.status(200).json({
        status: "account_locked",
        message: `Account is locked. Try again after ${minutesLeft} minutes.`
      });
    }

    // ✅ Check password
    const isPasswordMatch = await checkPassword(password, user.password);
    if (!isPasswordMatch) {
      const failedLoginAttempts = user.failed_login_attempts + 1;
      if (failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
        const lockUntil = new Date(Date.now() + LOCK_DURATION_MINUTES * 60000);
        await lockuserAccount(user.email, failedLoginAttempts, lockUntil);
        return res.status(200).json({
          status: "account_locked",
          message: `Account is locked. Try again after ${LOCK_DURATION_MINUTES} minutes.`
        });
      }
      await updateFailedLoginAttempts(user.email, failedLoginAttempts);
      return res.status(200).json({
        status: "invalid_password",
        message: "Invalid Email or Password"
      });
    }

    // 🚫 Check suspended/deactivated/deleted/verified
    if (user.is_suspended) {
      return res.status(200).json({
        status: "user_suspended",
        message: "User is suspended, please contact admin."
      });
    }

    if (user.is_deactivated) {
      return res.status(200).json({
        status: "user_deactivated",
        message: "User is deactivated. Please activate your account."
      });
    }

    if (user.is_deleted) {
      return res.status(200).json({
        status: "user_deleted",
        message: "User is deleted."
      });
    }

    if (!user.is_verified) {
      return res.status(200).json({
        status: "user_not_verified",
        message: "User not verified. Please check your email and verify."
      });
    }

    // 🟢 All good → Reset failed attempts and login
    await resetFailedLoginAttempts(email);

    const token = await jwtTokenGenerator(user.id, user.username, user.email, appName.app_name);

    return res.status(200).json({
      status: "success",
      token,
      message: "User login successfully!",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        appName: appName.app_name,
        redirectUrl: appName.redirect_url
      }
    });

  } catch (error) {
    console.error("Error while login", error);
    return res.status(500).json({
      status: "error",
      message: "Server error or unexpected issue. Please try again."
    });
  }
};
