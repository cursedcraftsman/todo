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


import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
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
