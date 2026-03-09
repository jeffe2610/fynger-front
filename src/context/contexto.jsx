import { useState, createContext, useEffect, useContext } from "react";

const contextoApp = createContext();

export function ContextoProvider({children}){
    const [contexto, setContexto] = useState(localStorage.getItem("contexto")|| "pessoal")
    const [atualGroup, setAtualGroup] = useState(localStorage.getItem("atualgroup")|| null)


    useEffect(() => {
    localStorage.setItem("contexto", contexto);
    localStorage.setItem("atualgroup",atualGroup)
    }, [contexto, atualGroup]);


    function TrocarContexto(novo) {
        setContexto(novo)
    }
    function TrocarGrupo(novo) {
        setAtualGroup(novo)
    }

    return( <contextoApp.Provider value={{contexto,TrocarContexto,atualGroup,TrocarGrupo}}>
        {children}
    </contextoApp.Provider>
    );
}   

export function UseContexto(){
    return useContext(contextoApp)
}