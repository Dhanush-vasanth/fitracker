import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/",
});

// Add token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("fittrack-token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth APIs
export const UserSignUp = async (data) => API.post("/user/signup", data);
export const UserSignIn = async (data) => API.post("/user/signin", data);

// Dashboard APIs
export const getDashboardDetails = async () => API.get("/user/dashboard");

// Workout APIs
export const getWorkouts = async (date) => API.get(`/user/workout?date=${date}`);
export const addWorkout = async (data) => API.post("/user/workout", data);
export const updateWorkout = async (id, data) => API.put(`/user/workout/${id}`, data);
export const deleteWorkout = async (id) => API.delete(`/user/workout/${id}`);

// AI Chat API
export const chatWithAI = async (message, history) => API.post("/user/chat", { message, history });
