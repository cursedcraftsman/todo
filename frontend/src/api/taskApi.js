/*
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getAllTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post("/tasks", taskData);
  return response.data;
};

export const toggleTask = async (id) => {
  const response = await api.patch(`/tasks/${id}/toggle`);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};
*/

/*
import axios from "axios";

const api = axios.create({
  baseURL: "https://todo-backend-6kw7.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllTasks = async () => {
  const response = await api.get("/tasks");
  return response.data.data;
};

export const createTask = async (taskData) => {
  const response = await api.post("/tasks", taskData);
  return response.data.data;
};

export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data.data;
};

export const toggleTask = async (id) => {
  const response = await api.patch(`/tasks/${id}/toggle`);
  return response.data.data;
};

export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`);
};
*/

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const getAllTasks = async (params) => {
  const res = await api.get("/tasks", { params });
  return res.data.data;
};

export const createTask = async (taskData) => {
  const res = await api.post("/tasks", taskData);
  return res.data.data;
};

export const toggleTask = async (id) => {
  const res = await api.patch(`/tasks/${id}/toggle`);
  return res.data.data;
};

export const updateTask = async (id, data) => {
  const res = await api.put(`/tasks/${id}`, data);
  return res.data.data;
};

export const deleteTask = async (id) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};

// NEW: triggers daily refresh on the backend
export const dailyRefresh = async () => {
  const res = await api.post("/tasks/daily-refresh");
  return res.data;
};