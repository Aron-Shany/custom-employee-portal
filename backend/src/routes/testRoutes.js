const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const { requirePermission } = require("../middlewares/permissionMiddleware");
const { getCRMData } = require("../services/zohoService");

const router = express.Router();

router.get(
    "/people",
    authenticate,
    requirePermission("VIEW_ZOHO_PEOPLE"),
    (req, res) => {
        res.json({
            message: "You have access to Zoho People"
        });
    }
);

router.get(
    "/crm",
    authenticate,
    requirePermission("VIEW_ZOHO_CRM"),
    async (req, res) => {
        try {
            const data = await getCRMData();

            res.json({
                message: "Zoho CRM data retrieved successfully",
                data
            });
        } catch (error) {
            console.error(
                "Zoho CRM API error:",
                error.response?.data || error.message
            );

            res.status(500).json({
                message: "Failed to retrieve Zoho CRM data"
            });
        }
    }
);

module.exports = router;