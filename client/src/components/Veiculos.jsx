import React, { useEffect, useState } from 'react';
import api, { mensagemErro } from '../services/api.js';

export default function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [proprietarios, setProprietarios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function atualizar() {
    try {
      const resposta = await api.get('/veiculos');
      setVeiculos(resposta.data);
      const clientes = await api.get('/proprietarios');
      setProprietarios(clientes.data);
    } catch (erro) { setErro(mensagemErro(erro)); }
    finally { setCarregando(false); }
  }

  useEffect(() => { atualizar(); }, []);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function cadastrar(evento) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    setEnviando(true);
    setErro('');
    setAviso('');
    try {
      await api.post('/veiculos', Object.fromEntries(new FormData(formulario)));
      formulario.reset();
      setAviso('Veículo cadastrado.');
      await atualizar();
    } catch (erro) { setErro(mensagemErro(erro)); }
    finally { setEnviando(false); }
  }

  return (
    <section>
      <h2>Veículos</h2>
      {carregando && <p role="status">Carregando...</p>}
      {erro && <p className="erro" role="alert">{erro}</p>}
      {aviso && <p role="status">{aviso}</p>}
      <div className="tabela"><table>
        <thead><tr><th>Marca / modelo</th><th>Placa</th><th>Ano</th><th>Cor</th><th>Proprietário</th></tr></thead>
        <tbody>{veiculos.map((v) => <tr key={v.id}><td>{v.marca} {v.modelo}</td><td>{v.placa}</td><td>{v.ano || '-'}</td><td>{v.cor || '-'}</td><td>{v.proprietarioNome}</td></tr>)}</tbody>
      </table></div>
      {veiculos.length === 0 && <p>Nenhum veículo cadastrado.</p>}
      <h3>Novo veículo</h3>
      {proprietarios.length === 0 && <p>Cadastre um proprietário antes de adicionar um veículo.</p>}
      <form className="cadastro" onSubmit={cadastrar}>
        <label>Marca<input name="marca" maxLength="80" required /></label>
        <label>Modelo<input name="modelo" maxLength="100" required /></label>
        <label>Placa<input name="placa" maxLength="8" placeholder="ABC1D23" required /></label>
        <label>Ano<input name="ano" type="number" min="1900" max={new Date().getFullYear() + 1} /></label>
        <label>Cor<input name="cor" maxLength="40" /></label>
        <label>Proprietário<select name="proprietarioId" defaultValue="" required>
          <option value="" disabled>Selecione</option>
          {proprietarios.map((p) => <option value={p.id} key={p.id}>{p.nome} ({p.email})</option>)}
        </select></label>
        <button disabled={enviando || proprietarios.length === 0}>{enviando ? 'Salvando...' : 'Cadastrar'}</button>
      </form>
    </section>
  );
}
