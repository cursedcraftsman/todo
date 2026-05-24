// config/db.js
// ==========================================
// MongoDB Database Connection Setup
// ==========================================
// This file handles connecting our app to MongoDB Atlas
// We use mongoose - a library that makes working with MongoDB easier
 
const mongoose = require("mongoose");
 
const connectDB = async () => {
  try {
    // mongoose.connect() tries to connect to your MongoDB Atlas database
    // process.env.MONGODB_URI reads the connection string from your .env file
    const conn = await mongoose.connect(process.env.MONGODB_URI);
 
    // If connection is successful, print the host name
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, print the error and stop the server
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit with failure code
  }
};
 
module.exports = connectDB;
 