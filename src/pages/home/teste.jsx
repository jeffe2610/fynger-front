import { GraficoPizza, GraficoLinha, CardUser, Modal, MiniCard,} from "../../components/graficos"
import{ useEffect, useState } from 'react';
import api from "../../services/api";
import {subMonths, format} from "date-fns"






function Teste() {
  const [showModal, setShowModal]= useState(false)
  const [receitas, setReceitas] =  useState(0)
  const [despesas, setDespesas] =  useState(0)
  const mesAtual = new Date();
  const mesAnterior = subMonths(mesAtual,1)
  useEffect(()=>{
    async function fetchData() {
      try{
        const res = await api.get('/card-receita');
        if(res.data){
          
          setReceitas(res.data[0]['total_receitas'])
          setDespesas(res.data[0]['total_despesas'])
        }
      }catch(erro){console.log(erro)}
      
    }
    fetchData()
  },[])
  
  
  return(
    <div className="container" style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        
      }}>
      
      <MiniCard titulo={"receitas"} valor= {despesas} valorAnterior={20000}/>
      <h1 onClick={()=> {setShowModal(true)}} >div de teste </h1>
      <button ></button>
      {showModal && (<Modal onClose={()=> setShowModal(false)} />
    )}
    </div>
  )

}

export default Teste