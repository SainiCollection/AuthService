import { signupUser } from "../service/signup.service";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import pool from "../config/pgDatabase/dbConnect";
import transporter from "../utils/transporter";

export const signup = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password ) { 
      return res
        .status(400)
        .json({ status: "error", message: "All fields are required" });
    }

    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (result.rows.length > 0) {
      const existingUser = result.rows[0];

      if (existingUser.is_verified) {
        return res
          .status(401)
          .json({ status: "error", message: "User already exists and is verified!" });
      } else {
        // 🟡 Resend verification token
        const newVerificationToken = crypto.randomBytes(32).toString("hex");

        const updateQuery = `UPDATE users SET verification_token = $1 WHERE email = $2 RETURNING *`;
        const { rows } = await pool.query(updateQuery, [
          newVerificationToken,
          email,
        ]);

        const updatedUser = rows[0];
        const newVerificationUrl = `${process.env.BASE_URL_SERVER}/api/v1/auth/verify-email?emailVerifyToken=${newVerificationToken}`;

        await transporter.sendMail({
          from: `"Auth Service" <${process.env.SMTP_EMAIL}>`,
          to: updatedUser.email,
          subject: "Verify your email",
          html: `<p>Please verify your email by clicking <a href="${newVerificationUrl}">Click to Verify</a></p>`,
        });

        return res.status(200).json({
          status: "success",
          message: "Already registered but not verified. Verification email resent.",
        });
      }
    }

    // 🔒 Hash password and insert new user
    const user = await signupUser(firstName, lastName, email, password);
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
  const { emailVerifyToken } = req.query;
  if (!emailVerifyToken) {
    return res.status(400).send({ status: "error", message: "Missing token" });
  }

  const query = `UPDATE users SET is_verified = true, verification_token = NULL WHERE verification_token = $1 RETURNING *`;
  const values = [emailVerifyToken];
  const { rows } = await pool.query(query, values);

  if (rows.length === 0) {
    return res
      .status(401)
      .send({ status: "error", message: "Invalid or expired token" });
  }

  res.send("Email verified successfully!");
};
