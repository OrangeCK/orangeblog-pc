<template>
  <div class="loginbg">
    <div class="page lm-shadow">
      <div class="head">渠道拓展平台</div>
      <div class="singin">SING IN</div>
      <div class="body">
        <ul class="loginForm">
          <li><label class="accountIcon"></label><input type="text" v-model="loginForm.account" class="txtAccount" placeholder="请输入登录账号" /></li>
          <li><label class="passwordIcon"></label><input type="password" v-model="loginForm.password" class="txtPwd" placeholder="请输入登录密码" /></li>
          <li style="border: 0px;"><input type="text" v-model="loginForm.validateCode" class="txtCode" placeholder="请输入图片验证码" />
            <dl>
              <dt><img class="imgCode" :src="validateCodeImage" @click="getValidateCode"></dt>
              <dd><i @click="getValidateCode">看不清？刷新一下</i></dd>
            </dl>
          </li>
          <!-- <li style="width:50%; border:0;"><Input type="text" v-model="loginForm.password"  placeholder="输入验证码" /><img :src="validateCodeImage" /></li> -->
          <li style="border:0px;">
            <Button type="primary" class="loginBtn" @click="loginAction">登录</Button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loginbg{
  width: 100%;
  height: 100vh;
  /* background: url(../assets/login_bg.png) center center no-repeat; */
  /* background: #6699FF center center no-repeat; */
  background: linear-gradient(to bottom right,#65f7d7, #b2f3ee, #d0ece6, rgb(236, 100, 129))!important;
}
.page{
  background-color: #fff;
  width: 500px;
  height: 430px;
  border-radius: 5px;
  left: 50%;
  top: 50%;
  margin-left: -250px;
  margin-top: -215px;
  position:absolute;
}
.lm-shadow{
  box-shadow:0px 2px 10px rgb(184, 185, 185);
}
.loginForm{
  width: 350px;
  height: auto;
  list-style-type: none;
  padding: 0px;
  margin: 0 auto;
}
.loginForm li{
  margin:0px;
  width: 100%;
  height: 50px;
  margin: 25px 0;
  border: solid 1px #bad2d7;
  border-radius: 3px;
}
.loginForm li dl{
  margin-left: 40px;
  display: inline-block;
}
.loginForm li i{
	font-family: 'PingFang-SC-Medium';
	font-size: 12px;
  color: #4794ec;
  cursor: pointer;
}
.loginForm .txtAccount{
    width: 298px;
    height: 48px;
    border:0px;
    font-size: 16px;
    outline: none;
}
.loginForm .txtPwd{
    width: 298px;
    height: 48px;
    border:0px;
    font-size: 16px;
    outline: none;
}
.loginForm .txtCode{
    width: 180px;
    height: 48px;
    float: left;
    font-size: 16px;
    border: solid 1px #bad2d7;
    outline: none;
}
.loginForm .imgCode{
  width: 100px;
  height: 30px;
  border: 0px;
}
.loginForm .accountIcon
{
  padding: 25px;
  background: url(../assets/account.png) no-repeat center center;
}
.loginForm .passwordIcon
{
  padding: 25px;
  background: url(../assets/password.png) no-repeat center center;
}
.loginForm .loginBtn{
  width: 100%;
  height: 100%;
  font-size: 25px;
  border:0px;
  background: linear-gradient(to bottom right,#57a3f3, #76b0ee, #9dc9f8, rgb(190, 219, 236))!important;
}
.loginForm .loginBtn:hover{
  background: linear-gradient(to bottom right,#2188f7, #4297f3, #60a6f0, rgb(118, 197, 247))!important;
}
  .head{
    font-family: 'PingFang-SC-Heavy';
    font-size: 30px;
    color: #222222;
    margin-top: 25px;
    padding-left: 70px;
  }
  .singin{
    font-family: 'PingFang-SC-Heavy';
    font-size: 15px;
    color: #46a2d7;
    margin-left: 70px;
  }
  .body{
    width: 500px;
    margin: 0 auto;
  }
  .el-button{
    width: 100%;
  }
</style>


<script>
import {setCookie,getCookie} from '../js/cookieUtil.js'
  export default {
    data() {
      return {
        // backgroudDiv: {backgroundImage: 'url(' + require('../assets/login_bg.png') + ')'},
        // chkCodePath:"/login/getValidateCode?r="+Math.random(),
        validateCodeImage: '',
        loginForm: {
          loginName: '',
          password: '',
          validateCode: ''
        }
      }
    },
    mounted(){
      this.getValidateCode();
    },
    methods: {
      getValidateCode(){
        this.service({
          url: this.API.validateCode,
          method: "get"
        }).then(res => {
          let data = res.data;
          if(data.success == true){
            this.validateCodeImage = data.data;
          }
        });
      },
      loginAction(){
        this.service({
          url: this.API.login,
          data: {
            loginName:this.loginForm.account,
            password:this.loginForm.password,
            validateCode:this.loginForm.validateCode
          },
          method: "post"
        }).then(response => {
            let data = response.data.data;
            if(response.data.success == true){
              setCookie('token', data.Authorization);
              setCookie('refreshToken', data.Refresh_Token);
              this.$store.commit('SET_LoginName', data.userName);
              this.$store.commit('SET_UserId', data.id);
              this.$store.commit('SET_BreadCrumbs', '[]');
              this.$store.commit('SET_ActiveName', '');
              this.$router.push({ path: "/" });
            }else{
              this.$Message.error({
                content:response.data.msg,
                duration:5
              });
            }
          });  
      }
    }
  }
</script>