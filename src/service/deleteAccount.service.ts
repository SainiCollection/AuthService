import pool from "../config/pgDatabase/dbConnect";

// Function to delete user account
export const deleteAccountService = async (userId: number): Promise<void> => {
  await pool.query(
    `UPDATE users SET is_deleted = true, deleted_at = NOW() WHERE id = $1`,
    [userId]
  );
}

// Function to recover deleted user account
export const recoverDeletedAccountService = async (userId: number): Promise<void> => {
  await pool.query(
    `UPDATE users SET is_deleted = false, deleted_at = NULL WHERE id = $1`,
    [userId]
  );
}