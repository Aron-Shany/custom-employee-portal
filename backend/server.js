const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const pool = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const testRoutes = require("./src/routes/testRoutes");
const zohoRoutes=require("./src/routes/zohoRoutes");
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({origin:"http://localhost:5180"}));
app.use("/api/auth", authRoutes);
app.use("/api/test",testRoutes);
app.use("/api/zoho",zohoRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Employee Portal Backend is running"
    });
});

pool.query("SELECT NOW()", (error, result) => {
    if (error) {
        console.error("Database connection failed:", error.message);
    } else {
        console.log("Database connected successfully!");
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});