import crypto from "crypto";
import bcrypt from "bcryptjs";
import pool from "../config/pgDatabase/dbConnect";
import transporter from "../utils/transporter";

// handel forgot password
export const handleForgotPassword = async (email: string, useRecoveryEmail:false) => {
  const userQuery = useRecoveryEmail
    ? `SELECT * FROM users WHERE recovery_email = $1`
    : `SELECT * FROM users WHERE email = $1`;

  const userResult = await pool.query(userQuery, [email]);
  const user = userResult.rows[0];

  if (!user) throw new Error("User not found");

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 1000 * 60 * 15); //15 min
  console.log("token forgot",token)


  await pool.query(
    `UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE ${useRecoveryEmail ? 'recovery_email' : 'email'} = $3`,
    [token, expiry, email]
  );

  const resetLink = `${process.env.UI_URL}/reset-password?resetPasswordToken=${token}`; // chage this to front end url
  await transporter.sendMail({
    from: `"Auth Service" <${process.env.SMTP_EMAIL}>`,
    to: useRecoveryEmail ? user.recovery_email : user.email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 15 minutes.</p>`,
  });
};

// handle reset password
export const handleResetPassword = async (
  token: string,
  newPassword: string
) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()`,
    [token]
  );
  const user = result.rows[0];
  console.log("forgot user", user)
  if (!user) throw new Error("Invalid or Expired Token");
  const newHashedPassword =await bcrypt.hash(newPassword, 10);
  await pool.query(
    `UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE email = $2`,
    [newHashedPassword, user.email]
  );
};
