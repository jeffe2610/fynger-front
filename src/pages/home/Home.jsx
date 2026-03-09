import "./styleHome.css";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GroupsIcon from '@mui/icons-material/Groups';
import {
  GraficoPizza,
  GraficoLinha,
  TabelaTransacoes,
  CardUser,
  ModalTransacao,
  MiniCard,
  ModalConfig,
  
} from "../../components/Componentes";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  Select,
  styled,
  MenuItem
} from "@mui/material";
import { format, subMonths } from "date-fns";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from '@mui/icons-material/Menu';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import PersonIcon from '@mui/icons-material/Person';
import GroupOffIcon from '@mui/icons-material/GroupOff';
import { UseContexto } from "../../context/contexto";


function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showModalconfig, setShowModalConfig] = useState(false);
  const [userName, setUserName] = useState("");
  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const agora = new Date();
  const mesAtual = format(agora, "yyyy-MM");
  const mesAnterior = format(subMonths(agora, 1), "yyyy-MM");
  const [meses, setMeses] = useState([]);
  const [avatar, setAvatar] = useState("");
  const [nomeGrupo, setNomeGrupo] = useState("");
  const [grupo, setGrupo] = useState([]);
  
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(null)
  const {contexto , TrocarContexto} = UseContexto()
  const {atualGroup, TrocarGrupo} = UseContexto()
 
  const DrawerButton = styled(Button)({
    color: '#4A5568',
    justifyContent:"flex-start",
    paddingLeft:"20px",
    margin:"5px",
    fontWeight:"bold",
    fontSize:"15px",
  textTransform:"none"
  
  
  
  
})


async function handleLogout() {
  localStorage.removeItem("token")
  TrocarContexto("pessoal")
  TrocarGrupo(null)
  
  navigate("/");
}

useEffect(()=>{
  async function titleGrupo() {
    if(atualGroup){
      const titulo =   grupo.find((g)=> g.grupo_id === atualGroup)
      setNomeGrupo(titulo.nome)
      
    }
  
  }
  titleGrupo()
  
},[atualGroup, grupo])
useEffect(() => {
  async function buscarSessao() {
    try {
        const res = await api.get("/session");
        if (res.data) {
          setUserName(res.data.nome);
          setAvatar(res.data.avatar);
          
          
          
          
        }
      } catch (error) {
        console.error("Erro ao buscar sessão:", error);
      }
    }

    async function carregar() {
      try {
        const res = await api.get("/transacao");
        if (res.data) {
          setTransacoes(res.data);
        }
      } catch (error) {
        console.log("erro ao buscar dados", error);
      }
    }

    async function categorias() {
      try {
        const res = await api.get("/transacoes-grafico");
        if (res.data) {
          setCategorias(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    async function fetch() {
      try {
        const res = await api.get("/cards-receitas-despesas");
        if (res.data) {
          setMeses(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
     async function buscarGrupos() {
      try {
        const res = await api.get("/grupos");

        if (res.data) {
          setGrupo(res.data);
          if(!atualGroup)
          TrocarGrupo(
            res.data[0].grupo_id
          )
          
        }
      } catch (error) {
        console.log("erro ao buscar dados", error);
      }
    }
    buscarGrupos()
    
    fetch();
    buscarSessao();
    carregar();
    categorias();
    
  }, [reload,contexto, atualGroup,TrocarGrupo]);



  const atual = meses.find((m) => m.mes === mesAtual) || 0;
  const anterior = meses.find((m) => m.mes === mesAnterior) || 0;

  const handleClick = () => {
    setOpenDrawer((prev => !prev))
  }

  


  return (
    <div className="container1">
      <Box className="menu">
        <div className="informacoes">
          <Avatar
            src={`${avatar}?t=${Date.now()}`}
            sx={{ width: "80px", height: "80px" }}
            id="avatare"
          />
          <div className="info-grupo">
            <span>Bem Vindo,{<h2>{userName}</h2>}</span>
            <Box sx={{display:"flex",alignItems:"center",gap:"5px"}}>{contexto === "pessoal" ?
               <> <PersonIcon fontSize="inherit" /> <p>Finanças Pessoais</p> </>
              :
               <> <GroupsIcon fontSize="small"/> <p>{nomeGrupo}</p> </>}</Box>
            <span>
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <Box
          sx={{
            border: "solid 1px ",
            borderRadius: "10px",
          }}
        >
          <IconButton size="large" onClick={handleClick}>
            <MenuIcon />
          </IconButton>
        </Box>

        <Drawer
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          anchor="right"
        >
          <Box style={{ width: "100%", padding: "10px" }}>
            <Box
              sx={{
                padding: "10px 0px 60px 0px ",
                color: "#4A5568",
              }}
            >
              <h2>Menu</h2>
              <span>Gerencie suas finanças e configurações</span>
            </Box>

            <h5 style={{ color: "#4a556849" }}>visualizar</h5>
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                padding: "10px",
                
              }}
            >
              <Button
                variant={contexto === "pessoal" ? "contained" : "outlined"}
                onClick={() => TrocarContexto("pessoal")}
                sx={{
                  height: "35px",
                  width: "100%",
                  borderRadius: "7px",
                  border: "solid 1px #4a556849",
                  color: contexto === "pessoal" ? "white" : "black",
                  backgroundColor:
                    contexto === "pessoal" ? "#4A5568" : "transparent",
                }}
              >
                <PersonIcon sx={{ marginInline: "5px" }} /> pessoal
              </Button>

              <Button
                variant={contexto === "grupo" ? "contained" : "outlined"}
                onClick={() => TrocarContexto("grupo")}
                sx={{
                  height: "35px",
                  width: "100%",
                  borderRadius: "7px",
                  border: "solid 1px #4a556849",
                  color: contexto === "grupo" ? "white" : "black",
                  backgroundColor:
                    contexto === "grupo" ? "#4A5568" : "transparent",
                }}
              >
                
                <GroupsIcon sx={{ marginInline: "5px" }} /> grupo
              </Button>
            </Box>
            
            {contexto === "grupo" && grupo.length !== 0 && (
             <>
             <h5 style={{color:"#4a556849"}}>grupo Ativo </h5>
              
              <Select 
              
              fullWidth
              size="small"
              sx={{margin:"10px 0px 25px 0px"}}
              value={atualGroup}
              onChange={(e)=>(TrocarGrupo(e.target.value))}   
              >
                {grupo.map((item)=>(
                  <MenuItem value={item.grupo_id}>{item.nome}</MenuItem>
                )
                )}
                
              </Select>
            </>)}


            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "10px 0px 60px 0px",
                color: "#4a556849",
                borderBottom: "solid 1px",
                borderTop: "solid 1px "
              }}
            >
              <h5>Ações</h5>
              <DrawerButton onClick={() => handleClick()}>
                <HomeIcon sx={{ marginInline: "5px" }} />
                Dashboard
              </DrawerButton>
              <DrawerButton
                onClick={() => {
                  (handleClick(), setShowModal(true));
                }}
              >
                <CurrencyExchangeIcon sx={{ marginInline: "5px" }} />
                Nova transação
              </DrawerButton>
              <DrawerButton disabled>
                <LocalGroceryStoreIcon sx={{ marginInline: "5px" }} /> Lista de
                Compras
              </DrawerButton>
              <DrawerButton
                onClick={() => {
                  (handleClick(), setShowModalConfig(true));
                }}
              >
                <SettingsIcon sx={{ marginInline: "5px" }} />
                Ajustes
              </DrawerButton>
              <DrawerButton
                onClick={()=>navigate("/grupos")}
              >
                <GroupsIcon sx={{ marginInline: "5px" }} />
                Gerenciar Grupos
              </DrawerButton>
            </Box>
            <Button
              onClick={handleLogout}
              color="error"
              sx={{ paddingLeft: "30px" }}
            >
              <ExitToAppIcon sx={{ marginInline: "5px" }} />
              Sair
            </Button>
          </Box>
        </Drawer>
      </Box>

      {showModal && (
        <ModalTransacao
          onClose={() => setShowModal(false)}
          onUpdated={() => setReload((prev) => !prev)}
        />
      )}
      {showModalconfig && (
        <ModalConfig
          onClose={() => setShowModalConfig(false)}
          reload={reload}
          onUpdated={() => setReload((prev) => !prev)}
        />
      )}
      {(contexto === "grupo" && grupo.length === 0 )&&(
        <Box sx={{
          display:"flex", 
          flexDirection:"column",
          backgroundColor:"#F4F7FA",
          alignItems:"center",
          padding:"20px",
          margin:"40px",
          textAlign:"center",
          borderRadius:"15px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
           
        }}> 
          <h4> Você ainda não participa de nenhum grupo. <br/> No menu acesse: <br/> Gerenciar grupos para criar um novo grupo ou ingressar em um existente.</h4>
          <GroupOffIcon  sx={{ fontSize: 150 }}/>
          <Button
           variant="contained"
           sx={{backgroundColor:"#4A5568"}}
           onClick={()=>navigate("/grupos")}>
          Gerenciar grupos</Button>
        </Box>
      )}
      
      {(contexto === "pessoal" || grupo.length !== 0) && (
        <div className="container-center">
          <div className="dashboard-cards">
            <div className="cards-1">
              <MiniCard
                titulo={"Receitas"}
                valor={atual.receita}
                valorAnterior={anterior.receita}
              />
            </div>
            <div className="cards-1">
              <MiniCard
                titulo={"Despesas"}
                valor={atual.despesa}
                valorAnterior={anterior.despesa}
              />
            </div>
            <div className="cards-1">
              <MiniCard titulo={"Saldo"} />
            </div>
            <div className="cards-1">
              <MiniCard titulo={"Poupanca"} />
            </div>
          </div>
          <div className="dashboard-cards">
            <div className="cards-2">
              <GraficoLinha titulo="Gastos por Mês" reload={reload} />
            </div>
            <div className="cards-2">
              <GraficoPizza
                dados={categorias}
                titulo="Gasto por Categoria"
              />{" "}
            </div>
          </div>
          <div className="dashboard-cards">
            <div className="cards-3" id="trans">
              <h1 style={{ fontSize: "1.2rem" }}>transações</h1>
              <TabelaTransacoes dados={transacoes} reload={reload} />
            </div>
            {contexto === "grupo" && (
              <div className="cards-3" id="membros">
                <h3 style={{ fontSize: "1.2rem" }}>Membros do grupo</h3>
                <CardUser />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
