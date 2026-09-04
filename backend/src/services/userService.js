const pool = require("../config/db");

async function findUserByEmail(email) {
    const result = await pool.query(
        `SELECT
            u.id,
            u.name,
            u.email,
            u.password_hash,
            u.is_active
         FROM users u
         WHERE u.email = $1`,
        [email]
    );

    return result.rows[0];
}

async function getUserPermissions(userId) {
    const result = await pool.query(
        `SELECT DISTINCT p.name
         FROM user_roles ur
         JOIN role_permissions rp ON ur.role_id = rp.role_id
         JOIN permissions p ON rp.permission_id = p.id
         WHERE ur.user_id = $1`,
        [userId]
    );

    return result.rows.map(row => row.name);
}

async function getUserRoles(userId) {
    const result = await pool.query(
        `SELECT r.name
         FROM user_roles ur
         JOIN roles r ON ur.role_id = r.id
         WHERE ur.user_id = $1`,
        [userId]
    );

    return result.rows.map(row => row.name);
}

module.exports = {
    findUserByEmail,
    getUserPermissions,
    getUserRoles
};