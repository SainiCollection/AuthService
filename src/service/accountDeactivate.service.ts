import pool from "../config/pgDatabase/dbConnect";

// Function to deactivate user account
export const deactivateAccount = async (userId: Number, deactivateReason:String) :Promise<void>=>{
  await pool.query(`UPDATE users SET is_deactivated = true, deactivated_reason=$1, deactivated_at = NOW() WHERE id=$2`,[deactivateReason,userId ])
}

// Function to reactivate user account
export const reactivateAccount = async (userId:Number): Promise<void>=>{
  await pool.query("UPDATE users SET is_deactivated = false, deactivated_reason=NULL,deactivated_at = NULL WHERE id=$1",[userId])
}

// Function to find user by ID
export const findUserByIdService = async (userId: number) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1 AND is_deleted = false", [userId]);
  return result.rows[0];
};