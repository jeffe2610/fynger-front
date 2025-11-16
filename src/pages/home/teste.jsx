import { GraficoPizza, GraficoLinha, CardUser, Modal, MiniCard, ModalConfig,} from "../../components/graficos"
import{ useEffect, useState } from 'react';
import api from "../../services/api";







function Teste() {

  
  return(
    <div className="container" style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        
      }}>
      
      <ModalConfig/>
      <h1  >div de teste </h1>
      <button >botão teste </button>
      
    
    </div>
  )

}

export default Teste