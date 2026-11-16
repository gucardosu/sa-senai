import React, { useEffect, useState } from 'react';
import api, { mensagemErro } from '../services/api.js';

export default function Proprietarios() {
  const [proprietarios, setProprietarios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function atualizar() {
    try {
      const resposta = await api.get('/proprietarios');
      setProprietarios(resposta.data);
    } catch (erro) { setErro(mensagemErro(erro)); }
    finally { setCarregando(false); }
  }

  useEffect(() => { atualizar(); }, []);
  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState(null);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [ocupado, setOcupado] = useState(false);

  async function pesquisar(evento) {
    evento.preventDefault();
    setOcupado(true);
    setErro('');
    setAviso('');
    try {
      const resposta = await api.get('/proprietarios', { params: { busca } });
      setResultados(resposta.data);
    } catch (erro) { setErro(mensagemErro(erro)); }
    finally { setOcupado(false); }
  }

  async function cadastrar(evento) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    setOcupado(true);
    setErro('');
    setAviso('');
    try {
      await api.post('/proprietarios', Object.fromEntries(new FormData(formulario)));
      formulario.reset();
      setResultados(null);
      setBusca('');
      setAviso('Proprietário cadastrado.');
      await atualizar();
    } catch (erro) { setErro(mensagemErro(erro)); }
    finally { setOcupado(false); }
  }

  return (
    <section>
      <h2>Proprietários</h2>
      {carregando && <p role="status">Carregando...</p>}
      {erro && <p className="erro" role="alert">{erro}</p>}
      {aviso && <p role="status">{aviso}</p>}
      <form className="busca" onSubmit={pesquisar}>
        <label>Buscar por nome ou e-mail<input value={busca} maxLength="160" onChange={(e) => setBusca(e.target.value)} /></label>
        <button disabled={ocupado}>{ocupado ? 'Aguarde...' : 'Buscar'}</button>
      </form>
      <div className="tabela"><table>
        <thead><tr><th>Nome</th><th>E-mail</th><th>Telefone</th></tr></thead>
        <tbody>{(resultados ?? proprietarios).map((p) => <tr key={p.id}><td>{p.nome}</td><td>{p.email}</td><td>{p.telefone}</td></tr>)}</tbody>
      </table></div>
      {(resultados ?? proprietarios).length === 0 && <p>Nenhum proprietário encontrado.</p>}
      <h3>Novo proprietário</h3>
      <form className="cadastro" onSubmit={cadastrar}>
        <label>Nome<input name="nome" maxLength="120" required /></label>
        <label>E-mail<input name="email" type="email" maxLength="160" required /></label>
        <label>Telefone<input name="telefone" type="tel" maxLength="20" required /></label>
        <label>CPF<input name="cpf" inputMode="numeric" maxLength="14" placeholder="Somente números" required /></label>
        <button disabled={ocupado}>{ocupado ? 'Aguarde...' : 'Cadastrar'}</button>
      </form>
    </section>
  );
}
