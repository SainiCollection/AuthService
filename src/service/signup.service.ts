import bcrypt from "bcryptjs";
import crypto from "crypto";
import pool from "../config/pgDatabase/dbConnect";

import transporter from "../utils/transporter";

// export const signupUser = async (
//   firstName: string,
//   lastName: string,
//   email: string,
//   password: string,  
//   app_name: string
// ) => {
//   // unique username
//   // const randonSuffix = crypto.randomBytes(32).toString("hex");
//   const randonSuffix = Math.floor(100 + Math.random() * 900);
//   let uniqueUsername = `${firstName.toLowerCase()}_${randonSuffix}`;
//   // hashed password
//   const hashedPassword = await bcrypt.hash(password, 0);

//   // generate random varification token
//   const varificationToken = crypto.randomBytes(32).toString("hex");

//   // insert user with is_varified = false
//   const query = `INSERT INTO users (username,first_name, last_name, email, password, verification_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING * `;
//   const values = [
//     uniqueUsername,
//     firstName,
//     lastName,
//     email.toLowerCase(),
//     hashedPassword,
//     varificationToken,
//   ];
//   const { rows } = await pool.query(query, values);
//   const user = rows[0];

//   // insert user app
//   const userAppQuery = `INSERT INTO user_app (user_id, app_name) VALUES ($1, $2)`;
//   const userAppQueryValues = [user.id, app_name];
//   await pool.query(userAppQuery, userAppQueryValues);


//   // send verification mail
//   const verificationUrl = `${process.env.BASE_URL_SERVER}/api/v1/auth/verify-email?emailVerifyToken=${varificationToken}`;
//   await sendVerificationEmail(user.email, verificationUrl);
//   return user;
// };

export const signupUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  app_name: string
) => {
  const emailLower = email.toLowerCase();

  // 🔍 Step 1: Check if user exists
  const existingUserResult = await pool.query(`SELECT * FROM users WHERE email = $1`, [emailLower]);
  let user;
  let isNewUser = false;

  if (existingUserResult.rows.length > 0) {
    user = existingUserResult.rows[0];
  } else {
    // 🔒 Step 2: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔑 Generate username and verification token
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const uniqueUsername = `${firstName.toLowerCase()}_${randomSuffix}`;
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // 🆕 Step 3: Insert into users table
    const insertUserQuery = `
      INSERT INTO users (username, first_name, last_name, email, password, verification_token)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `;
    const values = [uniqueUsername, firstName, lastName, emailLower, hashedPassword, verificationToken];
    const { rows } = await pool.query(insertUserQuery, values);
    user = rows[0];
    isNewUser = true;

    // ✉️ Send verification email only for new users
    const verificationUrl = `${process.env.BASE_URL_SERVER}/api/v1/auth/verify-email?emailVerifyToken=${verificationToken}`;
    await sendVerificationEmail(user.email, verificationUrl);
  }

  // ✅ Step 4: Insert into user_app if not already exists
  const userAppExists = await pool.query(
    `SELECT * FROM user_app WHERE user_id = $1 AND app_name = $2`,
    [user.id, app_name]
  );

  if (userAppExists.rows.length === 0) {
    await pool.query(
      `INSERT INTO user_app (user_id, app_name) VALUES ($1, $2)`,
      [user.id, app_name]
    );
  }

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
