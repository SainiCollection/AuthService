import bcrypt from "bcryptjs";
import crypto from "crypto";
import pool from "../config/pgDatabase/dbConnect";

import transporter from "../utils/transporter";

export const signupUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  
) => {
  // unique username
  // const randonSuffix = crypto.randomBytes(32).toString("hex");
  const randonSuffix = Math.floor(100 + Math.random() * 900);
  let uniqueUsername = `${firstName.toLowerCase()}_${randonSuffix}`;
  // hashed password
  const hashedPassword = await bcrypt.hash(password, 0);

  // generate random varification token
  const varificationToken = crypto.randomBytes(32).toString("hex");

  // insert user with is_varified = false
  const query = `INSERT INTO users (username,first_name, last_name, email, password, verification_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING * `;
  const values = [
    uniqueUsername,
    firstName,
    lastName,
    email.toLowerCase(),
    hashedPassword,
    varificationToken,
  ];
  const { rows } = await pool.query(query, values);
  const user = rows[0];

  // send verification mail
  const verificationUrl = `${process.env.BASE_URL_SERVER}/api/v1/auth/verify-email?emailVerifyToken=${varificationToken}`;
  await sendVerificationEmail(user.email, verificationUrl);
  return user;
};

const sendVerificationEmail = async (to: string, url: string) => {
  transporter;

  await transporter.sendMail({
    from: `"Auth Service" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: "Verify your email",
    html: `<p>Please verify your email by clicking <a href="${url}" > Click to Verify </a>   </p>`,
  });
};
