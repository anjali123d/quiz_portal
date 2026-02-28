require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// ✅ Connect Database
connectDB();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Test Route
app.get("/", (req, res) => {
    res.send("Server is running");
});

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/quiz", require("./routes/quizRoutes"));

// ✅ IMPORTANT: Use Render's PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});