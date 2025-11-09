// src/components/PrivateRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api"; // axios com baseURL=http://localhost:5000 e withCredentials=true

function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    async function validarSessao() {
      try {
        await api.get("/session");
        setAutenticado(true);
      } catch {
        setAutenticado(false);
      } finally {
        setLoading(false);
      }
    }
    validarSessao();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (!autenticado) return <Navigate to="/" replace />;
  return children;
}

export default PrivateRoute;
