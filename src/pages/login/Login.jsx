import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";
import { BoxAlerta, SubmitButton } from "../../components/Componentes";
import { TextField, CircularProgress } from "@mui/material";
import "./style.css";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [open, setOpen] = useState(false);
  const [alertaMensagem, setAlertaMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await api.post("/login", { email, password: senha });
      localStorage.setItem("token", res.data.token);
      navigate("/Home");
    } catch (err) {
      let localError = err.response?.data?.error || "Falha ao fazer login";
      setAlertaMensagem(localError);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <form className="formularios" onSubmit={handleLogin}>
        <img
          src="\512x512.png"
          alt="Fynger.logo"
          height={"300px"}
          width={"300px"}
        />

        <TextField
          fullWidth
          margin="normal"
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          size="small"
        />

        <TextField
          fullWidth
          margin="normal"
          type="password"
          label="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          variant="outlined"
          size="small"
        />

        <SubmitButton variant="contained" type="submit" disabled={loading}>
          {loading ? <CircularProgress size={22} color="inherit" /> : "Entrar"}
        </SubmitButton>

        <BoxAlerta
          duration={5000}
          mensagem={alertaMensagem}
          type={"error"}
          open={open}
          onClose={() => setOpen(false)}
        />

        
        
        <h4 >Não tem uma conta? 
        <Link
          style={{ textDecoration: "none", fontWeight: "bold" , paddingLeft:"10px", color:"#2A8CFF"}}
          to="/Cadastro"
        >
          Cadastre-se
        </Link>
       </h4>
      </form>
    </div>
  );
}

export default Login;
