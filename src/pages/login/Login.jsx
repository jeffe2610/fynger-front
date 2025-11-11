
import {Link, useNavigate} from "react-router-dom"
import { useState } from "react";
import api from "../../services/api";
import './style.css'

function Login() {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  async function handleLogin(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      
      const res = await api.post("/login", { email, password: senha });
      localStorage.setItem("token",res.data.token)
      console.log("Usuário logado:", res.data.user);
      navigate("/Home")
      // futuramente: redirecionar para o painel
    } catch (err) {
      setErro(err.response?.data?.error || "Falha ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <form className="formularios" onSubmit={handleLogin} >
        <h1>Fynger</h1>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        {erro && <p className="erro">{erro}</p>}
         <Link to="/Cadastro">Cadastre-se </Link>
         <Link to ="/Cadastro"> esqueci minha senha</Link>
      </form>
    </div>
  );
}

export default Login;
