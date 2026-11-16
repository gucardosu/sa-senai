import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 10000 });

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use((resposta) => resposta, (erro) => {
  if (erro.response?.status === 401 && erro.config?.url !== '/auth/login') {
    sessionStorage.removeItem('token');
    window.dispatchEvent(new Event('sessao-expirada'));
  }
  return Promise.reject(erro);
});

export function mensagemErro(erro) {
  return erro.response?.data?.mensagem || 'Não foi possível conectar ao servidor. Tente novamente.';
}

export default api;
