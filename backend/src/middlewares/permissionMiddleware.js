const pool = require("../config/db");

function requirePermission(permissionName) {
    return async (req, res, next) => {
        try {
            const userId = req.user.sub;

            const result = await pool.query(
                `SELECT DISTINCT p.name
                 FROM user_roles ur
                 JOIN role_permissions rp ON ur.role_id = rp.role_id
                 JOIN permissions p ON rp.permission_id = p.id
                 WHERE ur.user_id = $1
                 AND p.name = $2`,
                [userId, permissionName]
            );

            if (result.rows.length === 0) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }

            next();

        } catch (error) {
            console.error("Permission check error:", error.message);

            return res.status(500).json({
                message: "Internal server error"
            });
        }
    };
}

module.exports = {
    requirePermission
};