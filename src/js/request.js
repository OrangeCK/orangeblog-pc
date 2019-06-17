import axios from 'axios'
import {setCookie,getCookie} from './cookieUtil.js'
import router from '../router';

const service = axios.create({
    withCredentials: true,
  })
  
  // http request 拦截器
  service.interceptors.request.use(
    config => {
      // console.log("正在请求", config);
      let token = getCookie("token");
      let refreshToken = getCookie("refreshToken");
      if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
          config.headers.Authorization = token;
          config.headers.Refresh_Token = refreshToken;
      }
      return config;
    },
    error => {
        return Promise.reject(error);
    });
  
  // http response拦截器
  service.interceptors.response.use(data => {// 响应成功关闭loading
    // console.log("成功响应",data);
    let token = data.headers.authorization;
    if(token){
      setCookie('token', token);
    }
    return data
   }, 
   error => {
      // console.log("失败响应",error.response);
      if(error.response){
        switch(error.response.status){
          case 401:
            router.replace({
              path:'/Login',
              query: {redirect: router.currentRoute.fullPath}
            });
            break;
          case 403:
            router.replace({
              path:'/Login',
              query: {redirect: router.currentRoute.fullPath}
            });
            break;
          case 500:
            return error.response;
        }
      }
    return Promise.reject(error)
   });

   export default service
