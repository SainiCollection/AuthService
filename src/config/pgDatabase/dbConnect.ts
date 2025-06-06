import { Pool } from "pg";
import dotenv from "dotenv";
import userTable from "./usersTable";
dotenv.config();

// create a new pool instance for local Postgres database connection
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: Number(process.env.DB_PORT),
// });

// create a new pool instance for supabase Postgres database connection
const pool= new Pool({
  connectionString: process.env.RENDER_DB_URL,
  ssl:{
    rejectUnauthorized: false,
  }
})

pool
  .connect()
  .then(() => {
    console.log("Connected to Render Postgres DB Successfully!");
    userTable();
  })
  .catch((error) => {
    console.error("Unexpected error on idle client", error);
  });

export default pool;
