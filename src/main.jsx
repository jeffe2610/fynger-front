import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import Login from './pages/login/Login';
import Cadastro from './pages/cadastro/Cadastro';
import Home from './pages/home/Home';
import Teste from './pages/home/teste'
import PrivateRoute from './components/privateRoutes';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path='/home' element= {<Home />}  />
        <Route path='/teste' element={<Teste />} />
        </Routes>
    </BrowserRouter>
  </StrictMode>,
);
