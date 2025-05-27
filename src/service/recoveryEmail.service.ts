import pool from "../config/pgDatabase/dbConnect";

//  Function to add recovery email
export const recoveryEmailService = async (userId: number, recoveryEmail: string): Promise<void> => {
  await pool.query(
    `UPDATE users SET recovery_email = $1 WHERE id = $2`,
    [recoveryEmail, userId]
  );
}