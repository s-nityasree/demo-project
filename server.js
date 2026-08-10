const express = require("express");
const db = require("./config/db");
const userRoutes = require("./routes/userRoute");
const authRoutes = require("./routes/authRoutes");
const eventRoute = require('./routes/eventRoute')
const registrationRoute = require('./routes/registrationRoute')
const reportRoutes = require("./routes/reportRoute");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS message");

        res.json({
            success: true,
            message: "Database Connected Successfully",
            data: rows
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Database Connection Failed"
        });
    }
});

app.use("/users", userRoutes);

app.use("/auth", authRoutes);

app.use("/events", eventRoute);

app.use("/registration", registrationRoute);

app.use("/reports", reportRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});