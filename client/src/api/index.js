import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/reducers/userSlice";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api/",
  timeout: 30000, // 30 second timeout
});

const handleAuthFailure = () => {
  store.dispatch(logout());          // clears currentUser in Redux + removes fittrack-token
  localStorage.removeItem("persist:root"); // ensure persisted state is cleared on reload
  window.location.href = "/";
};

// Decode JWT payload without verification (for expiry check only)
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Add token to requests — also check expiry before sending
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("fittrack-token");
    if (token) {
      if (isTokenExpired(token)) {
        handleAuthFailure();
        return Promise.reject(new Error("Token expired"));
      }
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// Handle response errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleAuthFailure();
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const UserSignUp = async (data) => API.post("/user/signup", data);
export const UserSignIn = async (data) => API.post("/user/signin", data);

// Dashboard APIs
export const getDashboardDetails = async (date) => {
  const url = date ? `/user/dashboard?date=${date}` : "/user/dashboard";
  return API.get(url);
};

// Workout APIs
export const getWorkouts = async (date) => API.get(`/user/workout?date=${date}`);
export const addWorkout = async (data) => API.post("/user/workout", data);
export const updateWorkout = async (id, data) => API.put(`/user/workout/${id}`, data);
export const deleteWorkout = async (id) => API.delete(`/user/workout/${id}`);
export const getDashboardByDate = async (date) => API.get(`/user/dashboard?date=${date}`);

// AI Chat API
export const chatWithAI = async (message, history) => API.post("/user/chat", { message, history });
