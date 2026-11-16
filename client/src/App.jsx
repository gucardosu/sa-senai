import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Proprietarios from "./components/Proprietarios.jsx";
import Veiculos from "./components/Veiculos.jsx";
import Servicos from "./components/Servicos.jsx";

export default function App() {
    const [usuario, setUsuario] = useState(null);
    const [tela, setTela] = useState("proprietarios");
    const [aviso, setAviso] = useState("");

    const sair = () => {
        sessionStorage.removeItem("token");
        setUsuario(null);
        setTela("proprietarios");
    };

    useEffect(() => {
        const expirar = () => {
            sair();
            setAviso("Sua sessão expirou. Entre novamente.");
        };
        window.addEventListener("sessao-expirada", expirar);
        return () => window.removeEventListener("sessao-expirada", expirar);
    }, []);

    return (
        <main className="container">
            {!usuario ? (
                <Login onLogin={(dados) => { setUsuario(dados); setAviso(""); }} aviso={aviso} />
            ) : (
                <>
                    <header>
                        <div><h1>Lava-car</h1><p>Bem-vindo(a), {usuario.nome}</p></div>
                        <button onClick={sair}>Sair</button>
                    </header>
                    <nav aria-label="Menu principal">
                        <button className={tela === "proprietarios" ? "ativo" : ""} onClick={() => setTela("proprietarios")}>Proprietários</button>
                        <button className={tela === "veiculos" ? "ativo" : ""} onClick={() => setTela("veiculos")}>Veículos</button>
                        <button className={tela === "servicos" ? "ativo" : ""} onClick={() => setTela("servicos")}>Serviços</button>
                    </nav>
                    {tela === "proprietarios" && <Proprietarios />}
                    {tela === "veiculos" && <Veiculos />}
                    {tela === "servicos" && <Servicos />}
                </>
            )}
        </main>
    );
}
