const bcrypt = require("bcryptjs");
const pool = require("./src/config/db");

async function createUser(name, email, password, roleId) {
    const passwordHash = await bcrypt.hash(password, 10);

    const userResult = await pool.query(
        `INSERT INTO users (name, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [name, email, passwordHash]
    );

    const userId = userResult.rows[0].id;

    await pool.query(
        `INSERT INTO user_roles (user_id, role_id)
         VALUES ($1, $2)`,
        [userId, roleId]
    );

    console.log(`${name} created successfully`);
}

async function seedUsers() {
    try {
        await createUser(
            "HR User",
            "hr@example.com",
            "HR@123",
            2
        );

        await createUser(
            "Sales User",
            "sales@example.com",
            "Sales@123",
            3
        );

        console.log("HR and Sales users created!");

    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await pool.end();
    }
}

seedUsers();