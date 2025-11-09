
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart,Line,XAxis,YAxis,CartesianGrid, } from "recharts";
import {useEffect, useState} from 'react';
import {
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  InputLabel,
  FormControl,
  FormLabel,
  FormControlLabel,
  TextField,
  Button,
  CircularProgress
  

} from "@mui/material";
import "./components.css";
import Avatar from "@mui/material/Avatar";
import "./components.css"
import api from "../services/api";
import { format } from "date-fns";
import { formatarMoeda } from "../utils/formatarMoeda";
// Paleta de cores
const COLORS = ["#3b234a", "#9dd3df", "#c9d1d3", "#3b3737", "#f7f7f7"];
// utils/formatarMoeda.js


export function GraficoPizza({dados,titulo}) {
  
  
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ color: "#3b234a", fontSize: "1.2rem" }}>{titulo}</h1>

      {/* Wrapper com altura fixa para o gráfico */}
      <div style={{ width: "100%", height: "250px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dados}
              dataKey="valor"
              nameKey="categoria"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              label
            >
              {dados.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


export function GraficoLinha({titulo}) {
 
  const [dados, setDados]=  useState([])
  useEffect(()=>{
    async function fetch() {
      try {
        const res = await api.get('/card-receita');
        if(res.data){setDados(res.data)}

      } catch (error) {
        console.log(error)
      }
      
    }
    fetch()
  },[])

  

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ color: "#3b234a", fontSize: "1.2rem" }}>{titulo}</h1>

      {/* Wrapper com altura fixa para o gráfico */}
      <div style={{ width: "100%", height: "250px", fontWeight:"bold" }}>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart  data={dados} margin={{bottom:30, right:40,left:40}} >
                <CartesianGrid strokeDasharray="8 8" />
                <XAxis dataKey='mes' interval={0} dy={5 } tick={{fontSize:12}}/>
                <YAxis width='auto'/>
                <Tooltip/>
                <Legend/>
                <Line type="monotone" dataKey='total_despesas' stroke="#922929fd" activeDot={{ r: 8 }}/>
                <Line type='monotone' dataKey='total_receitas' stroke="#2e5a34ff" />
            </LineChart>
          
        </ResponsiveContainer>
      </div>
    </div>
  );
  

};


export function TabelaTransacoes({ dados }) {
  
  
  
  
  
  
  
  
  return (
    <TableContainer
      
      sx={{
        maxHeight: "400px",         // limite de altura
        overflowY: "auto",      // rolagem vertical
        borderRadius: 2,        // bordas arredondadas
      }}
    >
      
      <Table size="medium" stickyHeader  > 
        <TableHead sx={{backgroundColor:'transparent'}}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor:'#814f8bff'}}>Nome</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor:'#814f8bff'}}>Categoria</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor:'#814f8bff'}}>Membro</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor:'#814f8bff'}}>Data</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor:'#814f8bff'}}>Valor</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {dados.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.nome}</TableCell>
              <TableCell>{item.categoria}</TableCell>
              <TableCell>{item.membro}</TableCell>
              <TableCell>{format(item.data,"dd/MM/yyyy")}</TableCell>
              <TableCell>{formatarMoeda(item.valor)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}



export function CardUser(){
   const [membros, setMembros] = useState([])
  
   useEffect(()=>{
     async function fetchuser() {
       try {
         const res = await api.get('/grupo');
         if(res.data){setMembros(res.data)};

       } catch (error) {
         console.log(error)
       }
      
     }
    fetchuser()
   }, [])

   




  return(
    
    
    membros.map((item)=>(
      
      

      <div className="principal">
        <Avatar id="avatar">
          {item.avatart? item.avatart : (item.nome.split(" ")[0][0].toUpperCase()+
                                        item.nome.split(" ")[1][0].toUpperCase())}
      </Avatar>
        <div className="nome-gasto">
          <h3>{item.nome}</h3>
          <span className="perfil">{item.perfil}</span>
          <p>gastos: {formatarMoeda(item.total_despesas)}</p>
        </div>
        <div className="contribuicao">
          <span>contribuição</span>
          <h4>{formatarMoeda(item.total_receitas)}</h4>
        </div>
      </div>
    ))
    
    
  
  )
}



export function Modal({onClose}){
   const [error, setError] = useState("")
   const [loading,setLoading] = useState(false)
   const [nome, setNome] = useState("")
   const [valor, setValor] = useState("")
   const [descricao, setDescricao] = useState("")
   const [parcelas, setParcelas] = useState(0)
   const [data, setData] = useState("")
   const [pagamento, setPagamento] = useState("")
   const [tipo, setTipo] = useState("")
   const [vencimento, setVencimento] = useState("")
   const [category, setCategory] = useState([])
   const [categoriaselecionada,setCategoriaSelecionada] = useState('')
   
   
  useEffect(() => {
  async function fetchCategorias() {
    try {
      const res = await api.get('/categorias');
      if (res.data) setCategory(res.data);
    } catch (erro) {
      console.log(erro);
    }
  }

  fetchCategorias();
  
}, []);

   
   console.log(category)
   async function handleregister(e) {
       setLoading(true)
       e.preventDefault();
       console.log(data,vencimento)
       setError("");
   
       try{
         const Res = await api.post("/transacao",{nome, valor, descricao,categoriaselecionada, parcelas, data, vencimento });
         alert("Transação registrada com sucesso")
       }catch(error){
         setError(error.response?.data?.error || "erro ao registrar transferencia");
       }finally{
         setLoading(false)
        
       }
        
     }


  
  return(
    
    <div className="overlay">
      
      <div className="form-trans">
        <div className="scroll-area">
          <form onSubmit={handleregister}> 
            <h3>Nova transferencia</h3>
            <FormControl fullWidth margin="normal">
              <FormLabel>tipo de Transação</FormLabel>
              <RadioGroup
              row
              value={tipo}
              onChange={(e)=>{
                const value = e.target.value;
                setTipo(value)
                if(value === 'receita'){
                  setParcelas(1)
                  
                }
              }}
              >
                <FormControlLabel value="despesa" control={<Radio/>} label="despesa"/>
                <FormControlLabel  value="receita" control={<Radio />} label="receita"/>
              </RadioGroup>    
            </FormControl>
            
            <TextField fullWidth
            margin="normal"
            label="Nome"
            value={nome}
            onChange={(e)=>setNome(e.target.value)}
            variant="outlined"
            disabled={!tipo}/>

            <TextField fullWidth
            margin="normal"
            type="number"
            label="Valor"
            value={valor}
            onChange={(e)=>setValor(e.target.value)}
            variant="outlined"
            disabled={!tipo}/>

            <TextField fullWidth
            margin="normal" 
            label="Descricao"
            value={descricao}
            onChange={(e)=>setDescricao(e.target.value)}
            variant="outlined"
            disabled={!tipo}/>

            <FormControl fullWidth margin="normal">
              <InputLabel id="categoria-label">Categorias</InputLabel>
              <Select
                labelId="categoria-label"
                id="categorias"
                value={categoriaselecionada}
                onChange={(e)=> setCategoriaSelecionada(e.target.value)}
                disabled={!tipo}>
                <MenuItem value=""><em>Selecione</em></MenuItem>
                {category
                  .filter(item => item.tipo === tipo)
                  .map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nome}
                    </MenuItem>
                  ))
                }

              </Select>
              {tipo === "despesa" && (
                <>

                  <FormLabel>Forma de pagamento</FormLabel>
                  <RadioGroup
                    row
                    value={pagamento}
                    onChange={(e)=>{
                      const value = e.target.value;
                      setPagamento(value)
                      if (value=== "avista"){
                        setParcelas(1)}

                      }
                    
                    
                    }
                    
                  
                  >
                    <FormControlLabel value="avista" control={<Radio />} label="À vista" />
                    <FormControlLabel value="parcelado" control={<Radio />} label="Parcelado" />
                  </RadioGroup>
                </>
              )}  
            </FormControl>
            
            
            {(pagamento==="parcelado" && tipo === "despesa") && (
              
              <div>
                <TextField 
                label="quantidade de parcelas"
                type="number"
                variant="outlined"
                value={parcelas}
                onChange={(e)=>setParcelas(e.target.value)}/>

                <TextField 
                label="1º vencimento"
                type="date"
                variant="filled"
                value={vencimento}
                InputLabelProps={{ shrink: true }}
                onChange={(e)=>setVencimento(e.target.value)}/>
                
              </div>
              

              
            )}

            <TextField fullWidth
              label="Data"
              type="date"
              variant="filled"
              margin="normal"
              value={data}
              onChange={(e)=>{
                const value= e.target.value;
                setData(value);
                if (pagamento==="avista"){
                  setVencimento(value)
                }
                if (tipo === 'receita'){
                  setVencimento(value)
                  
                }
              }}
              InputLabelProps={{ shrink: true }}
               disabled={!tipo}/>
            {/* Botões */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: '16px', gap:"20px"}}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : "Registrar"}
              </Button>

              <Button variant="outlined" color="secondary" onClick={onClose}>
                Voltar
              </Button>
              </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
            
          </form>

        </div>

      </div>
  
    </div>
  )
}



export function MiniCard({titulo, valor = 0, valorAnterior = 0}){
  
  

  const diferenca = valorAnterior? ((valor-valorAnterior)/valorAnterior)*100 : 0
  const positivo = diferenca > 0
    
    
  return(
    <>
      <span>{titulo}</span>
      <h2>{formatarMoeda(valor)}</h2>
         
      <p
        style={{
        color: positivo ? "#2e5a34ff" : diferenca < 0 ? "#922929fd" : "gray",
        fontWeight: "bold",
      }}>
        {valorAnterior
          ? `${diferenca.toFixed(2)}% ${positivo ? "Maior" : "Menor"} vs mês anterior`
          : "Sem comparação com mês anterior"}
      </p>
    </>
  )
}