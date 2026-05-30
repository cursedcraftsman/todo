/*
const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// ==========================================
// GET ALL TASKS
// ==========================================
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ date: 1 });

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// CREATE TASK
// ==========================================
router.post("/", async (req, res) => {
  try {
    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// TOGGLE TASK COMPLETION
// ==========================================
router.patch("/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.completed = !task.completed;

    await task.save();

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// UPDATE TASK
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// DELETE TASK
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

*/

/*
const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { format, addDays, isBefore, parseISO, startOfDay } = require("date-fns");

// ==========================================
// GET ALL TASKS
// ==========================================
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ date: 1 });
    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// CREATE TASK
// ==========================================
router.post("/", async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// DAILY REFRESH
// Called on every app load from the frontend.
// Spawns recurring task copies for today if not already created.
// ==========================================
router.post("/daily-refresh", async (req, res) => {
  try {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    const today = startOfDay(new Date());

    // Find all original recurring tasks (not spawned copies)
    const recurringTasks = await Task.find({
      isRecurring: true,
      recurringParentId: null,
    });

    let spawned = 0;

    for (const task of recurringTasks) {
      const taskDate = startOfDay(parseISO(task.date));
      const endDate = addDays(parseISO(task.date), task.recurringDays);

      // Walk day by day from day after start up to today
      let cursor = addDays(taskDate, 1);
      while (!isBefore(endDate, cursor) && isBefore(cursor, addDays(today, 1))) {
        const dateStr = format(cursor, "yyyy-MM-dd");

        // Only create if not already existing for this date + parent
        const exists = await Task.findOne({
          recurringParentId: task._id,
          date: dateStr,
        });

        if (!exists) {
          await Task.create({
            title: task.title,
            description: task.description,
            completionTime: task.completionTime,
            date: dateStr,
            completed: false,
            isRecurring: false,
            recurringDays: 0,
            recurringParentId: task._id,
          });
          spawned++;
        }

        cursor = addDays(cursor, 1);
      }
    }

    res.json({ success: true, spawned });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// TOGGLE TASK COMPLETION
// ==========================================
router.patch("/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    task.completed = !task.completed;
    await task.save();
    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// UPDATE TASK
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// DELETE TASK
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
*/

const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { format, addDays, isBefore, parseISO, startOfDay } = require("date-fns");

// ==========================================
// GET ALL TASKS
// ==========================================
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ date: 1 });
    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// CREATE TASK
// ==========================================
router.post("/", async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// DAILY REFRESH
// Called on every app load from the frontend.
// 1. Resets completed tasks from past days back to incomplete
// 2. Spawns recurring task copies for today if not already created
// ==========================================
router.post("/daily-refresh", async (req, res) => {
  try {
    const today = startOfDay(new Date());
    const todayStr = format(new Date(), "yyyy-MM-dd");

    // ==========================================
    // FEATURE 1: Reset past-day completed tasks
    // Any task with a date before today that is
    // marked completed → set back to incomplete
    // ==========================================
    await Task.updateMany(
      {
        date: { $lt: todayStr }, // date is before today
        completed: true,         // and is marked done
      },
      {
        $set: { completed: false },
      }
    );

    // ==========================================
    // FEATURE 2: Spawn recurring tasks for today
    // ==========================================
    const recurringTasks = await Task.find({
      isRecurring: true,
      recurringParentId: null, // only original tasks, not spawned copies
    });

    let spawned = 0;

    for (const task of recurringTasks) {
      const taskDate = startOfDay(parseISO(task.date));
      const endDate = addDays(parseISO(task.date), task.recurringDays);

      // Walk day by day from day after start up to today
      let cursor = addDays(taskDate, 1);
      while (
        !isBefore(endDate, cursor) &&
        isBefore(cursor, addDays(today, 1))
      ) {
        const dateStr = format(cursor, "yyyy-MM-dd");

        // Only create if not already existing for this date + parent
        const exists = await Task.findOne({
          recurringParentId: task._id,
          date: dateStr,
        });

        if (!exists) {
          await Task.create({
            title: task.title,
            description: task.description,
            completionTime: task.completionTime,
            date: dateStr,
            completed: false,
            isRecurring: false,
            recurringDays: 0,
            recurringParentId: task._id,
          });
          spawned++;
        }

        cursor = addDays(cursor, 1);
      }
    }

    res.json({ success: true, spawned });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// TOGGLE TASK COMPLETION
// ==========================================
router.patch("/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    task.completed = !task.completed;
    await task.save();
    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// UPDATE TASK
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// DELETE TASK
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;