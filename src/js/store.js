import Vue from 'vue'
import Vuex from 'vuex'
import {isEmptyOrUndefined} from './util'
Vue.use(Vuex)

const state={
    // 登录的基本信息
    loginName:window.sessionStorage.getItem('userName'),
    userId:window.sessionStorage.getItem('userId'),
    // 菜单栏展示的状态
    breadCrumbs:window.sessionStorage.getItem('breadCrumbs'),
    activeName:window.sessionStorage.getItem('activeName')
    // count:0
}
const mutations={
    SET_LoginName:(state, value) =>{
        state.loginName = value;
        window.sessionStorage.setItem('userName', value);
    },
    SET_UserId:(state, value) =>{
        state.userId = value;
        window.sessionStorage.setItem('userId', value);
    },
    SET_BreadCrumbs:(state, value) =>{
        state.breadCrumbs = value;
        window.sessionStorage.setItem('breadCrumbs', value);
    },
    SET_ActiveName:(state, value) =>{
        state.activeName = value;
        window.sessionStorage.setItem('activeName', value);
    }
}
const getters = {
    getBreadCrumbs:function(state){
        let returnArr = [];
        let breadCrumbsStr = state.breadCrumbs;
        if(isEmptyOrUndefined(breadCrumbsStr)){
            return returnArr;
        }
        let breadCrumbsArr = breadCrumbsStr.split(',');
        for(var i = 0; i < breadCrumbsArr.length; i++){
            returnArr.push(JSON.parse(breadCrumbsArr[i]));
        }
     return returnArr;
    }
}
export default new Vuex.Store({
    state,
    mutations,
    getters
})