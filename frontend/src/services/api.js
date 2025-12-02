// API Service Layer - Handles all communication with the backend
import axios from 'axios';

// Base URL for API requests (backend server)
const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Task API Functions
 * These functions handle all task-related API calls
 */

// Get all tasks from the backend
export const getAllTasks = async () => {
  try {
    const response = await api.get('/tasks');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Get a single task by ID
export const getTaskById = async (taskId) => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const response = await api.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (taskId, taskData) => {
  try {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

/**
 * Risk API Functions
 * These functions handle risk calculation API calls
 */

// Get overall project risk assessment
export const getProjectRisk = async () => {
  try {
    const response = await api.get('/risk/project');
    return response.data;
  } catch (error) {
    console.error('Error fetching project risk:', error);
    throw error;
  }
};

/**
 * Dashboard API Functions
 * These functions handle dashboard statistics API calls
 */

// Get dashboard statistics
export const getDashboard = async () => {
  try {
    const response = await api.get('/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

/**
 * User API Functions
 * These functions handle user-related API calls
 */

// Get all users
export const getAllUsers = async () => {
  try {
    console.log('API: Fetching users from /api/users');
    const response = await api.get('/users');
    console.log('API: Users response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('API: Error fetching users:', error);
    console.error('API: Error response:', error.response?.data);
    throw error;
  }
};

// Export all API functions
export default {
  // Tasks
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  // Risk
  getProjectRisk,
  // Dashboard
  getDashboard,
  // Users
  getAllUsers
};

