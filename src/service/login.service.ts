import pool from "../config/pgDatabase/dbConnect";
import bcrypt from "bcryptjs";

// Function to find a user by email
export const findUserByEmail = async (email: string) => {
  const query = await pool.query(`SELECT * FROM users WHERE email = $1 AND is_deleted = false`, [
    email,
  ]);
  return query.rows[0];
};

// Function to check a password is correct
export const checkPassword = async (entered: string, hashed: string) => {
  return await bcrypt.compare(entered, hashed);
};

//Function to update user failed login attempts
export const updateFailedLoginAttempts = async (
  email: String,
  attempts: number
) : Promise<void>=> {
  await pool.query(
    `UPDATE users SET failed_login_attempts = $1 WHERE email = $2`,
    [attempts, email]
  );
};

// Function to reset user failed login attempts
export const resetFailedLoginAttempts = async (email: String) : Promise<void> => {
  await pool.query(
    `UPDATE users SET failed_login_attempts = 0, account_locked_until = NULL WHERE email = $1`,
    [email]
  );
};

//Function to lock user account
export const lockuserAccount = async (
  email: String,
  attempts: Number,
  lockUntil: Date
): Promise<void> => {
  await pool.query(
    `UPDATE users SET failed_login_attempts = $1, account_locked_until = $2 WHERE email = $3`,
    [attempts, lockUntil, email]
  );
};
