import "./styleHome.css";
import api from "../../services/api";
import { useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
//import img_default from "../../assets/img_default.png"
import { GraficoPizza,GraficoLinha, TabelaTransacoes, CardUser, Modal, MiniCard, ModalConfig} from "../../components/graficos";
import { Avatar, BottomNavigation, BottomNavigationAction, Button,  } from "@mui/material";
import{ format, subMonths}from 'date-fns'
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
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
  const [showModalconfig, setShowModalConfig] = useState(false)
  const [userName, setUserName] = useState("");
  const [transacoes, setTransacoes]= useState([]);
  const[categorias, setCategorias] = useState([])
  const[selecao, setSelecao] = useState("inicio")
  const agora = new Date();
  const mesAtual = format(agora,"MM-yyyy")
  const mesAnterior = format(subMonths(agora,1),"MM-yyyy")
  const [meses, setMeses] = useState([])
  const [ avatar, setAvatar] = useState("")
  const navigate = useNavigate()
    
    async function handleLogout() {
        await api.post("/logout");
        navigate("/");
    }

      const handleChange = (event, newValue) => {
        setSelecao(newValue);

        if(newValue === "ajustes"){setShowModalConfig(true),setShowModal(false)}
        if(newValue === "novaTransacao"){setShowModal(true), setShowModalConfig(false)}
        if(newValue === "inicio"){navigate("/Home"),setShowModal(false), setShowModalConfig(false)}
        if(newValue === "sair"){handleLogout}
      };
    
    useEffect(() => {
      async function buscarSessao() {
        try {
          const res = await api.get("/session");
          if (res.data) {
            setUserName(res.data.nome);
            setAvatar(res.data.avatar)
            
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
      <menu className="menu">
        
        <div className="informacoes" >
          <Avatar src={ `${avatar}?t=${Date.now()}`} sx={{width:"50px",height:"50px"}} id="avatare" /> 
          <div className="info-grupo">
            <span>Bem Vindo,{<h2>{userName}</h2>}</span> 
            <h5>nome do grupo - mes</h5>
          </div>

        </div>
        
        <BottomNavigation id= "menu-but" value={selecao} onChange={handleChange}
        sx={{backgroundColor:"transparent"}}>
          <BottomNavigationAction label="Inicio" value={'inicio'} icon={<HomeIcon/>} /*  onClick={()=>{navigate('/Home')}} *//> <hr />
          <BottomNavigationAction label="Transações"  value={ 'novaTransacao'}icon={<CurrencyExchangeIcon/>} /* onClick={()=>{setShowModal(true)}}  *//> <hr />
          <BottomNavigationAction label="Ajustes" value={'ajustes'} icon={<SettingsIcon/>} /* onClick={()=>{setShowModalConfig(true)}} *//> <hr />
          <BottomNavigationAction label="Sair" value={'sair'} icon={<ExitToAppIcon/>}  onClick={handleLogout} sx={{color:"red"}}/> hr
        </BottomNavigation>
      </menu>

          
        
          
          
          
         
         {showModal && (<Modal onClose={()=> setShowModal(false)} />)}
         {showModalconfig && (<ModalConfig onClose={()=> setShowModalConfig(false)} />)}
          
        
      
      
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





