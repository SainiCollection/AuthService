import pool from "../config/pgDatabase/dbConnect";

//  Function to suspend user account
export const suspendAccountService = async (userId:number, suspendReason:string): Promise<void> => {
  await pool.query(
    `UPDATE users SET is_suspended = true, suspended_reason = $1, suspended_at = NOW() WHERE id = $2`,
    [suspendReason, userId]
  );
}

// Function to reactivate suspended user account
export const reactivateSuspendedAccountService = async (userId: number): Promise<void> => {
  await pool.query(
    `UPDATE users SET is_suspended = false, suspended_reason = NULL, suspended_at = NULL WHERE id = $1`,
    [userId]
  );
}