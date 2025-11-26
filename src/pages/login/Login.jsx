
import {Link, useNavigate} from "react-router-dom"
import { useState } from "react";
import api from "../../services/api";
import { BoxAlerta } from "../../components/graficos";
import { TextField, Button, CircularProgress } from "@mui/material";
import './style.css'

function Login() {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  
  const [ open,setOpen] = useState(false)
  const [alertaMensagem,setAlertaMensagem] = useState("")
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  async function handleLogin(e) {
    e.preventDefault();
    
    setLoading(true);

    try {
      
      const res = await api.post("/login", { email, password: senha });
      localStorage.setItem("token",res.data.token)
      console.log("Usuário logado:", res.data.user);
      navigate("/Home")
      // futuramente: redirecionar para o painel
    } catch (err) {
      let localError= err.response?.data?.error || "Falha ao fazer login";
      setAlertaMensagem(localError)
      setOpen(true)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <form className="formularios" onSubmit={handleLogin} >
        <h1>Fynger</h1>
        <TextField fullWidth
            margin="normal"
            label= "E-mail"
            type="email"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            variant="outlined"
           
            size="small"
            />

         

            <TextField fullWidth
            margin="normal"
            type= "password"
            label="Senha"
            value={senha}
            onChange={(e)=> setSenha(e.target.value)}
            variant="outlined"
           
            size="small"
            />


         <Button
                variant="contained"
                id="submitButton"
                type="submit"
                disabled={loading}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : "Entrar"}
          </Button>
        

        <BoxAlerta
          duration={5000}
          mensagem={alertaMensagem}
          type={"error"}
          open= {open}
          onClose={()=>setOpen(false)}/>

         <Link  style={{textDecoration:"none", fontWeight:"bold"}} to="/Cadastro">Cadastre-se </Link>
         <Link  style={{textDecoration:"none", fontWeight:"bold"}}  to ="/Cadastro"> esqueci minha senha</Link>
      </form>
    </div>
  );
}

export default Login;
