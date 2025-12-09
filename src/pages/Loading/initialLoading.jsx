import { CircularProgress, Box } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

function LoadingInicial() {
  const navigate = useNavigate();
  const [iniciado, setIniciado] = useState(false);
  useEffect(() => {
    async function iniciar() {
      const res = await api.get("/");
      if (res.data) {
        setIniciado(true);
      }
    }
    iniciar();
  }, []);

  iniciado && navigate("/login");
  return (
    <Box
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
    </Box>
  );
}
export default LoadingInicial;
