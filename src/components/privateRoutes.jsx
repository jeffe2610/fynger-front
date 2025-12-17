import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import api from "../services/api";
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

  if (loading) return <Box
      sx={{
        height: "100vh",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img src="\512x512.png" alt="fynger-logo" height="300px" width="300px" />
      <CircularProgress size={40} />
    </Box>;

  if (!autenticado) return <Navigate to="/" replace />;
  return children;
}

export default PrivateRoute;
