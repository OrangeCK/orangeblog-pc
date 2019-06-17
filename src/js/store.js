import Vue from 'vue'
import Vuex from 'vuex'
import {isEmptyOrUndefined} from './util'
Vue.use(Vuex)

const state={
    // 登录的基本信息
    loginName:window.localStorage.getItem('userName'),
    userId:window.localStorage.getItem('userId'),
    // 菜单栏展示的状态
    breadCrumbs:window.localStorage.getItem('breadCrumbs'),
    activeName:window.localStorage.getItem('activeName')
    // count:0
}
const mutations={
    SET_LoginName:(state, value) =>{
        state.loginName = value;
        window.localStorage.setItem('userName', value);
    },
    SET_UserId:(state, value) =>{
        state.userId = value;
        window.localStorage.setItem('userId', value);
    },
    SET_BreadCrumbs:(state, value) =>{
        state.breadCrumbs = value;
        window.localStorage.setItem('breadCrumbs', value);
    },
    SET_ActiveName:(state, value) =>{
        state.activeName = value;
        window.localStorage.setItem('activeName', value);
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