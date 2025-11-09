import "./styleHome.css";
import api from "../../services/api";
import { useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
//import img_default from "../../assets/img_default.png"
import { GraficoPizza,GraficoLinha, TabelaTransacoes, CardUser, Modal, MiniCard} from "../../components/graficos";
import { Avatar, Button } from "@mui/material";
import{ format, subMonths}from 'date-fns'
// const dados = [
//   {
//     id: 1,
//     descricao: "Supermercado Carrefour",
//     categoria: "Alimentação",
//     membro: "Jefferson",
//     data: "2025-10-01",
//     valor: "R$ 320,00",
//   },
//   {
//     id: 2,
//     descricao: "Uber",
//     categoria: "Transporte",
//     membro: "Natália",
//     data: "2025-10-02",
//     valor: "R$ 45,00",
//   },
//   {
//     id: 3,
//     descricao: "Cinema",
//     categoria: "Lazer",
//     membro: "Jefferson",
//     data: "2025-10-04",
//     valor: "R$ 60,00",
//   },
//   {
//     id: 4,
//     descricao: "Mensalidade Faculdade",
//     categoria: "Educação",
//     membro: "Jefferson",
//     data: "2025-10-05",
//     valor: "R$ 750,00",
//   },
//   {
//     id: 5,
//     descricao: "Conta de Luz",
//     categoria: "Moradia",
//     membro: "Natália",
//     data: "2025-10-08",
//     valor: "R$ 220,00",
//   },
//   {
//     id: 6,
//     descricao: "Farmácia",
//     categoria: "Saúde",
//     membro: "Jefferson",
//     data: "2025-10-09",
//     valor: "R$ 85,00",
//   },
  
//   ];

const titulo = 'titulo'



function Home() {
  const [showModal, setShowModal] = useState(false)
  const [userName, setUserName] = useState("");
  const [transacoes, setTransacoes]= useState([]);
  const[categorias, setCategorias] = useState([])
  const agora = new Date();
  const mesAtual = format(agora,"MM-yyyy")
  const mesAnterior = format(subMonths(agora,1),"MM-yyyy")
  const [meses, setMeses] = useState([])
  const navigate = useNavigate()
    
    async function handleLogout() {
        await api.post("/logout");
        navigate("/");
    }

    
    
    useEffect(() => {
      async function buscarSessao() {
        try {
          const res = await api.get("/session");
          if (res.data) {
            setUserName(res.data.nome);
            console.log("aqui o seession",res.data.nome)
          }
        } catch (error) {
          console.error("Erro ao buscar sessão:", error);
          }
      } 
      
      async function carregar() {
        try{
          const res = await api.get("/transacao");
          if(res.data) {
            setTransacoes(res.data);
          }

        }catch(error){
          console.log("erro ao buscar dados", error)
        }
        
      }

      async function categorias() {
        
        try{
          const res = await api.get('/gastos-categoria');
          if(res.data)
            {setCategorias(res.data)}

        }catch(error){console.log(error)}
        
      }

      async function fetch() {
        try {
          const res = await api.get('/card-receita');
          if(res.data){setMeses(res.data)}
        } catch (error) {
          console.log(error)
        }
        
      }

      fetch()
     
      buscarSessao();
      carregar()
      categorias()
      }, []);

  
  const atual = meses.find((m)=> m.mes === mesAtual) || 0
  const anterior = meses.find((m)=> m.mes === mesAnterior) ||0
  console.log(atual)
    return (
    <div className="container1">
      <aside className="aside">
        <div>
          {/* <div className="img">
          </div> */}
          <Avatar id="avatare">H</Avatar>  
          <span>Bem Vindo,{<h1>{userName}</h1>}</span> 
          
          <hr /> <Button color="secondary" variant="contained" onClick={()=>{navigate('/home')}}>inicio</Button><hr /> 
         
          <Button color="secondary" variant="contained" onClick={()=>{setShowModal(true)}} >Nova transacao</Button><hr /> 
          
          <Button  color="secondary" variant="contained"> configurações</Button><hr /> 
          <Button  color="secondary" variant="contained">relatorios</Button><hr /> 
          <hr/> 
          {showModal && (<Modal onClose={()=> setShowModal(false)} />)}
  
        </div>
        
        <h1 id="logout" onClick={handleLogout}>sair</h1>
      
      </aside>
      
      <div className="container-center">
        <div className="dashboard-cards">
          <div className="cards-1">
          
             <MiniCard titulo={"Receitas"} valor= {atual.total_receitas} valorAnterior={anterior.total_receitas} />
            
          </div>
          <div className="cards-1">
             <MiniCard titulo={"Despesas"} valor= {atual.total_despesas} valorAnterior={anterior.total_despesas} />
          </div>
          <div className="cards-1">
            <MiniCard titulo={"Saldo"} />
          </div>
          <div className="cards-1">
           <MiniCard titulo={"Poupanca"}  />
          </div>
        </div>
        <div className="dashboard-cards">
          <div className="cards-2"><GraficoLinha titulo = "Gastos por mes"/></div>
          <div className="cards-2"><GraficoPizza dados ={categorias}  titulo="Gastos por Categoria"/> </div>
        </div>
        <div className="dashboard-cards">
          <div className="cards-3" id="trans">
            <h1 style={{ color: "#3b234a", fontSize: "1.2rem" }}>{titulo}</h1>
            <TabelaTransacoes dados={transacoes}/></div>
          <div className="cards-3" id="membros">
            <h3 style={{ color: "#3b234a", fontSize: "1.2rem" }}>Membros do grupo</h3>
            <CardUser />
            </div>
        </div>
        
      </div>

    </div>
  );
}

export default Home;





