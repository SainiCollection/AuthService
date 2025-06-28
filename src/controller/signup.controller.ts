import { signupUser } from "../service/signup.service";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import pool from "../config/pgDatabase/dbConnect";
import transporter from "../utils/transporter";


export const signup = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, appName, redirectUrl } = req.body;

    if (!firstName || !lastName || !email || !password || !appName || !redirectUrl) {
      return res
        .status(400)
        .json({ status: "error", message: "All fields are required" });
    }

    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    const existingUser = result.rows[0];

    if (existingUser) {
      if (!existingUser.is_verified) {
        // 🔁 Resend verification token
        const newVerificationToken = crypto.randomBytes(32).toString("hex");

        await pool.query(
          `UPDATE users SET verification_token = $1 WHERE email = $2`,
          [newVerificationToken, email]
        );

        // 🔁 Include redirectUrl in the verification link
        const newVerificationUrl = `${process.env.BASE_URL_SERVER}/api/v1/auth/verify-email?emailVerifyToken=${newVerificationToken}&redirectUrl=${encodeURIComponent(redirectUrl)}`;

        await transporter.sendMail({
          from: `"Auth Service" <${process.env.SMTP_EMAIL}>`,
          to: existingUser.email,
          subject: "Verify your email",
          html: `<p>Please verify your email by clicking <a href="${newVerificationUrl}">Click to Verify</a></p>`,
        });

        return res.status(200).json({
          status: "success",
          message: "Already registered but not verified. Verification email resent.",
        });
      }

      // ✅ User is verified → proceed to insert into user_app if needed
      const resUser = await signupUser(firstName, lastName, email, password, appName, redirectUrl);

      return res.status(200).json({
        status: "user_exists",
        message: "User already exists, new app access granted.",
        user: {
          id: resUser.id,
          email: resUser.email,
          username: resUser.username,
          firstName: resUser.first_name,
          lastName: resUser.last_name,
          appName: appName,
          redirectUrl: redirectUrl
        }
      });
    }

    // 🆕 Brand new user
    await signupUser(firstName, lastName, email, password, appName, redirectUrl);

    return res.status(201).json({
      status: "success",
      message: "Signup successful! Please check your email to verify your account.",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Signup failed" });
  }
};



export const verifyEmail = async (req: Request, res: Response) => {
  const { emailVerifyToken, redirectUrl } = req.query;

  if (!emailVerifyToken || typeof redirectUrl !== "string") {
    return res.redirect(`${process.env.UI_URL}/email-verification?status=failed`);
  }

  const query = `UPDATE users SET is_verified = true, verification_token = NULL WHERE verification_token = $1 RETURNING *`;
  const values = [emailVerifyToken];
  const { rows } = await pool.query(query, values);

  if (rows.length === 0) {
    return res.redirect(`${redirectUrl}/email-verification?status=failed`);
  }

  const user = rows[0];

  return res.redirect(`${redirectUrl}/login?status=activation-success&id=${user.id}`);
};
