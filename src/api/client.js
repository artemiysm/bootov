import axios from 'axios';

// Создаём  объект, который умеет отправлять запросы
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000, // Ждём ответ 10 секунд, потом — ошибка
});

// Перехватывает сообщение: 
api.interceptors.response.use(
  // Если пришёл нормальный ответ — пропускаем дальше
  (res) => res,

  //  Если ошибка (сервер не ответил, 404, 500 и т.д.)
  (error) => {
    // Печатаем в консоль браузера: что пошло не так
    console.error('API Error:', error.response?.data || error.message);
    // И «бросаем» ошибку дальше — чтобы компоненты могли её поймать
    return Promise.reject(error);
  }
);

// Экспортируем этот готовый «почтовый клиент», чтобы другие файлы могли им пользоваться
export default api;