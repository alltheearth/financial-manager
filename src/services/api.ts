import axios from 'axios';

// Configuração base do Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requisições
api.interceptors.request.use(
  (config) => {
    // Aqui você pode adicionar tokens de autenticação se necessário
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamento global de erros
    if (error.response) {
      // Erro de resposta do servidor
      console.error('Erro na resposta:', error.response.data);
    } else if (error.request) {
      // Requisição foi feita mas sem resposta
      console.error('Sem resposta do servidor');
    } else {
      // Erro ao configurar a requisição
      console.error('Erro na requisição:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;