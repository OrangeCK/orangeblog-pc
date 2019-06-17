import Vue from 'vue';
import App from './App.vue';
import router from './router';
import 'iview/dist/styles/iview.css';
import 'iview/dist/iview.min.js';
import '@/js/routePermission'
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




