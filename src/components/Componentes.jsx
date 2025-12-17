import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";
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
  CircularProgress,
  Tab,
  Tabs,
  Box,
  styled,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import "./components.css";
import Avatar from "@mui/material/Avatar";
import api from "../services/api";
import { format } from "date-fns";
import { formatarMoeda } from "../utils/formatarMoeda";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';

// Paleta de cores
const COLORS = ["#2A8CFF", "#9dd3df", "#61DFF0", "#3b3737", "#4A5568"];

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: "#CBD6E0",
  borderRadius: "50px",
  minHeight: 40,
  marginTop: 40,
  width: "100%",
  overflowX: "hidden",
  "& .MuiTabs-flexContainer": {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    padding: theme.spacing(0.5),
  },
  "& .MuiTabs-indicator": {
    display: "none",
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  textTransform: "none",
  minHeight: 36,
  padding: "2px",
  borderRadius: 50,
  backgroundColor: "transparent",
  color: theme.palette.text.primary,
  "&.Mui-selected": {
    backgroundColor: '#4A5568',
    color: theme.palette.common.white,
  },
  "&:hover": {
    backgroundColor: '#4a556894',
  },
}));

export const SubmitButton = styled(Button)({
  backgroundColor: '#4A5568',
  color: "white",
  borderRadius: "10px",
  height: "40px",
  width: "100%",
  cursor: "pointer",
  margin: "15px 0px 15px 0px",
  "&:hover": {
    backgroundColor: '#4a556877',
  },
});

export function BoxDialog({ open, onClose, titulo, mensagem, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{titulo}</DialogTitle>

      <DialogContent>
        <DialogContentText>{mensagem}</DialogContentText>
      </DialogContent>

      <DialogActions>
        
        {onConfirm && (

        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Confirmar
        </Button>
        )}

        <Button onClick={onClose} autoFocus>
          voltar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function BoxAlerta({ open, duration, onClose, type, mensagem }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      
    >
      <Alert onClose={onClose} severity={type} sx={{ width: "100%" }}>
        {mensagem}
      </Alert>
    </Snackbar>
  );
}

export function GraficoPizza({ dados, titulo }) {
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
      <h1 style={{  fontSize: "1.2rem" }}>{titulo}</h1>

      <div style={{ width: "100%", height: "250px" }}>
        {!dados ||
          (dados.length === 0 && (
            <Box
              sx={{
                color: "grey",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h2>Sem Dados para exibir</h2>
            </Box>
          ))}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dados}
              dataKey="valor"
              nameKey="categoria"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              label={(entry) => `R$ ${entry.valor.toFixed(2)}`}
            >
              {dados.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}

                />
              ))}
            </Pie>
            <Tooltip  formatter={(value) => `R$ ${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function GraficoLinha({ titulo, reload }) {
  const [dados, setDados] = useState([]);
  useEffect(() => {
    async function fetch() {
      try {
        const res = await api.get("/card-receita");
        if (res.data) {
          setDados(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  }, [reload]);

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
      <h1 style={{ fontSize: "1.2rem" }}>{titulo}</h1>

      <div style={{ width: "100%", height: "250px", fontWeight: "bold" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dados} margin={{ bottom: 30, right: 40, left: 40 }}>
            <CartesianGrid strokeDasharray="8 8" />
            <XAxis dataKey="mes" interval={0} dy={5} tick={{ fontSize: 12 }} />
            <YAxis width="auto" />
            <Tooltip />
            <Legend />
            <Line
              name="Despesas"
              type="monotone"
              dataKey="total_despesas"
              stroke="#922929fd"
              activeDot={{ r: 8 }}
            />
            <Line
              name="Receitas"
              type="monotone"
              dataKey="total_receitas"
              stroke="#2e5a34ff"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TabelaTransacoes({ dados }) {
  return (
    <TableContainer
      sx={{
        maxHeight: "400px",
        overflowY: "auto",
        borderRadius: 2,
      }}
    >
      <Table size="medium" stickyHeader>
        <TableHead sx={{ backgroundColor: "transparent" }}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold", backgroundColor: "#CBD6E0" }}
            >
              Nome
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", backgroundColor:"#CBD6E0" }}
            >
              Categoria
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", backgroundColor: "#CBD6E0" }}
            >
              Membro
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", backgroundColor: "#CBD6E0" }}
            >
              Data
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", backgroundColor: "#CBD6E0" }}
            >
              Valor
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {dados.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.nome}</TableCell>
              <TableCell>{item.categoria}</TableCell>
              <TableCell>{item.membro}</TableCell>
              <TableCell>{format(item.data, "dd/MM/yyyy")}</TableCell>
              {item.tipo === "receita" ? (
                <TableCell
                  sx={{ color: "green", fontWeight: "bold" }}
                >{`+${formatarMoeda((item.valor))}`}</TableCell>
              ) : (
                <TableCell
                  sx={{ color: "red", fontWeight: "bold" }}
                >{`${formatarMoeda(item.valor)}`}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!dados ||
        (dados.length === 0 && (
          <Box
            sx={{
              color: "grey",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10%",
            }}
          >
            <h2>Sem Dados para exibir</h2>
          </Box>
        ))}
    </TableContainer>
  );
}

export function CardUser(reload) {
  const [membros, setMembros] = useState([]);

  useEffect(() => {
    async function fetchuser() {
      try {
        const res = await api.get("/grupo");
        if (res.data) {
          setMembros(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchuser();
  }, [reload]);

  return membros.map((item) => (
    <div className="principal">
      <Avatar
        id="avatar"
        src={item.avatar ? `${item.avatar}?t=${Date.now()}` : " "}
      >
        {item.avatar
          ? ""
          : item.nome.split(" ")[0][0].toUpperCase() +
            item.nome.split(" ")[1][0]?.toUpperCase()}
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
  ));
}

export function Modal({ onClose, reload, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [parcelas, setParcelas] = useState(0);
  const [data, setData] = useState("");
  const [pagamento, setPagamento] = useState("");
  const [tipo, setTipo] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [category, setCategory] = useState([]);
  const [categoriaselecionada, setCategoriaSelecionada] = useState("");
  const [open, setOpen] = useState(false);
  const [alertaMensagem, setAlertaMensagem] = useState("");
  const [alertaTipo, setAlertaTipo] = useState("");
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await api.get("/categorias");
        if (res.data) setCategory(res.data);
      } catch (erro) {
        console.log(erro);
      }
    }

    fetchCategorias();
  }, [reload]);

  async function handleregister(e) {
    setLoading(true);
    e.preventDefault();

    try {
      if (!categoriaselecionada)
        return (
          setAlertaMensagem("selecione uma categoria"),
          setAlertaTipo("error"),
          setOpen(true)
        );
      const Res = await api.post("/transacao", {
        nome,
        valor,
        descricao,
        categoriaselecionada,
        parcelas,
        data,
        vencimento,
        tipo,
      });
      onUpdated();
      setAlertaMensagem("Transação registrada com sucesso");
      setAlertaTipo("success");
      setOpen(true);
    } catch (error) {
      let localError =
        error.response?.data?.error || "Erro ao registrar Transação";
      setAlertaMensagem(localError);
      setAlertaTipo("error");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overlay">
      <div className="form-trans">
        <div className="scroll-area">
          <form onSubmit={handleregister}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <h3>Nova transferencia</h3>
              <IconButton size="small" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <FormControl fullWidth margin="normal">
              <FormLabel>Tipo de transação</FormLabel>
              <RadioGroup
                row
                value={tipo}
                onChange={(e) => {
                  const value = e.target.value;
                  setTipo(value);
                  if (value === "receita") {
                    setParcelas(1);
                  }
                }}
              >
                <FormControlLabel
                  value="despesa"
                  control={<Radio />}
                  label="Despesa"
                />
                <FormControlLabel
                  required
                  value="receita"
                  control={<Radio />}
                  label="Receita"
                />
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              label="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              variant="outlined"
              disabled={!tipo}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              type="number"
              label="Valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              variant="outlined"
              disabled={!tipo}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              label="Descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              variant="outlined"
              disabled={!tipo}
              
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="categoria-label">Categorias</InputLabel>
              <Select
                labelId="categoria-label"
                id="categorias"
                value={categoriaselecionada}
                onChange={(e) => setCategoriaSelecionada(e.target.value)}
                disabled={!tipo}
              >
                <MenuItem value="">
                  <em>Selecione</em>
                </MenuItem>
                {category
                  .filter((item) => item.tipo === tipo)
                  .map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nome}
                    </MenuItem>
                  ))}
              </Select>
              {category.length === 0 && (
                <span>
                  Crie categorias em ajustes para registrar transações
                </span>
              )}

              {tipo === "despesa" && (
                <>
                  <FormLabel sx={{ marginTop: "20px" }}>
                    Forma de pagamento
                  </FormLabel>
                  <RadioGroup
                    row
                    value={pagamento}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPagamento(value);
                      if (value === "avista") {
                        setParcelas(1);
                      }
                    }}
                  >
                    <FormControlLabel
                      value="avista"
                      control={<Radio />}
                      label="À vista"
                    />
                    <FormControlLabel
                      value="parcelado"
                      control={<Radio />}
                      label="Parcelado"
                    />
                  </RadioGroup>
                </>
              )}
            </FormControl>

            {pagamento === "parcelado" && tipo === "despesa" && (
              <div>
                <TextField
                  required
                  label="quantidade de parcelas"
                  type="number"
                  variant="outlined"
                  value={parcelas}
                  onChange={(e) => setParcelas(e.target.value)}
                />

                <TextField
                  required
                  label="1º vencimento"
                  type="date"
                  variant="filled"
                  value={vencimento}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setVencimento(e.target.value)}
                />
              </div>
            )}

            <TextField
              fullWidth
              required
              label="Data"
              type="date"
              variant="filled"
              margin="normal"
              value={data}
              onChange={(e) => {
                const value = e.target.value;
                setData(value);
                if (pagamento === "avista") {
                  setVencimento(value);
                }
                if (tipo === "receita") {
                  setVencimento(value);
                }
              }}
              InputLabelProps={{ shrink: true }}
              disabled={!tipo}
            />

            <SubmitButton  type="submit" disabled={loading}>
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Registrar"
              )}
            </SubmitButton>

            <BoxAlerta
              open={open}
              onClose={() => setOpen(false)}
              type={alertaTipo}
              duration={5000}
              mensagem={alertaMensagem}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export function MiniCard({ titulo, valor = 0, valorAnterior = 0 }) {
  const diferenca = valorAnterior
    ? ((valor - valorAnterior) / valorAnterior) * 100
    : 0;
  const positivo = diferenca > 0;

  return (
    <div>
      <span>{titulo}</span>
      <h2>{formatarMoeda(valor)}</h2>

      <p
        style={{
          color: positivo ? "#2e5a34ff" : diferenca < 0 ? "#922929fd" : "gray",
          fontWeight: "bold",
        }}
      >
        {valorAnterior
          ? `${diferenca.toFixed(2)}% ${
              positivo ? "Maior" : "Menor"
            } vs mês anterior`
          : "Sem comparação com mês anterior"}
      </p>
    </div>
  );
}

export function ModalConfig({ onClose, reload, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [nome, setNome] = useState();
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [nomeGrupo, setNomeGrupo] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [tipoCategoria, setTipoCategoria] = useState("");
  const [descGrupo, setDescGrupo] = useState("");
  const [membros, setMembros] = useState([]);
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [transacoes, setTransacoes] = useState([]);
  const [avatar, setAvatar] = useState("");
  const [openTrans, setOpenTrans] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openGrupo, setOpenGrupo] = useState(false);
  const [alertaMensagem, setAlertaMensagem] = useState("");
  const [alertaTipo, setAlertaTipo] = useState("");
  const [ grupoId, setGrupoId] = useState("")

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const showAlerta = (msg, type ) => {
    setAlertaMensagem(msg);
    setAlertaTipo(type);
    console.log(type)
    console.log(alertaTipo)
    setOpenAlert(true);
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(grupoId);
      showAlerta("Codigo copiado", 'success')
    } catch (error) {
      console.log(error)
      showAlerta('Nao foi possivel Copiar o codigo', 'error')
    }
  };
  useEffect(() => {
    async function fetch() {
      try {
        const res = await api.get("/atualizar-dados");
        if (res.data) {
          setNome(res.data.nome);
          setEmail(res.data.email);
          setTelefone(res.data.telefone);
          setNomeGrupo(res.data.nomeGrupo);
          setMembros(res.data.membros);
          setCategorias(res.data.categorias);
          setAvatar(res.data.avatar);
          setGrupoId(res.data.grupo_id)
        }
      } catch (error) {
        console.log(error);
      }
    }
    async function fetchTransacoes() {
      try {
        const res = await api.get("/transacao");
        if (res.data) {
          setTransacoes(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
    fetchTransacoes();
  }, [reload]);

  async function handleupdatePerfil(e) {
    setLoading(true);
    e.preventDefault();

    try {
      const Res = await api.put("/atualizar-perfil ", {
        nome,
        email,
        telefone,
        senha,
        novaSenha,
      });
      onUpdated();
      showAlerta("perfil Atualizado!", "success");
    } catch (error) {
      let localError =
        error.response?.data?.error || "erro ao registrar atualização";
      
        showAlerta(localError, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleupdateAvatar(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const Res = await api.put("/atualiza-avatar", formData);
      showAlerta("Foto de perfil Atualizada!", "success");
      onUpdated();
    } catch (error) {
      let localError =
        error.response?.data?.error || "erro ao registrar atualização";
      showAlerta(localError, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleupdategrupo(e) {
    setLoading(true);
    e.preventDefault();

    try {
      const Res = await api.put("/atualizar-grupo", { nomeGrupo });
      showAlerta("Grupo Atualizado!", "success");
      onUpdated();
    } catch (error) {
      let localError =
        error.response?.data?.error || "erro ao registrar atualização";
      showAlerta(localError, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddcategoria(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/add-categoria", { nomeCategoria, tipoCategoria });
      showAlerta("Categoria adicionada!", "success");
      onUpdated();
    } catch (error) {
      let localError =
        error.response?.data?.error || "erro ao registrar categoria";
      showAlerta(localError, "error");
    } finally {
      setLoading(false);
    }
  }

  async function DeleteCategoria(id) {
    setLoadingId(id);

    try {
      await api.delete("/del-categoria", {
        data: { id },
      });
      onUpdated();
      showAlerta("Categoria deletada com sucesso", "success");
    } catch (error) {
      let localError = error.message || "erro ao deletar";
      showAlerta(localError, "error");
      console.log(localError);
    } finally {
      setLoadingId(null);
    }
  }

  async function DeleteTransacao(id) {
    setLoadingId(id);

    try {
      await api.delete("/del-transacao", {
        data: { id },
      });
      onUpdated();
      showAlerta("Transação Deletada!", "success");
    } catch (error) {
      let localError = error.response?.data?.error || "Erro ao deletar";
      showAlerta(localError, "error");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="overlay">
      <div className="form-trans">
        <div className="scroll-area">
          <Box width="100%" p={1} display={"flex"} flexDirection={"column"}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <h1>Configurações </h1>
              <IconButton size="small" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <span>Gerencie seu perfil, Grupo, Categorias e trasacoes. </span>

            <StyledTabs
              value={tabValue}
              onChange={handleChange}
              sx={{
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <StyledTab label="Perfil" />
              <StyledTab label="Grupo" />
              <StyledTab label="Categoria" />
              <StyledTab label="Transações" />
            </StyledTabs>

            <Box mt={2}>
              {tabValue === 0 && (
                <Box maxWidth={"600px"}>
                  <Box border={"solid 1px grey"} borderRadius={5} padding={2}>
                    <form onSubmit={handleupdatePerfil}>
                      <h3>informaçoes pessoais</h3>
                      <p>atualize suas informações pessoais</p>
                      <div className="foto-perfil" id="inputFoto">
                        <Avatar
                          src={`${avatar}?t=${Date.now()}`}
                          sx={{ width: "100px", height: "100px" }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          name="avatar"
                          id="foto"
                          style={{ display: "none" }}
                          onChange={handleupdateAvatar}
                        />
                        <label htmlFor="foto" className="botao-upload">
                          Alterar foto
                        </label>
                      </div>

                      <TextField
                        fullWidth
                        margin="normal"
                        label="Nome"
                        variant="outlined"
                        size="small"
                        type="text"
                        value={nome}
        
                        onChange={(e) => setNome(e.target.value)}
                      />

                      <TextField
                        fullWidth
                        margin="normal"
                        label="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                        size="small"
                        type="email"
                        disabled
                      />

                      <TextField
                        fullWidth
                        margin="normal"
                        label="Telefone"
                        variant="outlined"
                        size="small"
                        type="tel"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                      />

                      <hr />

                      <TextField
                        fullWidth
                        margin="normal"
                        label="Senha Atual"
                        variant="outlined"
                        size="small"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                      />

                      <TextField
                        fullWidth
                        margin="normal"
                        label="Nova Senha"
                        variant="outlined"
                        size="small"
                        type="password"
                        value={novaSenha}
                        disabled={!senha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                      />

                      <SubmitButton type="submit">
                        {loading ? (
                          <CircularProgress size={22} color="inherit" />
                        ) : (
                          "Salvar Atualização"
                        )}
                      </SubmitButton>
                    </form>
                  </Box>
                </Box>
              )}
              {tabValue === 1 && (
                <Box maxWidth={"600px"}>
                  <Box
                    border={"solid 1px grey"}
                    borderRadius={5}
                    padding={2}
                    marginBottom={2}
                  >
                    <h3>Informacoes do grupo</h3>
                    <p>Configure o nome e descriação do Grupo/Familia</p>

                    <TextField
                      fullWidth
                      margin="normal"
                      label="Nome do grupo"
                      variant="outlined"
                      type="text"
                      size="small"
                      value={nomeGrupo}
                      onChange={(e) => setNomeGrupo(e.target.value)}
                    />

                    <TextField
                      fullWidth
                      margin="normal"
                      label="Descrição"
                      variant="outlined"
                      type="text"
                      size="small"
                      value={descGrupo}
                      onChange={(e) => setDescGrupo(e.target.value)}
                    />

                    <SubmitButton onClick={handleupdategrupo}>
                      {loading ? (
                        <CircularProgress size={22} color="inherit" />
                      ) : (
                        "Salvar Atualização"
                      )}
                    </SubmitButton>
                  </Box>
                  <Box
                    border={"solid 1px grey"}
                    borderRadius={5}
                    padding={2}
                    marginBottom={2}
                  >
                    <h3>Membros do grupo</h3>
                    <p>Gerencie os membros do seu Grupo/Familia</p>

                    {membros.map((item) => (
                      <Box
                        border={"solid 1px"}
                        padding={"5px"}
                        display={"flex"}
                        gap={"10px"}
                        justifyContent={"space-between"}
                        margin={"10px"}
                        borderRadius={"10px"}
                      >
                        <Box
                          display={"flex"}
                          gap={"10px"}
                          alignItems={"center"}
                        >
                          <Avatar
                            src={`${item.avatar}?t=${Date.now()}`}
                            sx={{ width: "60px", height: "60px" }}
                          />
                          <Box>
                            <p>{item.nome}</p>
                            <h6>{item.email}</h6>
                          </Box>
                        </Box>
                        <IconButton color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}

                    <SubmitButton onClick={()=>setOpenGrupo(true)}> Convidar Novo Membro</SubmitButton>
                  </Box>

                     <Dialog open={openGrupo} onClose={()=>setOpenGrupo(false)}>
                        <DialogTitle>Codigo do grupo</DialogTitle>

                        <DialogContent>
                          <DialogContentText>Aqui está o código do seu grupo! <br/>
                           Envie para os outros membros para que eles possam entrar. 
                           <TextField fullWidth
                           margin="normal"
                           variant="filled"
                           
                           value={grupoId}
                           label="codigo do grupo"
                           size="small"
                           />
                           </DialogContentText>

                        </DialogContent>
                        <DialogActions>
                          <IconButton size="large" onClick={copiar}> 
                            <ContentCopyRoundedIcon/>
                          </IconButton>
                          <Button onClick={()=>setOpenGrupo(false)}>voltar</Button>
                          
                        </DialogActions>
                      </Dialog>

                </Box>
              )}
              {tabValue === 2 && (
                <Box maxWidth={"600px"}>
                  <Box
                    border={"solid 1px grey"}
                    borderRadius={5}
                    padding={2}
                    marginBottom={2}
                  >
                    <h3>Adcionar Nova Categoria</h3>
                    <p>
                      Crie Categorias personalizadas para organizar suas
                      transacoes
                    </p>
                    <form onSubmit={handleAddcategoria}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: "5px",
                          alignItems: "center",
                          padding: "15px",
                        }}
                      >
                        <TextField
                          margin="normal"
                          required
                          label="Nome da categoria"
                          type="text"
                          size="small"
                          variant="outlined"
                          value={nomeCategoria}
                          onChange={(e) => setNomeCategoria(e.target.value)}
                        />

                        <FormControl
                          required
                          sx={{ width: "150px" }}
                          margin="normal"
                          size="small"
                        >
                          <InputLabel id="categoria-label">
                            Categorias
                          </InputLabel>
                          <Select
                            required
                            labelId="categoria-label"
                            id="categorias"
                            sx={{backgroundColor:"#CBD6E0"}}
                            value={tipoCategoria}
                            onChange={(e) => setTipoCategoria(e.target.value)}
                          >
                            <MenuItem value="">
                              <em>Selecione</em>
                            </MenuItem>
                            <MenuItem value="despesa">Despesa</MenuItem>
                            <MenuItem value="receita">Receita</MenuItem>
                          </Select>
                        </FormControl>

                        <IconButton 
                         type="submit"
                          sx={{
                            marginTop: "7px",
                            backgroundColor: '#4A5568',
                            color: "#fff",
                            fontWeight: "bold",
                            height: "100%",
                            overflow: "hidden",
                          }}
                          disabled={loading}>
                            {loading ? (
                            <CircularProgress
                              size={22}
                              color="inherit
                            "
                            />
                          ) : (
                            <AddCircleOutlineIcon/>
                          )}
                          
                        </IconButton>
                        
                      </Box>
                    </form>
                  </Box>
                  <Box
                    border={"solid 1px grey"}
                    borderRadius={5}
                    padding={2}
                    marginBottom={2}
                  >
                    <h3>Categorias de Despesas</h3>
                    <Box
                      display={"flex"}
                      flexWrap={"wrap"}
                      gap={"15px"}
                      padding={"15px"}
                    >
                      {categorias.map(
                        (item) =>
                          item.tipo === "despesa" && (
                            <Box className="pill-categoria"  backgroundColor="#CBD6E0">
                              <p>{item.nome}</p>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  setOpen(true);
                                  setSelectedId(item.id);
                                }}
                              >
                                {loadingId === item.id ? (
                                  <CircularProgress size={22} color="inherit" />
                                ) : (
                                  <DeleteIcon />
                                )}
                              </IconButton>
                            </Box>
                          )
                      )}
                    </Box>
                  </Box>
                  <BoxDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    titulo="Deseja deletar a categoria?"
                    mensagem="Atenção! Todas as transações relacionadas também serão excluídas."
                    onConfirm={() => DeleteCategoria(selectedId)}
                  />
                  <Box
                    border={"solid 1px grey"}
                    borderRadius={5}
                    padding={2}
                    marginBottom={2}
                  >
                    <h3>Categoria de Receitas</h3>
                    <Box
                      display={"flex"}
                      flexWrap={"wrap"}
                      gap={"15px"}
                      padding={"15px"}
                    >
                      {categorias.map(
                        (item) =>
                          item.tipo === "receita" && (
                            <Box key={item.id}  backgroundColor="#CBD6E0" className="pill-categoria">
                              <p>{item.nome}</p>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  setOpen(true);
                                  setSelectedId(item.id);
                                }}
                              >
                                {loadingId === item.id ? (
                                  <CircularProgress size={22} color="inherit" />
                                ) : (
                                  <DeleteIcon />
                                )}
                              </IconButton>
                            </Box>
                          )
                      )}
                    </Box>
                  </Box>
                  <BoxDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    titulo="Deseja deletar a categoria?"
                    mensagem="Atenção! Todas as transações relacionadas também serão excluídas."
                    onConfirm={() => DeleteCategoria(selectedId)}
                  />
                </Box>
              )}

              {tabValue === 3 && (
                <Box
                  maxWidth={"600px"}
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                >
                  <div className="box-tabela">
                    <Box border={"solid 1px grey"} borderRadius={5} padding={1}>
                      <h3>Gerencie suas transações</h3>
                      <p>visualize edite ou exclua suas transações</p>

                      <TableContainer
                        sx={{
                          maxHeight: "400px", // limite de altura
                          overflowY: "auto", // rolagem vertical
                          borderRadius: 2,
                          padding: "15px", // bordas arredondadas
                        }}
                      >
                        <Table
                          size="small"
                          stickyHeader
                          sx={{
                            tableLayout: "auto",
                            width: "max-content",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <TableHead sx={{ backgroundColor: "transparent" }}>
                            <TableRow>
                              <TableCell
                                sx={{
                                  fontWeight: "bold",
                                  backgroundColor: "#CBD6E0",
                                }}
                              >
                                Nome
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: "bold",
                                  backgroundColor: "#CBD6E0",
                                }}
                              >
                                Categoria
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: "bold",
                                  backgroundColor: "#CBD6E0",
                                }}
                              >
                                Membro
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: "bold",
                                  backgroundColor: "#CBD6E0",
                                }}
                              >
                                Data
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: "bold",
                                  backgroundColor: "#CBD6E0",
                                }}
                              >
                                Valor
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: "bold",
                                  backgroundColor: "#CBD6E0",
                                }}
                              >
                                Acoes
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {transacoes.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.nome}</TableCell>
                                <TableCell>{item.categoria}</TableCell>
                                <TableCell>{item.membro}</TableCell>
                                <TableCell>
                                  {format(item.data, "dd/MM/yyyy")}
                                </TableCell>
                                <TableCell>
                                  {formatarMoeda(item.valor)}
                                </TableCell>
                                <TableCell>
                                  {
                                    <Box display={"flex"}>
                                      <IconButton
                                        size="small"
                                        onClick={() => {
                                          setSelectedId(item.id);
                                          setOpenTrans(true);
                                        }}
                                      >
                                        {loadingId === item.id ? (
                                          <CircularProgress
                                            size={22}
                                            color="inherit"
                                          />
                                        ) : (
                                          <DeleteIcon />
                                        )}
                                      </IconButton>
                                    </Box>
                                  }
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </div>
                  <BoxDialog
                    open={openTrans}
                    onClose={() => setOpenTrans(false)}
                    titulo="Deseja deletar a Transação?"
                    mensagem="Atenção! Todas as informações serao excluídas permanentemente."
                    onConfirm={() => DeleteTransacao(selectedId)}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </div>
      </div>

      <BoxAlerta
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        duration={5000}
        mensagem={alertaMensagem}
        type={alertaTipo}
      />
    </div>
  );
}
