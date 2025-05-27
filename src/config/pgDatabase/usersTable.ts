import pool from "./dbConnect";

const userTable = async () => {
  const userTableQuery = `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,

    is_verified BOOLEAN DEFAULT false,
    verification_token VARCHAR(255),
    verification_token_expires TIMESTAMP,
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,

    failed_login_attempts INT DEFAULT 0,
    account_locked_until TIMESTAMP,

    recovery_email VARCHAR(255),
    phone_number VARCHAR(20),

    is_suspended BOOLEAN DEFAULT false,
    suspended_reason TEXT,
    suspended_at TIMESTAMP,
    is_deactivated BOOLEAN DEFAULT false,
    deactivated_reason TEXT ,
    deactivated_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`;

  try {
    await pool.query(userTableQuery);
    console.log("Users Table Created Successfully!");
  } catch (error) {
    console.log("Error Creating Users Table", error);
  }
};

export default userTable;
