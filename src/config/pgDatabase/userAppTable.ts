import pool from "./dbConnect";

const userAppTable = async () => {
    const userAppTableQuery = `CREATE TABLE IF NOT EXISTS user_app(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    app_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, app_name),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`;

    try {
        await pool.query(userAppTableQuery);
        console.log("user_app Table Created Successfully!");
    } catch (error) {
        console.log("Error Creating user_app Table", error);
    }
}


export default userAppTable;