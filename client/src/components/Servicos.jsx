import React, { useEffect, useState } from 'react';
import api, { mensagemErro } from '../services/api.js';

const tipos = ['Lavagem simples', 'Lavagem completa', 'Higienização interna', 'Polimento', 'Enceramento'];
const status = { aberto: 'Aberto', em_andamento: 'Em andamento', concluido: 'Concluído', cancelado: 'Cancelado' };
const moeda = (valor) => Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Servicos() {
  const [ordens, setOrdens] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function atualizar() {
    try {
      const resposta = await api.get('/ordens-servico');
      setOrdens(resposta.data);
      const carros = await api.get('/veiculos');
      setVeiculos(carros.data);
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
      await api.post('/ordens-servico', Object.fromEntries(new FormData(formulario)));
      formulario.reset();
      setAviso('Serviço cadastrado.');
      await atualizar();
    } catch (erro) { setErro(mensagemErro(erro)); }
    finally { setEnviando(false); }
  }

  async function mudarStatus(id, novoStatus) {
    setEnviando(true);
    setErro('');
    setAviso('');
    try {
      await api.patch(`/ordens-servico/${id}/status`, { status: novoStatus });
      setAviso('Status atualizado.');
      await atualizar();
    } catch (erro) { setErro(mensagemErro(erro)); }
    finally { setEnviando(false); }
  }

  return (
    <section>
      <h2>Serviços do lava-car</h2>
      {carregando && <p role="status">Carregando...</p>}
      {erro && <p className="erro" role="alert">{erro}</p>}
      {aviso && <p role="status">{aviso}</p>}
      <div className="tabela"><table>
        <thead><tr><th>Entrada</th><th>Serviço</th><th>Veículo</th><th>Proprietário</th><th>Valor</th><th>Status</th></tr></thead>
        <tbody>{ordens.map((o) => <tr key={o.id}>
          <td>{new Date(o.dataEntrada).toLocaleString('pt-BR')}</td>
          <td>{o.tipoServico}<small>{o.descricao}</small></td>
          <td>{o.modelo}<small>{o.placa}</small></td>
          <td>{o.proprietarioNome}</td><td className="valor">{moeda(o.valor)}</td>
          <td><select aria-label={`Status do serviço ${o.id}`} value={o.status} disabled={enviando} onChange={(e) => mudarStatus(o.id, e.target.value)}>
            {Object.entries(status).map(([valor, nome]) => <option key={valor} value={valor}>{nome}</option>)}
          </select></td>
        </tr>)}</tbody>
      </table></div>
      {ordens.length === 0 && <p>Nenhum serviço cadastrado.</p>}
      <h3>Novo serviço</h3>
      {veiculos.length === 0 && <p>Cadastre um veículo antes de adicionar um serviço.</p>}
      <form className="cadastro" onSubmit={cadastrar}>
        <label>Veículo<select name="veiculoId" defaultValue="" required>
          <option value="" disabled>Selecione</option>
          {veiculos.map((v) => <option key={v.id} value={v.id}>{v.placa} - {v.modelo} ({v.proprietarioNome})</option>)}
        </select></label>
        <label>Tipo de serviço<select name="tipoServico" defaultValue="" required>
          <option value="" disabled>Selecione</option>
          {tipos.map((tipo) => <option key={tipo}>{tipo}</option>)}
        </select></label>
        <label>Valor (R$)<input name="valor" type="number" min="0" max="99999999.99" step="0.01" required /></label>
        <label>Descrição<input name="descricao" maxLength="255" placeholder="O que será feito no veículo" required /></label>
        <button disabled={enviando || veiculos.length === 0}>{enviando ? 'Salvando...' : 'Cadastrar'}</button>
      </form>
    </section>
  );
}
