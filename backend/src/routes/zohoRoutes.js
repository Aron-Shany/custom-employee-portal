const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/callback", async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({
                message: "Authorization code not received"
            });
        }

        const response = await axios.post(
            `${process.env.ZOHO_ACCOUNTS_URL}/oauth/v2/token`,
            null,
            {
                params: {
                    code: code,
                    client_id: process.env.ZOHO_CLIENT_ID,
                    client_secret: process.env.ZOHO_CLIENT_SECRET,
                    redirect_uri: process.env.ZOHO_REDIRECT_URI,
                    grant_type: "authorization_code"
                }
            }
        );

        console.log("Zoho OAuth token response received.");
console.log("Zoho response keys:", Object.keys(response.data));
console.log("Token response received successfully.");
console.log("Response contains refresh token:", "refresh_token" in response.data);
console.log("Response contains access token:", "access_token" in response.data);
console.log("API domain:", response.data.api_domain);


        res.json({
            message: "Zoho authorization completed successfully.",
            refreshTokenReceived: !!response.data.refresh_token
        });

    } catch (error) {
        console.error(
            "Zoho token exchange error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "Failed to exchange authorization code"
        });
    }
});

module.exports = router;