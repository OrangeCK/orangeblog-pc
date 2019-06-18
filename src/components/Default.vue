<template>
    <div class="layout" style="min-width:1200px;border-bottom-width: 0px;border-top-width: 0px;">
        <Layout :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}">
            <Sider>
                <Menu theme="dark" width="auto"  @on-select="changeTab" :open-names="menusShow" :active-name="activeName">
                    <div class="menuTop" @click="jumpIndex">
                        <Icon type="ios-home" size="28" color="#fff"></Icon>
                        <label>首页</label>
                    </div>
                    <Submenu :name="menu.id" v-for="menu in form.menus" :key="menu.id">
                        <template slot="title">
                            <Icon :type="menu.iconType" size="18"></Icon>
                            {{menu.menuName}}
                        </template>
                        <MenuItem :name="children.mCode" v-for="(children,index) in menu.menuList" :key="index">
                            <Icon :type="children.iconType2" size="16"></Icon>
                            {{children.mName}}
                        </MenuItem>
                    </Submenu>
                </Menu>
            </Sider>
        </Layout>
        <Layout :style="{marginLeft: '200px'}">
            <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.3)'}" style="z-index: 1">
                <div class="topBox">
                    <!-- <img src="../assets/logo.png" />  -->
                    <label>测试平台</label>
                    <div class="userInfo">
                        <!-- <img src="../assets/user.png" />  -->
                        <Icon custom="iconfont icon-wode1" size="36" />
                        <span>{{$store.state.loginName}}</span>
                        <Icon class="quit_user" @click="quit" custom="iconfont icon-tuichu1" size="24"/>
                    </div>
                </div> 
            </Header>
            <Content :style="{padding: '0px 16px 16px 16px',background: 'rgb(220, 242, 245)'}" >
                <Breadcrumb :style="{padding: '10px 0'}">
                    <BreadcrumbItem v-for="(tab,index) in getBreadCrumbs" :key="index">{{tab.name}}</BreadcrumbItem>
                </Breadcrumb>
                <Card>
                    <div class="card-div">
                        <router-view />
                    </div>
                </Card>
            </Content>
        </Layout>
    </div>
</template>
<style scoped>
    .layout{
        border: 0px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        /* overflow: hidden; */
    }
    .layout-header-bar{
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .topBox {
        width: 100%;
        height: 62px;
    }
    .topBox img{
        float: left;
        margin-top: 10px;
    }
    .topBox label{
        float: left;
        margin: 0 0 0 20px;
        font-size: 16px;
        font-weight: bold;
    }
    .topBox .userInfo{
        float: right;
        margin: 0 0 0 0;
        font-size: 16px;
    }
    .menuTop{
        height:62px;
        padding: 20px 0 0 50px;
    }
    .menuTop label{
        color:#fff;
        margin: 5px 0 0 15px;
        position:absolute;
        cursor: pointer;
    }
    .quit_user{
        margin-left:10px;
        cursor: pointer;
    }
    .quit_user:hover{
		transform: scale(1.1);
	 }
    /* .card-div{
        min-height: 500px;
    } */
</style>
<script>
import {setCookie,getCookie,delCookie} from '../js/cookieUtil'
    export default {
        data(){
            return{
                activeName:this.$store.state.activeName,
                loginName:this.$global.loginName,
                siderShow:true,
                menusShow:[],
                contentTabs:{
                    tabList:[]
                },
                form:{
                    menus:[
                        {id:4,menuName:'配置管理',menuNum:'0137',iconType:'ios-basket-outline',menuList:[{mCode:'Employee',mName:'用户管理',iconType2:'ios-basket-outline'}]},
                        {id:5,menuName:'博客管理',menuNum:'0138',iconType:'md-cube',menuList:[{mCode:'QueryImage',mName:'查询博客',iconType2:'md-cube'}]}
                    ]
                }
            }
        },
        created(){
            this.menusShow = this.form.menus[0].menuList;
        },
        computed:{
            getBreadCrumbs(){
                return this.$store.getters.getBreadCrumbs;
            }
        },
        methods:{
            quit(){
                this.$Modal.confirm({
                    title: "警告",
                    content: '<p>确定要退出登录吗？</p>',
                    onOk: () => {
                        this.service({
                            url: this.API.quitLogin,
                            method: "post"
                        }).then(response => {
                            let data = response.data;
                            delCookie("token");
                            delCookie("refreshToken");
                            this.$router.replace({
                                path:'/Login'                            
                            });
                        });    
                    }
                });
            },
            jumpIndex(){
                this.$router.push({ path: 'TestVue2' });  
                this.activeName = 'ssss';
            },
            changeTab(name){
                var breakFlag = false;
                this.contentTabs.tabList=[];
                for(var i=0;i<this.form.menus.length;i++){
                    var menuList = this.form.menus[i].menuList;
                    for(var j=0;j<menuList.length;j++){
                        if(menuList[j].mCode == name){
                            var myobj={
                                name:this.form.menus[i].menuName
                            }
                            this.contentTabs.tabList.push(JSON.stringify(myobj));  
                            var myobj1={
                                name:menuList[j].mName
                            }
                            this.contentTabs.tabList.push(JSON.stringify(myobj1));
                            breakFlag = true;
                            break;  
                        }
                    }
                    this.$store.commit('SET_ActiveName', name);
                    this.$store.commit('SET_BreadCrumbs', this.contentTabs.tabList.join(","));
                    if(breakFlag){break;}
                }
                this.$router.push({ path: name });
            }
        }       
    }
</script>