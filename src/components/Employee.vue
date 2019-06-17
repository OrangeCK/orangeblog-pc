<template>
    <div>
        <div class="min_tools">
            <div class="tools" ref="tools" :class="{'is_fixed' : isFixed}">
                <Input  placeholder="请输入登录名..." v-model="searchForm.loginName" clearable class="inp"/>
                <Input  placeholder="请输入用户名..." v-model="searchForm.userName" clearable class="inp"/>
                <Button type="warning" custom-icon="iconfont icon-sousuo" @click="searchEmployee(1)">Search</Button>
                <Button type="warning" custom-icon="iconfont icon-jiajianzujianjiahao" @click="addEmployee">Add</Button>
            </div>
        </div>
        <Divider orientation="left"><h4>查询结果</h4></Divider>
        <div class="content">
            <Table :loading="empTable.loading" ref="selection" :columns="empTable.columns" :data="empTable.datas"></Table>
            <div style="margin: 10px 10px 0 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="empTable.page.total" :page-size="empTable.page.pageSize" :current="empTable.page.pageIndex" @on-change="searchEmployee"
                        @on-page-size-change="handlePageSize" show-sizer show-total show-elevator/>
                </div>
            </div>
            <Modal :mask-closable="addModal.closable" :closable="addModal.closable" v-model="addModal.show" :title="addModal.title" @on-cancel="cancelEmployee('addModal.form')">
                <Spin fix v-if="addModal.loading">
                    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                    <div>Loading</div>
                </Spin>
                <p slot="header" style="color:#f60;text-align:left">
                    <Icon custom="iconfont icon-changyonggoupiaorenbianji"></Icon>
                    <span>{{addModal.formModalName}}</span>
                </p>
                <Form :model="addModal.form" ref="addModal.form" :rules="addModal.ruleValidate" :label-width="70" style="height:220px;">
                    <div class="div_form">
                        <FormItem label="用户名称" prop="userName" class="form_inp">
                            <Input v-model="addModal.form.userName" placeholder="请输入用户名"/>
                        </FormItem>
                        <FormItem label="登录名称" prop="loginName" class="form_inp">
                            <Input v-model="addModal.form.loginName" placeholder="请输入登录名"/>
                        </FormItem>
                    </div>
                    <div class="float_lf">
                        <FormItem label="用户电话" prop="phone" class="form_inp">
                            <Input v-model="addModal.form.phone" placeholder="请输入电话"/>
                        </FormItem>
                        <FormItem label="年龄" prop="age" class="form_inp">
                            <Input v-model="addModal.form.age" placeholder="请输入年龄"/>
                        </FormItem>
                    </div>
                    <div class="float_lf">
                        <FormItem label="密码" prop="password" class="form_inp">
                            <Input v-model="addModal.form.password" placeholder="请输入密码"/>
                        </FormItem>
                        <FormItem label="性别" prop="sex" class="form_inp">
                            <RadioGroup v-model="addModal.form.sex">
                                <Radio label="1" size="large">
                                    <Icon type="md-male"></Icon>
                                    <span>男</span>
                                </Radio>
                                <Radio label="0" size="large">
                                    <Icon type="md-female"></Icon>
                                    <span>女</span>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                    </div>
                    <div class="float_lf">
                        <FormItem label="工号" prop="jobNumber" class="form_inp">
                            <Input v-model="addModal.form.jobNumber" placeholder="请输入工号"/>
                        </FormItem>
                        <FormItem label="角色" prop="role" class="form_inp">
                            <Select v-model="addModal.form.role" placeholder="请选择角色">
                                <Option v-for="item in addModal.form.roleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                    </div>
                </Form>   
                <div slot="footer">
                    <Button type="error" size="large" long  @click="submitEmployee('addModal.form')">提交</Button>
                </div>
                
            </Modal>
        </div>
    </div>
</template>

<style scoped>
.min_tools{
    min-height: 50px;
}
div .tools {
    width: 100%;
    min-height: 50px;
    background: rgb(220, 242, 245);
    padding: 10px 24px 0 24px;
    position: relative;
}
div .is_fixed {
    top: 0px;
    left: 233px;
    right: 33px;
    width: auto;
    position: fixed;
    z-index: 999;   
}
div .inp{
    width: 200px;
}
div .form_inp{
    float: left;
    width: 50%;
}
div .div_form{
    width: 100%;
    float: left;
}
.content {
    padding: 5px;
    height: 100%;
    overflow:auto;
}
.modalFooter{
    height: 50px;
    line-height: 50px;
    text-align: center;
}
.modalFooter button{
    margin: 0 20px;
}
.ivu-table .demo-table-info-row td{
        background-color: #2db7f5;
        color: #fff;
    }
.ivu-table .demo-table-error-row td{
    background-color: #ff6600;
    color: #fff;
}
.ivu-table td.demo-table-info-column{
    background-color:#2db7f5;
    color: #fff;
}
.ivu-table td.demo-table-info-column2{
    background-color:#ff6600;
    color: #fff;
}
.ivu-table .demo-table-info-cell-name {
    background-color: #2db7f5;
    color: #fff;
}
.ivu-table .demo-table-info-cell-age {
    background-color: #ff6600;
    color: #fff;
}
.ivu-table .demo-table-info-cell-address {
    background-color: #187;
    color: #fff;
}
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
.demo-spin-col{
    height: 100px;
    position: relative;
    border: 1px solid #eee;
}
</style>
<script>
import {setCookie,getCookie} from '../js/cookieUtil.js'
import $ from 'jquery'
export default {
        data () {
            return {
                isFixed: false,
                offsetTop:0,
                offsetWidth:0,
                searchForm:{
                    loginName:'',
                    userName:''
                },
                addModal:{
                    show:false,
                    title:'新增用户',
                    loading:false,
                    closable:true,
                    ruleValidate:{
                        userName:{
                            required: true, message: '用户名称不能为空', trigger: 'blur'
                        },
                        loginName:{
                            required: true, message: '登录名不能为空', trigger: 'blur'
                        },
                        phone:[
                            {required: true, message: '电话不能为空', trigger: 'blur'},
                            {type: 'string',pattern:/^(0?1[358]\d{9})$|^((0(10|2[1-3]|[3-9]\d{2}))?[1-9]\d{6,7})$/,message:'请输入正确的电话号码', trigger:'blur'}
                        ],
                        password:{
                            required: true, message: '密码不能为空', trigger: 'blur'
                        },
                        age:{
                            required: true, type:'string',pattern:/^-?[1-9]\d*$/, message: '年龄为整数', trigger: 'blur'
                        },
                        sex:{
                            required: true, message: '性别不能为空', trigger: 'change'
                        },
                        role:{
                            required: true, message: '角色不能为空', trigger: 'change'
                        }
                    },
                    formModalName:"",
                    form:{
                        id:null,
                        userName:'',
                        loginName:'',
                        age:'',
                        sex:'',
                        phone:'',
                        password:'',
                        jobNumber:'',
                        role:'',
                        roleList:[{
                            label:'管理员',
                            value:'1'
                        }]
                    }
                },
                empTable:{
                    loading:false,
                    columns:[
                        {
                            "title":"用户名称",
                            "key":"userName"
                        },
                        {
                            "title":"登录名称",
                            "key":"loginName"
                        },
                        {
                            "title":"年龄",
                            "key":"age"
                        },
                        {
                            "title":"性别",
                            "key":"sex"
                        },
                        {
                            "title":"用户电话",
                            "key":"userPhone"
                        },
                        {
                            "title":"角色",
                            "key":"roleName"
                        },
                        {
                            "title":"操作",
                            "key":"",
                            width:170,
                            render:(h, params) => {
                                return h('div',[
                                    h('Button', {
                                        props: {
                                            type: 'warning',
                                            size: 'default',
                                            ghost: true,
                                            'custom-icon': 'iconfont icon-changyonggoupiaorenbianji'
                                        },
                                        style: {
                                            padding: '5px 10px 5px 10px'
                                        },
                                        on: {
                                            click: () => {
                                                this.editEmployee(params);
                                            }
                                        }
                                    }, 'Edit'),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'default',
                                            ghost: true,
                                            'custom-icon': 'iconfont icon-shanchu'
                                        },
                                        style: {
                                            padding: '5px 10px 5px 10px'
                                        },
                                        on: {
                                            click: () => {
                                                this.disableEmployee(params.row.id);
                                            }
                                        }
                                    }, 'Del')   
                                ])
                            }
                        }
                    ],
                    datas:[
                    ],
                    page:{
                        pageIndex:1,
                        pageSize:10,
                        total:0
                    } 
                },
                cityList: [
                    {
                        value: 'New York',
                        label: 'New York'
                    }
                ]                
            }
        },
        created(){
            this.searchEmployee(1);
        },
        mounted(){
            window.addEventListener('scroll', this.handleScroll);
            this.$nextTick(function(){
                this.offsetTop = $(".tools").offset().top;
            });
        },
        destroyed(){
            window.removeEventListener('scroll', this.handleScroll);
        },
        methods: {
            handleScroll(){
                var scrollTop =  window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                this.isFixed = scrollTop > this.offsetTop ? true : false;
            },     
            handleSelectAll (status) {
                this.$refs.selection.selectAll(status);
            },
            handlePageSize(pageSize){
                this.empTable.page.pageSize = pageSize;
                this.searchEmployee(1);
            },
            searchEmployee(page){
                this.empTable.loading = true;
                this.service({
                    url: this.API.employeePageList + '?pageIndex=' + page + '&pageSize=' + this.empTable.page.pageSize,
                    data: {
                        'loginName':this.searchForm.loginName,
                        'userName':this.searchForm.userName,
                    },
                    method: "post"
                }).then(response => {
                    var data = response.data.data;
                    this.empTable.datas = data.records;
                    for(let i = 0; i < this.empTable.datas.length; i++){
                        this.empTable.datas[i]["roleName"] = this.empTable.datas[i].rolePoList[0].roleName;
                    }
                    this.empTable.page.total = data.total;
                    this.empTable.loading = false;
                });  
            },
            // 全局loading开启
            handleSpinShow() {
                this.$Spin.show({
                    render: (h) => {
                        return h('div', [
                            h('Icon', {
                                'class': 'demo-spin-icon-load',
                                props: {
                                    custom: 'iconfont icon-load-a-copy',
                                    size: 20
                                }
                            }),
                            h('div', 'Loading')
                        ])
                    }
                });
            },
            // 全局loading关闭
            handleSpinHide() {
                this.$Spin.hide();
            },
            tipMessage(type,msg){
                switch(type){
                    case 'info':
                        this.$Message.info({
                            content: msg,
                            duration: 5
                        });
                        break;
                    case 'warning':
                        this.$Message.warning({
                            content: msg,
                            duration: 5
                        });
                        break;
                    case 'success':
                        this.$Message.success({
                            content: msg,
                            duration: 5
                        });
                        break;
                    case 'error':
                        this.$Message.error({
                            content: msg,
                            duration: 5
                        });
                        break;
                }
            },
            confirmMessage(type, msg){
                let title = "消息";
                let content = msg;
                switch(type){
                    case 'info':
                        this.$Modal.confirm({
                            title: title,
                            content: content
                        });
                        break;
                    case 'warning':
                        this.$Modal.warning({
                            title: title,
                            content: content
                        });
                        break;
                    case 'success':
                        this.$Modal.success({
                            title: title,
                            content: content
                        });
                        break;
                    case 'error':
                        this.$Modal.error({
                            title: title,
                            content: content
                        });
                        break;
                }
            },
            addEmployee(){
                this.addModal.formModalName = '用户新增';
                this.addModal.show = true;
            },
            editEmployee(params){
                this.addModal.formModalName = '用户编辑';
                this.addModal.show = true;
                this.addModal.form.id = params.row.id;
                this.addModal.form.loginName = params.row.loginName;
                this.addModal.form.userName = params.row.userName;
                this.addModal.form.phone = params.row.userPhone;
                this.addModal.form.age = params.row.age.toString();
                this.addModal.form.sex = params.row.sex;
                this.addModal.form.password = params.row.password;
                this.addModal.form.jobNumber = params.row.jobNumber;
                this.addModal.form.role = params.row.rolePoList[0].id.toString();
            },
            submitEmployee(name){
                 this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.addModal.closable = false;
                        this.addModal.loading = true;
                        let url = this.API.saveEmployee;
                        this.service({
                            url: url,
                            data: {
                                'id':this.addModal.form.id,
                                'loginName':this.addModal.form.loginName,
                                'userName':this.addModal.form.userName,
                                'userPhone':this.addModal.form.phone,
                                'age':this.addModal.form.age,
                                'sex':this.addModal.form.sex,
                                'password':this.addModal.form.password,
                                'rolePoList':[{
                                    'id':this.addModal.form.role
                                }]
                            },
                            method: "post"
                        }).then(response => {
                            let data = response.data;
                            if(data.success == true){
                                this.tipMessage("info","提交成功");
                                this.addModal.closable = true;
                                this.addModal.loading = false;
                                this.addModal.show = false; 
                                this.searchEmployee(1);
                            }else{
                                this.tipMessage("error",data.msg);
                                this.addModal.closable = true;
                                this.addModal.loading = false;
                            }
                        });                     
                    } else {
                        this.tipWarningMessage('请填写完表单');
                    }
                })               
            },
            disableEmployee(id){
                this.$Modal.confirm({
                    title: "警告",
                    content: '<p>确定要删除用户吗？</p>',
                    onOk: () => {
                        this.handleSpinShow();
                        this.service({
                            url: this.API.disableEmployee + "?id="+id,
                            method: "post"
                        }).then(response => {
                            this.handleSpinHide();
                            let data = response.data;
                            if(data.success == true){
                                this.tipMessage("info","操作成功");
                                this.searchEmployee(1);
                            }else{
                                this.tipMessage("error",data.msg);
                            }
                        });    
                    }
                });
            },
            cancelEmployee(name){
                this.$refs[name].resetFields();
                this.addModal.form.id = null;
            }
        }
    }
</script>
