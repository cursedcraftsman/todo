
/*
// models/Task.js
// ==========================================
// Task Data Model (Schema)
// ==========================================
// This defines the "shape" of a Task in our database.
// Think of it like a blueprint or form template.
// Every task stored in MongoDB will follow this structure.
 
const mongoose = require("mongoose");
 
// Define the schema (structure) for a Task
const taskSchema = new mongoose.Schema(
  {
    // Task title - required, every task must have a name
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true, // removes extra spaces from start/end
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
 
    // Optional description - more details about the task
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "", // empty string if not provided
    },
 
    // The date this task is scheduled for (e.g., "2024-01-15")
    date: {
      type: String,
      required: [true, "Task date is required"],
    },
 
    // Expected time to complete the task (e.g., "14:30" for 2:30 PM)
    completionTime: {
      type: String,
      required: [true, "Completion time is required"],
    },
 
    // Whether the task is done or not (true = done, false = pending)
    completed: {
      type: Boolean,
      default: false, // new tasks start as not completed
    },
  },
  {
    // timestamps: true automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);
 
// Create and export the Task model
// mongoose.model("Task", taskSchema) creates a "Task" collection in MongoDB
module.exports = mongoose.model("Task", taskSchema);
*/

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    date: {
      type: String,
      required: [true, "Task date is required"],
    },

    completionTime: {
      type: String,
      required: [true, "Completion time is required"],
    },

    completed: {
      type: Boolean,
      default: false,
    },

    // NEW: is this a recurring task?
    isRecurring: {
      type: Boolean,
      default: false,
    },

    // NEW: how many days after start date should it repeat?
    recurringDays: {
      type: Number,
      default: 0,
    },

    // NEW: if this is a spawned copy, store the original task's id
    recurringParentId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);