
/*const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

// Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  completionTime: String,
  completed: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("Task", taskSchema);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend working");
});

// GET TASKS
app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find();

  res.json({
    success: true,
    data: tasks,
  });
});

// CREATE TASK
app.post("/api/tasks", async (req, res) => {
  console.log(req.body);

  const task = await Task.create(req.body);

  res.json({
    success: true,
    data: task,
  });
});

// PORT
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

*/

/*
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const taskRoutes = require("./routes/taskRoutes");

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);

// Root Route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 To-Do API is running!",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

*/
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();
connectDB();

const app = express();

// Explicitly allow your Vercel frontend URL
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://todo-one-ashy-10.vercel.app",
  // Add any other Vercel preview URLs if needed
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "🚀 To-Do API is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});