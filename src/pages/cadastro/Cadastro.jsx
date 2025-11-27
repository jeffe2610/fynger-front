
import { useState } from "react";

import {useNavigate } from "react-router-dom"; 
import api from "../../services/api"; 
import '../../components/components.css'
import { FormControl, Radio, RadioGroup,FormControlLabel, TextField, FormLabel, CircularProgress, Button } from "@mui/material";
import { BoxAlerta, SubmitButton } from "../../components/graficos";


function Cadastro() {
  
  const [nome , setNome] = useState("");
  const [email , setEmail] = useState("");
  const [tel , setTel] = useState("");
  const [senha , setSenha] = useState("");
  const [csenha, setCsenha] = useState("");
  const [loading , setLoading] = useState(false);
  const [tipo, setTipo] = useState(" ")
  const [codigo, setCodigo] = useState("")
  const navigate = useNavigate();
  const[open,setOpen] = useState(false)
  const[alertaMensagem, setAlertaMensagem] = useState("")
  
  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true)

    
    try {
      
      const res = await api.post("/signup",tipo === "Membro"? {email,password : senha, nome, tel, grupoId: codigo} : {email,password : senha, nome, tel} );
      console.log("Usuário cadastrado:", res.data.user);
      console.log("o res",res)
      alert("cadastro realizado com sucesso!");
      navigate("/");
    }catch(err){
      let localError= err.response?.data?.error || "Falha ao cadastrar";
      setAlertaMensagem(localError)
      setOpen(true)
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
              <FormLabel >Tipo de cadastro</FormLabel>
              <RadioGroup
              row
              value={tipo}
              
              onChange={(e)=> setTipo(e.target.value) }
              >
                <FormControlLabel  value="Membro" control={<Radio/>} label="Membro" />
                <FormControlLabel required value="Administrador" control={<Radio />} label="Administardor" />

              </RadioGroup>
            </FormControl>
            
            {tipo === "Membro" &&  (
              <TextField size="small"
              margin="normal"
              label= "codigo do grupo"
              type="text"
              value={codigo}
              required
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
            
            size="small"
            required
            inputProps={{
              pattern: "^[A-Za-zÀ-ÖØ-öø-ÿ]+(\\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)+$",
              title: "Digite nome e sobrenome (ex: João Silva)"}}
            />

            <TextField fullWidth
            margin="normal"
            label= "E-mail"
            type="email"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            variant="outlined"
           
            size="small"
            required
            />

            <TextField fullWidth
            margin="normal"
            label= "telefone"
            type="tel"
            value={tel}
            onChange={(e)=> setTel(e.target.value)}
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
            required
            />

            <TextField fullWidth
            margin="normal"
            type="password"
            label= "Confirme a senha"
            value={csenha}
            onChange={(e)=> setCsenha(e.target.value)}
            variant="outlined"
            
            size="small"
            required
            inputProps={{
              pattern: senha ? senha.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") : ".*",
              title: "As senhas não correspondem"}}
            />

            <div className="button" style={{flexDirection:"column"}}>

              <SubmitButton
              variant="contained"
              disabled={loading}
              type="submit"
              size="small"
              >
                {loading ? <CircularProgress size={22} color="inherit"/> : "Registrar"}
              </SubmitButton>

              <Button 
              onClick={()=>navigate("/")}>Voltar para login</Button>
            </div>


            <BoxAlerta
              open={open}
              onClose={()=>setOpen(false)}
              type={"error"}
              duration={5000}
              mensagem={alertaMensagem} />
            
          </form>
        </div>
      </div>

    </div>
  );
}

export default Cadastro;
