const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://cosmosbvn_db_user:cosmos123@mcqtestcluster0.8lbkhd3.mongodb.net/?appName=mcqTestCluster0");
    console.log("MongoDB Connected");
};

module.exports = connectDB;