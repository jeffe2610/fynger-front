import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000"
      : "https://fynger.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const contexto = localStorage.getItem("contexto");
  const atualGroup = localStorage.getItem("atualgroup")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    
  }
  if(contexto){
    config.headers["x-contexto"] = contexto;
    
  }
  if(atualGroup){
    config.headers["x-atualgroup"] = atualGroup;
    
  }
  return config;
});

export default api;
