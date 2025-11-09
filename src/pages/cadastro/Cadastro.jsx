
import { useState } from "react";
import "../login/style.css"
import { Link, useNavigate } from "react-router-dom"; 
import api from "../../services/api"; 
import '../../components/components.css'
import { FormControl, Radio, RadioGroup,FormControlLabel, TextField, FormLabel, CircularProgress, Button } from "@mui/material";


function Cadastro() {
  
  const [nome , setNome] = useState("");
  const [email , setEmail] = useState("");
  const [tel , setTel] = useState("");
  const [senha , setSenha] = useState("");
  const [csenha, setCsenha] = useState("");
  const [loading , setLoading] = useState(false);
  const [erro , setErro] = useState("");
  const [tipo, setTipo] = useState("")
  const [codigo, setCodigo] = useState("")
  const navigate = useNavigate();
  
  async function handleSignup(e) {
    e.preventDefault();
    setErro("");
    setLoading(true)

    
    try {
      const res = await api.post("/signup",{email,password : senha, nome, tel} );
      console.log("Usuário cadastrado:", res.data.user);
      alert("cadastro realizado com sucesso!");
      navigate("/");
    }catch(err){
      setErro(err.response?.data?.error || "Falha ao cadastrar");
    }finally{
      setLoading(false)
    }
    
  }


  return (
    <div className="container-form">
      <div className="form-trans">
        <div className="scroll-area">

          <form  onSubmit={handleSignup}>
            <h3>Cadastro</h3>
            <FormControl fullWidth margin="normal" >
              <FormLabel>Tipo de cadastro</FormLabel>
              <RadioGroup
              row
              value={tipo}
              
              onChange={(e)=> setTipo(e.target.value) }
              >
                <FormControlLabel value="Membro" control={<Radio/>} label="Membro" />
                <FormControlLabel value="Administrador" control={<Radio />} label="Administardor" />

              </RadioGroup>
            </FormControl>
            
            {tipo === "Membro" &&  (
              <TextField size="small"
              margin="normal"
              label= "codigo do grupo"
              type="text"
              value={codigo}
              onChange={(e)=> setCodigo(e.target.value)}
              variant="outlined"
              
              />
            )}


            <TextField fullWidth
            margin="normal"
            label= "Nome"
            type="text"
            value={nome}
            onChange={(e)=> setNome(e.target.value)}
            variant="outlined"
            disabled={!tipo}
            size="small"
            />

            <TextField fullWidth
            margin="normal"
            label= "E-mail"
            type="email"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            variant="outlined"
            disabled={!tipo}
            size="small"
            />

            <TextField fullWidth
            margin="normal"
            label= "telefone"
            type="tel"
            value={tel}
            onChange={(e)=> setTel(e.target.value)}
            variant="outlined"
            disabled={!tipo}
            size="small"
            />

            <TextField fullWidth
            margin="normal"
            type= "password"
            label="Senha"
            value={senha}
            onChange={(e)=> setSenha(e.target.value)}
            variant="outlined"
            disabled={!tipo}
            size="small"
            />

            <TextField fullWidth
            margin="normal"
            type="password"
            label= "Confirme a senha"
            value={csenha}
            onChange={(e)=> setCsenha(e.target.value)}
            variant="outlined"
            disabled={!tipo}
            size="small"
            />

            <div className="button">

              <Button
              variant="contained"
              disabled={loading}
              type="submit"
              size="small"
              >
                {loading ? <CircularProgress size={22} color="inherit"/> : "Registrar"}
              </Button>

              <Button 
              onClick={()=>navigate("/")}>Voltar para login</Button>
            </div>


            {erro && <p className="erro">{erro}</p>}
            
          </form>
        </div>
      </div>

    </div>
  );
}

export default Cadastro;
