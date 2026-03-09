import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LoadingInicial from "./pages/Loading/initialLoading";
import Login from "./pages/login/Login";
import Cadastro from "./pages/cadastro/Cadastro";
import Home from "./pages/home/Home";
import GestaoGrupo from "./pages/gestaoGrupo/GestaoDeGrupos";
import PrivateRoute from "./components/privateRoutes";
import { ContextoProvider } from "./context/contexto";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ContextoProvider>
        <Routes>
          <Route path="/" element={<LoadingInicial />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route 
            path="/grupos" 
              element ={
            <PrivateRoute>
              <GestaoGrupo />
            </PrivateRoute> }
          />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
        </Routes>
      </ContextoProvider>
    </BrowserRouter>
  </StrictMode>,
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}
