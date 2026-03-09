import { Box,
   Button,
   Avatar,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { 
  ModalGrupo,SubmitButton,BoxDialog,BoxAlerta} from "../../components/Componentes";
import "../home/styleHome.css";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useState, useEffect} from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import GroupOffIcon from '@mui/icons-material/GroupOff';

import EditIcon from "@mui/icons-material/Edit";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import { UseContexto } from "../../context/contexto";


function GestaoGrupo() {
  const navigate = useNavigate();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [ openCode,setOpenCode] = useState(false)
  const [loading, setLoading] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [ openExit, setOpenExit] = useState(false);
  const [ reload, setReload] = useState(false)
  const [alertaMensagem, setAlertaMensagem] = useState("");
  const [alertaTipo, setAlertaTipo] = useState("");
  const [ code, setCode] = useState(null)

  const {TrocarGrupo,TrocarContexto}= UseContexto();

  const showAlerta = (msg, type) => {
    setAlertaMensagem(msg);
    setAlertaTipo(type);
    setOpenAlert(true);
  };


  const ativaGrupo = (id)=>{ 
    TrocarGrupo(id)
    TrocarContexto("grupo")
    navigate("/home")
  }

  
  
  useEffect(() => {
    async function fetch() {
      try {
        const res = await api.get("/card-grupo");
        setGrupos(res.data)
      } catch (error) {
        console.log(error);
        
      }

    }
    fetch()
  }, [reload]);

  useEffect(() => {
    if (selectedGrupo) {
      setOpenEdit(true)
      
    }
    
  }, [selectedGrupo]);

    async function deleteGroup(id) {
      setLoading(id)
      try {
        const Res = await api.delete("/delete-grupo",{data:{id}})
        setReload((prev=> !prev))
        showAlerta("Grupo Deletado", "success")
        
      } catch (error) {
        let localError =
         error.response?.data?.error || "erro ao Deletar";
         showAlerta(localError, "error");
      
     }finally{
       setLoading(false)
     }
     
    }

    async function sairGroup(id) {
      setLoading(id)
      try {
        const Res = await api.delete("/sair-grupo",{data:{id}})
        setReload((prev=> !prev))
        showAlerta("Voce saiu do grupo", "success");
        
      } catch (error) {
        let localError =
         error.response?.data?.error || "erro ao Sair";
         showAlerta(localError, "error");
      
     }finally{
       setLoading(false)
     }
     
    }

    async function removerUser(id, idGroup) {
      setLoading(id)
      try {
        const Res = await api.delete("/remover-user-grupo",{data:{id, idGroup}})
        setReload((prev=> !prev))
        showAlerta("Membro removido", "success");
        
      } catch (error) {
        let localError =
         error.response?.data?.error || "Erro ao remover usuario";
         showAlerta(localError, "error");
      
     }finally{
       setLoading(false)
     }
     
    }
    
    const copiar = async () => {
    try {
      await navigator.clipboard.writeText(code);
      showAlerta("Codigo copiado", 'success')
    } catch (error) {
      console.log(error)
      showAlerta('Nao foi possivel Copiar o codigo', 'error')
    }
  }; 
  
  async function handleRole(id , idGroup, permissao) {
    
    try {
      const Res = await api.put("/atualizar-permissao", {id, idGroup, permissao})
      setReload((prev=> !prev))
      showAlerta("Permissão atualizada", "success")
    } catch (error) {
      console.log(error)
      showAlerta('Nao foi possivel Atualizar a permissão', 'error')
      setReload((prev=> !prev))
      
    }
    
  }

  return (
    <Box className="container1">
      <Box className="menu">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <KeyboardArrowLeftIcon
            onClick={() => navigate("/home")}
            sx={{
              margin: "10px",
              borderRadius: "5px",
              ":hover": { backgroundColor: "#4a55683a" },
            }}
          />
          <Box sx={{ fontSize: { sm: "16px", xs: "x-small" } }}>
            <h2>Gerenciamento de Grupos</h2>
            <p>Crie e gerencie seus grupos </p>
          </Box>
        </Box>
        <Button
          size="small"
          variant="contained"
          onClick={() => setOpenCreate(true)}
          sx={{
            textTransform: "none",
            marginRight: { xs: "0px", sm: "40px" },
            borderRadius: "7px",
            border: "solid 1px #4a556849",
            color: "white",
            backgroundColor: "#4A5568",
          }}
        >
          <AddCircleOutlineIcon />
          Entrar/ Criar grupo
        </Button>
      </Box>

      <ModalGrupo
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        funcao={"criar"}
        onUpdated={() => setReload((prev) => !prev)}
        alerta={(msg, tipo) => showAlerta(msg, tipo)}
      />
      <ModalGrupo
        open={openEdit}
        onClose={() => {
          (setOpenEdit(false), setSelectedGrupo(false));
        }}
        funcao={"editar"}
        idGroup={selectedGrupo}
        onUpdated={() => {
          setReload((prev) => !prev);
        }}
        alerta={(msg, tipo) => showAlerta(msg, tipo)}
      />

      {grupos.length === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#F4F7FA",
            alignItems: "center",
            padding: "20px",
            margin: "40px",
            textAlign: "center",
            borderRadius: "15px",
            boxShadow:
              "0 4px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h4> Você ainda não participa de nenhum grupo.</h4>
          <GroupOffIcon sx={{ fontSize: 150 }} />
        </Box>
      )}

      <Box
        sx={{
          maxWidth: "1600px",
          justifyContent: "center",

          padding: "20px ",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {grupos.map((item) => (
          <Box
            key={item.grupo.id}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              padding: "10px",
              margin: "10px  ",
              width: {xs:"350px",sm:"400px"},
              height: "250px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow:
                "0 4px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", gap: "10px" }}>
                <GroupsIcon /> <h4>{item.grupo.nome}</h4>
              </Box>

              <Box sx={{ display: "flex", gap: "15px" }}>
                {item.perfil === "Admin" && (
                  <>
                    {" "}
                    <EditIcon
                      fontSize="small"
                      onClick={() => {
                        setSelectedGrupo(item.grupo.id);
                      }}
                      sx={{
                        borderRadius: "5px",
                        ":hover": { backgroundColor: "#4a55683a" },
                      }}
                    />
                    <DeleteIcon
                      color="error"
                      fontSize="small"
                      onClick={() => {
                        (setSelectedId(item.grupo.id), setOpenDelete(true));
                      }}
                      sx={{
                        borderRadius: "5px",
                        ":hover": { backgroundColor: "#4a55683a" },
                      }}
                    />
                  </>
                )}
              </Box>
            </Box>
            <Box sx={{ padding: "0px", height: "150px", overflow: "auto" }}>
              <span>{item.grupo.descricao || "descricao do grupo..."}</span>
            </Box>
            <Box>
              <h5>membros:</h5>
              <Box sx={{ display: "flex", gap: "5px", paddingTop: "5px" }}>
                {item.grupo.membros.slice(0, 5).map((item) => (
                  <Avatar
                    key={item["usuarios"].avatar}
                    sx={{
                      width: "35px",
                      height: "35px",
                      border: "solid 2px #4A5568",
                    }}
                    src={
                      item["usuarios"].avatar ? item["usuarios"].avatar : " "
                    }
                  >
                    {item["usuarios"].avatar
                      ? ""
                      : item["usuarios"].nome.split(" ")[0][0].toUpperCase() +
                        item["usuarios"].nome.split(" ")[1][0]?.toUpperCase()}
                  </Avatar>
                ))}
                {item.grupo.membros.length > 5 && (
                  <Avatar
                    sx={{
                      width: "35px",
                      height: "35px",
                      border: "solid 2px #4A5568",
                    }}
                  >
                    +{item.grupo.membros.length - 5}
                  </Avatar>
                )}
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: "12px" }}>
              <SubmitButton
                onClick={() => {
                  ativaGrupo(item.grupo.id);
                }}
                variant="outlined"
                sx={{
                  flex: "1",
                  bgcolor: "transparent",
                  color: "#4A5568",
                  border: "solid 1px #4A5568",
                }}
              >
                Ativar Grupo
              </SubmitButton>
              {item.perfil === "Admin" ? (
                <SubmitButton
                  onClick={() => {
                    (setOpenCode(true), setCode(item.grupo.id));
                  }}
                  sx={{ flex: "1" }}
                >
                  {loading === item.grupo.id ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    "Adicionar Membro"
                  )}
                </SubmitButton>
              ) : (
                <SubmitButton
                  onClick={() => {
                    (setSelectedId(item.grupo.id), setOpenExit(true));
                  }}
                  sx={{
                    flex: "1",
                    ":hover": { backgroundColor: "#ff00009d" },
                  }}
                >
                  {loading === item.grupo.id ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    "Sair do grupo"
                  )}
                </SubmitButton>
              )}
            </Box>
          </Box>
        ))}
        <Dialog open={openCode} onClose={() => setOpenCode(false)}>
          <DialogTitle>Codigo do grupo</DialogTitle>

          <DialogContent>
            <DialogContentText>
              Aqui está o código do seu grupo! <br />
              Envie para os outros membros para que eles possam entrar.
            </DialogContentText>
            <h3
              style={{
                textAlign: "center",
                margin: "10px",
                border: "solid 1px",
              }}
            >
              {code}
            </h3>
          </DialogContent>
          <DialogActions>
            <IconButton size="large" onClick={copiar}>
              <ContentCopyRoundedIcon />
            </IconButton>
            <Button
              sx={{
                backgroundColor: "#4A5568",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
              onClick={() => setOpenCode(false)}
            >
              voltar
            </Button>
          </DialogActions>
        </Dialog>
        <BoxDialog
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          titulo={"Deletar grupo"}
          mensagem={
            "Atenção! Todas as informações ligadas ao grupo (Transações, Categorias) serão excluídas permanentemente."
          }
          onConfirm={() => deleteGroup(selectedId)}
        />

        <BoxDialog
          open={openExit}
          onClose={() => setOpenExit(false)}
          titulo={"Deseja sair do Grupo?"}
          mensagem={
            "Atenção! ao sair voce perdera acesso a todas as informações do grupo."
          }
          onConfirm={() => sairGroup(selectedId)}
        />

        <BoxAlerta
          open={openAlert}
          duration={5000}
          type={alertaTipo}
          mensagem={alertaMensagem}
          onClose={() => setOpenAlert(false)}
        />
      </Box>

      <Box
        sx={{
          width: "100vw",
          height: "100%",
          padding: "20px ",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        {grupos.map((item) => (
          <Box
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              padding: "10px",

              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow:
                "0 4px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box sx={{ display: "flex", gap: "10px" }}>
              <GroupsIcon /> <h4>{item.grupo.nome}</h4>
            </Box>
            <p>Gerencie os membros e suas permissões neste grupo</p>

            <TableContainer sx={{ marginTop: "20px" }}>
              <Table size="small">
                <TableHead
                  sx={{
                    "& .MuiTableCell-head": {
                      fontWeight: 700,
                    },
                  }}
                >
                  <TableRow hover>
                    <TableCell>Membro</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Permissão</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {item.grupo.membros.map((membros) => (
                    <TableRow  hover>
                      <TableCell >
                        <Box
                          sx={{
                            display: "flex",
                            gap: "15px",
                            alignItems: "center",
                          }}
                        >
                          <Avatar
                            sx={{
                              width: "35px",
                              height: "35px",
                              border: "solid 2px #4A5568",
                            }}
                            src={membros.usuarios.avatar}
                          >
                            {membros.usuarios.avatar
                              ? ""
                              : membros.usuarios.nome.split(" ")[0][0].toUpperCase() +
                                membros.usuarios.nome.split(" ")[1][0]?.toUpperCase()}
                          </Avatar>
                          <p>{membros.usuarios.nome}</p>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <p>{membros.usuarios.email}</p>
                      </TableCell>

                      <TableCell>
                        <Select
                          fullWidth
                          disabled={item.perfil === "membro"}
                          size="small"
                          value={membros.perfil}
                          onChange={(e) => {
                            const novaRole = e.target.value;

                            handleRole(
                              membros.usuarios.id,
                              item.grupo.id,
                              novaRole,
                            );
                          }}
                        >
                          <MenuItem value="Admin">Admin</MenuItem>
                          <MenuItem value="membro">Membro</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          disabled={item.perfil === "membro"}
                          sx={{ cursor: "pointer" }}
                          color="error"
                          onClick={() =>
                            removerUser(membros.usuarios.id, item.grupo.id)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
export default GestaoGrupo;
