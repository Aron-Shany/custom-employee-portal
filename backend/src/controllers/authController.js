const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
    findUserByEmail,
    getUserPermissions,
    getUserRoles
} = require("../services/userService");

async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Check that email and password were provided
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Check whether user is active
        if (!user.is_active) {
            return res.status(403).json({
                message: "User account is inactive"
            });
        }

        // Compare entered password with stored bcrypt hash
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Get roles and permissions
        const roles = await getUserRoles(user.id);
        const permissions = await getUserPermissions(user.id);

        // Create JWT
        const token = jwt.sign(
            {
                sub: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roles,
                permissions
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    login
};