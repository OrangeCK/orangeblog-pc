import router from '@/router';
import iView from 'iview';
import store from './store';
// import axios from 'axios';

router.beforeEach((to, from, next) => {
    iView.LoadingBar.config({
      color: '#5cb85c',
      failedColor: '#f0ad4e',
    });
    iView.LoadingBar.start();
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
      let token = store.state.token
      // 通过vuex state获取当前的token是否存在
      if (token) {
        next();
        // axios({
        //   url: "http://127.0.0.1:8888/login/judgeLogin",
        //   method: "get"
        // }).then(res =>{
        //   let data = res.data;
        //   if(data.success){
        //     next();
        //   }else {
        //     next({
        //       path: '/Login',
        //       query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
        //     });
        //   }
        // }).catch(function () {
        //     next({
        //       path: '/Login'
        //     });
        // });
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
  
router.afterEach(() => {
    iView.LoadingBar.finish();
});