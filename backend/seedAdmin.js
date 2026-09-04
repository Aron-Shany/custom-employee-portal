const bcrypt = require("bcryptjs");
const pool = require("./src/config/db");

async function createAdmin() {
    try {
        const password = "Admin@123";

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash)
             VALUES ($1, $2, $3)
             RETURNING id, name, email`,
            ["System Admin", "admin@example.com", passwordHash]
        );

        const userId = result.rows[0].id;

        await pool.query(
            `INSERT INTO user_roles (user_id, role_id)
             VALUES ($1, $2)`,
            [userId, 1]
        );

        console.log("Admin user created successfully!");
        console.log("Email: admin@example.com");
        console.log("Password: Admin@123");

    } catch (error) {
        console.error("Error creating admin:", error.message);
    } finally {
        await pool.end();
    }
}

createAdmin();