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
  Modal,
  MiniCard,
  ModalConfig,
  SubmitButton
} from "../../components/Componentes";
import {
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Drawer
} from "@mui/material";
import { format, subMonths } from "date-fns";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from '@mui/icons-material/Menu';

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showModalconfig, setShowModalConfig] = useState(false);
  const [userName, setUserName] = useState("");
  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selecao, setSelecao] = useState("inicio");
  const agora = new Date();
  const mesAtual = format(agora, "MM-yyyy");
  const mesAnterior = format(subMonths(agora, 1), "MM-yyyy");
  const [meses, setMeses] = useState([]);
  const [avatar, setAvatar] = useState("");
  const [nomeGrupo, setNomeGrupo] = useState("");
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(null)

  async function handleLogout() {
    localStorage.removeItem("token")

    navigate("/");
  }

  const handleChange = (event, newValue) => {
    setSelecao(newValue);

    if (newValue === "ajustes") {
      setShowModalConfig(true), setShowModal(false);
    }
    if (newValue === "novaTransacao") {
      setShowModal(true), setShowModalConfig(false);
    }
    if (newValue === "inicio") {
      navigate("/Home"),
        setShowModal(false),
        setShowModalConfig(false),
        setReload((prev) => !prev);
    }
   
  };

  useEffect(() => {
    async function buscarSessao() {
      try {
        const res = await api.get("/session");
        if (res.data) {
          setUserName(res.data.nome);
          setAvatar(res.data.avatar);
          setNomeGrupo(res.data.nomeGrupo);
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
        const res = await api.get("/card-receita");
        if (res.data) {
          setMeses(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetch();

    buscarSessao();
    carregar();
    categorias();
  }, [reload]);

  const atual = meses.find((m) => m.mes === mesAtual) || 0;
  const anterior = meses.find((m) => m.mes === mesAnterior) || 0;
  
  const handleClick = () => {
    setOpenDrawer((prev => !prev))
  }




  return (
    <div className="container1">
      <menu className="menu">
        <div className="informacoes">
          <Avatar
            src={`${avatar}?t=${Date.now()}`}
            sx={{ width: "80px", height: "80px" }}
            id="avatare"
          />
          <div className="info-grupo">
            <span>Bem Vindo,{<h2>{userName}</h2>}</span>
            <h4>{nomeGrupo}</h4>
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

        <BottomNavigation
          id="menu-but"
          value={selecao}
          onChange={handleChange}
          sx={{ backgroundColor: "transparent" }}
          
        >
          <BottomNavigationAction
            label="Inicio"
            value={"inicio"}
            icon={<HomeIcon />} 
            disabled={openDrawer}
          />{" "}
          <hr />
          <BottomNavigationAction
            label="Transações"
            value={"novaTransacao"}
            icon={<CurrencyExchangeIcon />}
             disabled={openDrawer}
          />{" "}
          <hr />
          <BottomNavigationAction
            label="Ajustes"
            value={"ajustes"}
            icon={<SettingsIcon />}
             disabled={openDrawer}
          />{" "}
          <hr />
          <BottomNavigationAction
            label="Menu"
            value={"menu"}
            icon={<MenuIcon />}
            onClick={handleClick}
            sx={{ color: "red" }}
          />{" "}
          hr
        </BottomNavigation>
        
         <Drawer open={openDrawer} onClose={()=>setOpenDrawer(false)} anchor="bottom">
          <div className='drawer'>
              <Button >
                Alterar para grupo <GroupsIcon/> 
              </Button>
              <Button
              onClick={handleLogout}>
                Sair <ExitToAppIcon/>
              </Button>
          </div>

        </Drawer>
      
      </menu>

      {showModal && (
        <Modal
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

      <div className="container-center">
        <div className="dashboard-cards">
          <div className="cards-1">
            <MiniCard
              titulo={"Receitas"}
              valor={atual.total_receitas}
              valorAnterior={anterior.total_receitas}
            />
          </div>
          <div className="cards-1">
            <MiniCard
              titulo={"Despesas"}
              valor={atual.total_despesas}
              valorAnterior={anterior.total_despesas}
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
            <GraficoPizza dados={categorias} titulo="Gasto por Categoria" />{" "}
          </div>
        </div>
        <div className="dashboard-cards">
          <div className="cards-3" id="trans">
            <h1 style={{  fontSize: "1.2rem" }}>transações</h1>
            <TabelaTransacoes dados={transacoes} reload={reload} />
          </div>
          <div className="cards-3" id="membros">
            <h3 style={{  fontSize: "1.2rem" }}>
              Membros do grupo
            </h3>
            <CardUser />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
