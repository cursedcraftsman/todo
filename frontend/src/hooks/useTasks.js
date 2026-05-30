
/*
// src/hooks/useTasks.js
// ==========================================
// Custom React Hook: useTasks
// ==========================================
// Custom hooks let you extract and reuse stateful logic across components.
// This hook manages ALL task-related state and operations.
// Any component that needs tasks just calls: const { tasks, addTask, ... } = useTasks()
 
import { useState, useEffect, useCallback } from "react";
import { getAllTasks, createTask, updateTask, toggleTask, deleteTask } from "../api/taskApi";
 
const useTasks = () => {
  // ---- STATE ----
  // useState() creates a piece of state. [value, setter] is the pattern.
  const [tasks, setTasks] = useState([]);          // All tasks from the backend
  const [loading, setLoading] = useState(false);   // True while API call is in progress
  const [error, setError] = useState(null);         // Holds error message if API fails
  const [filter, setFilter] = useState("all");     // "all" | "completed" | "pending"
 
  // ==========================================
  // Fetch Tasks from Backend
  // ==========================================
  // useCallback memoizes the function so it doesn't re-create on every render
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build filter params based on current filter state
      const params = {};
      if (filter === "completed") params.completed = true;
      if (filter === "pending") params.completed = false;
 
      const response = await getAllTasks(params);
      setTasks(response || []);// Update tasks state with fetched data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false); // Always stop loading, even if there's an error
    }
  }, [filter]); // Re-fetch when filter changes
 
  // ==========================================
  // useEffect: Run fetchTasks when component mounts or filter changes
  // ==========================================
  // useEffect runs side effects (like API calls) after render
  // The [fetchTasks] dependency means it re-runs when fetchTasks changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
 
  // ==========================================
  // Add a New Task
  // ==========================================
  const addTask = async (taskData) => {
    try {
      const response = await createTask(taskData);
      // Add new task to local state without re-fetching all tasks
      setTasks((prev) => [...prev, response]);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create task";
      setError(message);
      return { success: false, message };
    }
  };
 
  // ==========================================
  // Toggle Task Completion
  // ==========================================
  const toggleTaskCompletion = async (id) => {
    try {
      const response = await toggleTask(id);
      // Update only the changed task in local state (avoids full refetch)
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? response : task))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };
 
  // ==========================================
  // Delete a Task
  // ==========================================
  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      // Remove the deleted task from local state
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };
 
  // ==========================================
  // Edit a Task
  // ==========================================
  const editTask = async (id, updatedData) => {
    try {
      const response = await updateTask(id, updatedData);
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? response : task))
      );
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update task";
      setError(message);
      return { success: false, message };
    }
  };
 
  // ==========================================
  // Group Tasks by Date
  // ==========================================
  // Returns an object like: { "2024-01-15": [...tasks], "2024-01-16": [...tasks] }
  const tasksByDate = tasks.reduce((groups, task) => {
    const date = task.date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(task);
    return groups;
  }, {});
 
  // Sort dates so today appears first, then future, then past
  const sortedDates = Object.keys(tasksByDate).sort();
 
  // ==========================================
  // Statistics
  // ==========================================
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    completionRate:
      tasks.length > 0
        ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)
        : 0,
  };
 
  // Return everything the components need
  return {
    tasks,
    tasksByDate,
    sortedDates,
    loading,
    error,
    filter,
    stats,
    setFilter,
    addTask,
    toggleTaskCompletion,
    removeTask,
    editTask,
    fetchTasks,
  };
};
 
export default useTasks;

*/

import { useState, useEffect, useCallback } from "react";
import {
  getAllTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  dailyRefresh,
} from "../api/taskApi";

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Silently run daily refresh first — spawns recurring tasks for today
      await dailyRefresh().catch(() => {});

      const params = {};
      if (filter === "completed") params.completed = true;
      if (filter === "pending") params.completed = false;

      const response = await getAllTasks(params);
      setTasks(response || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (taskData) => {
    try {
      const response = await createTask(taskData);
      setTasks((prev) => [...prev, response]);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create task";
      setError(message);
      return { success: false, message };
    }
  };

  const toggleTaskCompletion = async (id) => {
    try {
      const response = await toggleTask(id);
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? response : task))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const editTask = async (id, updatedData) => {
    try {
      const response = await updateTask(id, updatedData);
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? response : task))
      );
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update task";
      setError(message);
      return { success: false, message };
    }
  };

  const tasksByDate = tasks.reduce((groups, task) => {
    const date = task.date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(task);
    return groups;
  }, {});

  const sortedDates = Object.keys(tasksByDate).sort();

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    completionRate:
      tasks.length > 0
        ? Math.round(
            (tasks.filter((t) => t.completed).length / tasks.length) * 100
          )
        : 0,
  };

  return {
    tasks,
    tasksByDate,
    sortedDates,
    loading,
    error,
    filter,
    stats,
    setFilter,
    addTask,
    toggleTaskCompletion,
    removeTask,
    editTask,
    fetchTasks,
  };
};

export default useTasks;