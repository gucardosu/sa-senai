import React, { useState } from "react";
import api, { mensagemErro } from "../services/api.js";

export default function Login({ onLogin, aviso }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    const realizarLogin = async (evento) => {
        evento.preventDefault();
        setErro("");
        setEnviando(true);

        try {
            const resposta = await api.post("/auth/login", { email, senha });
            sessionStorage.setItem("token", resposta.data.token);
            onLogin(resposta.data.usuario);
        } catch (erro) {
            setErro(mensagemErro(erro));
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="login">
            <h1>Lava-car</h1>
            <p>Controle de clientes, veículos e serviços.</p>
            <form onSubmit={realizarLogin}>
                <h2>Login</h2>
                <label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required /></label>
                <label>Senha<input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="current-password" required /></label>
                <button disabled={enviando}>{enviando ? "Entrando..." : "Entrar"}</button>
                {(erro || aviso) && <p className="erro" role="alert">{erro || aviso}</p>}
            </form>
        </div>
    );
}
