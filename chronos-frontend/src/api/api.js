import axios from "axios";

const api = axios.create({
    baseURL: `http://localhost:8888/api/`,
    headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
    credentials: 'include',   
    withCredentials: true
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem('accessToken')
  return config
})

// function getCookie(cookieName) {
//     let cookie = {};
//     document.cookie.split(';').forEach(function(el) {
//       let [key,value] = el.split('=');
//       cookie[key.trim()] = value;
//     })
//     return cookie[cookieName];
// }

export default api