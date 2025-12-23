import { CircularProgress, Box } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import GppBadIcon from '@mui/icons-material/GppBad';

function LoadingInicial() {
  const navigate = useNavigate();
  const [iniciado, setIniciado] = useState(false);
  const [mensagem, setMensagem] = useState();
  const [erro, setErro] = useState("");

  useEffect(() => {
    let t1;
    let t2;
    let t3;

    async function iniciar() {
      try {
        const res = await api.get("/");
        if (res.data) {
          setIniciado(true);
        }
      } catch (error) {
        setErro(
          error.message ||
            "Desculpe, por esse erro não esperavamos, tente reiniciar a aplicação. Estamos trabalando nisso!"
        );
      }
    }
    function iniciarMensagens() {
      t1 = setTimeout(() => {
        setMensagem(
          "Estamos iniciando a aplicação. Isso pode levar alguns segundos."
        );
      }, 10000);

      t2 = setTimeout(() => {
        setMensagem(
          "Esse é o primeiro acesso após um tempo sem uso. Já estamos quase lá 🙂"
        );
      }, 20000);

      t3 = setTimeout(() => {
        setMensagem(
          "Se demorar mais que o esperado, tente reiniciar ou atualizar a página."
        );
      }, 40000);
    }

    iniciar();
    iniciarMensagens();

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
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
      {erro ? <GppBadIcon sx={{ fontSize: 40, color:"red" }}/> : <CircularProgress size={40} />}
      {erro? <h3 style={{color:'red',textAlign:"center", padding:"20px"}}>{erro}</h3>: <h3 style={{textAlign:"center", padding:"20px"}}>{mensagem}</h3> }
      
    </Box>
  );
}
export default LoadingInicial;
