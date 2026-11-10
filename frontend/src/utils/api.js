import axios from "axios";

const defaultApiUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:5001/ashishranjan-net/asia-south1/api/v1"
    : "https://asia-south1-ashishranjan-net.cloudfunctions.net/api/v1";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || defaultApiUrl,
    withCredentials: true,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
});

export const getErrorMessage = (error, fallback) =>
    error.response?.data?.message || fallback;

export default api;
