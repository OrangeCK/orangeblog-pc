import Vue from 'vue';
import App from './App.vue';
import router from './router';
import 'iview/dist/styles/iview.css';
import 'iview/dist/iview.min.js';
import iView from 'iview';
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import './assets/iconfont/iconfont.css'
import global from '@/js/global';
import store from './js/store';
import service from './js/request';
import API from './js/api';

/*axios*/
import axios from 'axios'
import {getCookie} from './js/cookieUtil.js'
import ivueCommon from './js/ivueCommon'
Vue.config.productionTip = true
Vue.use(ivueCommon);
Vue.use(iView);
Vue.use(mavonEditor);

let startApp = function () {
  axios.get('static/config.json').then((res) => {
    Vue.prototype.POSTS = window.POSTS = res.data;
    Vue.prototype.API = window.API = API.API(res.data);
    Vue.prototype.service = service;
    Vue.prototype.$axios = axios;
    Vue.prototype.$global = global;
    return new Vue({
      router,
      store,
      render: h => h(App),
    }).$mount('#app');
  })
}

export default startApp();

router.beforeEach((to, from, next) => {
  iView.LoadingBar.config({
    color: '#5cb85c',
    failedColor: '#f0ad4e',
  });
  iView.LoadingBar.start();
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    let token = getCookie("token");
    // 通过vuex state获取当前的token是否存在
    if (token) {
      service({
        url: "http://47.103.17.3:8080/login/judgeLogin",
        method: "get"
      }).then(res =>{
        let data = res.data;
        if(data.success){
          next();
        }else {
          next({
            path: '/Login',
            query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
          });
        }
      }).catch(function () {
          next({
            path: '/Login'
          });
      });
    }else {
      next({
        path: '/Login',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  }
  else {
      next();
  }
})

router.afterEach(route => {
  iView.LoadingBar.finish();
});


