const axios = require("axios");

let accessToken = null;
let tokenExpiresAt = 0;

async function getZohoAccessToken() {
    if (accessToken && Date.now() < tokenExpiresAt) {
        return accessToken;
    }

    const response = await axios.post(
        `${process.env.ZOHO_ACCOUNTS_URL}/oauth/v2/token`,
        null,
        {
            params: {
                refresh_token: process.env.ZOHO_REFRESH_TOKEN,
                client_id: process.env.ZOHO_CLIENT_ID,
                client_secret: process.env.ZOHO_CLIENT_SECRET,
                grant_type: "refresh_token"
            }
        }
    );

    accessToken = response.data.access_token;

    tokenExpiresAt =
        Date.now() + (response.data.expires_in - 60) * 1000;

    return accessToken;
}

async function getCRMData() {
    const token = await getZohoAccessToken();

    const response = await axios.get(
        `${process.env.ZOHO_API_DOMAIN}/crm/v8/Contacts`,
        {
            headers: {
                Authorization: `Zoho-oauthtoken ${token}`
            },
            params:{
                fields: "First_Name,Last_Name,Email"
            }
        }
    );

    return response.data;
}

module.exports = {
    getZohoAccessToken,
    getCRMData
};