import axios from "axios";

const api = axios.create({
  baseURL: "https://fynger.onrender.com", // backend Express
  withCredentials: true, // <— ESSENCIAL
});

export default api;
