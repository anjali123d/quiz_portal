// const mongoose = require("mongoose");

// const connectDB = async () => {
//     await mongoose.connect("mongodb+srv://cosmosbvn_db_user:cosmos123@mcqtestcluster0.8lbkhd3.mongodb.net/?appName=mcqTestCluster0");
//     console.log("MongoDB Connected");
// };

// module.exports = connectDB;

// const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1); // ❗ This will crash app if MONGO_URI missing
    }
};

module.exports = connectDB;