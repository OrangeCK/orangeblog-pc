<template>
    <div>
        <div class="min_tools">
            <div class="tools" ref="tools" :class="{'is_fixed' : isFixed}">
                <Input  placeholder="请输入字典编码..." v-model="searchForm.dicCode" clearable class="inp"/>
                <Input  placeholder="请输入字典值编码..." v-model="searchForm.dicValCode" clearable class="inp"/>
                <Input  placeholder="请输入字典值名称..." v-model="searchForm.dicValValue" clearable class="inp"/>
                <Button type="warning" custom-icon="iconfont icon-sousuo" @click="searchDictionaryValue(1)">Search</Button>
                <Button type="warning" custom-icon="iconfont icon-jiajianzujianjiahao" @click="addDictionaryValue">Add</Button>
            </div>
        </div>
        <Divider orientation="left"><h4>查询结果</h4></Divider>
        <div class="content">
            <Table :loading="dTable.loading" ref="selection" :columns="dTable.columns" :data="dTable.datas"></Table>
            <div style="margin: 10px 10px 0 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="dTable.page.total" :page-size="dTable.page.pageSize" :current="dTable.page.pageIndex" @on-change="searchDictionaryValue"
                        @on-page-size-change="handlePageSize" show-sizer show-total show-elevator/>
                </div>
            </div>
            <Modal :mask-closable="addModal.closable" :closable="addModal.closable" v-model="addModal.show" :title="addModal.title" @on-cancel="cancelDictionaryValue('addModal.form')">
                <Spin fix v-if="addModal.loading">
                    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                    <div>Loading</div>
                </Spin>
                <p slot="header" style="color:#f60;text-align:left">
                    <Icon custom="iconfont icon-changyonggoupiaorenbianji"></Icon>
                    <span> 编辑</span>
                </p>
                <Form :model="addModal.form" ref="addModal.form" :rules="addModal.ruleValidate" :label-width="90" >
                    <FormItem label="字典编码" prop="dicCode" >
                        <Select v-model="addModal.form.dicCode" placeholder="请输入字典编码">
                            <Option v-for="item in addModal.form.dictionaryList" :value="item.dicCode" :key="item.dicCode">{{ item.dicValue }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="字典值编码" prop="dicValCode" >
                        <Input v-model="addModal.form.dicValCode" placeholder="请输入字典值编码"/>
                    </FormItem>
                    <FormItem label="字典值名称" prop="dicValValue" >
                        <Input v-model="addModal.form.dicValValue" placeholder="请输入字典值描述"/>
                    </FormItem>
                    <FormItem label="字典值描述" prop="dicValDesc" >
                        <Input v-model="addModal.form.dicValDesc" placeholder="请输入字典值描述"/>
                    </FormItem>
                </Form>   
                <div slot="footer">
                    <Button type="error" size="large" long  @click="submitDictionaryValue('addModal.form')">提交</Button>
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
div .tools button{
    margin-left: 5px;
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
import $ from 'jquery'
export default {
        data () {
            return {
                isFixed: false,
                offsetTop:0,
                offsetWidth:0,
                searchForm:{
                    dicCode:'',
                    dicValCode:'',
                    dicValValue:''
                },
                addModal:{
                    show:false,
                    loading:false,
                    closable:true,
                    form:{
                        id:null,
                        dicCode:'',
                        dicValCode:'',
                        dicValValue:'',
                        dicValDesc:'',
                        dictionaryList:[]
                    },
                    ruleValidate:{
                        dicCode:{
                            required: true, message: '字典编码不能为空', trigger: 'change'
                        },
                        dicValCode:{
                            required: true, message: '字典值编码称不能为空', trigger: 'blur'
                        },
                        dicValValue:{
                            required: true, message: '字典值名称不能为空', trigger: 'blur'
                        },
                        dicValDesc:{
                            required: true, message: '字典值描述不能为空', trigger: 'blur'
                        }
                    }
                },
                dTable:{
                    loading:false,
                    columns:[
                        {
                            "title":"字典编码",
                            "key":"dicCode"
                        },
                        {
                            "title":"字典值编码",
                            "key":"dicValCode"
                        },
                        {
                            "title":"字典值名称",
                            "key":"dicValValue"
                        },
                        {
                            "title":"字典值描述",
                            "key":"dicValDesc"
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
                                                this.editDictionaryValue(params);
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
                                                this.deleteDictionaryValue(params.row.id);
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
                }             
            }
        },
        mounted(){
            this.searchDictionaryValue(1);
            this.initDictionaryList();
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
                this.dTable.page.pageSize = pageSize;
                this.searchDictionaryValue(1);
            },
            initDictionaryList(){
                this.service({
                    url: this.API.getAllDictionaryList,
                    method: "post"
                }).then(response => {
                    var data = response.data.data;
                    this.addModal.form.dictionaryList = data;
                });  
            },
            addDictionaryValue(){
                this.addModal.show = true;
            },
            searchDictionaryValue(page){
                this.dTable.loading = true;
                this.service({
                    url: this.API.dictionaryValuePageList,
                    data: {
                        'dicCode':this.searchForm.dicCode,
                        'dicValCode':this.searchForm.dicValCode,
                        'dicValValue':this.searchForm.dicValValue,
                        'pageIndex':page,
                        'pageSize':this.dTable.page.pageSize
                    },
                    method: "post"
                }).then(response => {
                    var data = response.data.data;
                    this.dTable.datas = data.records;
                    this.dTable.page.total = data.total;
                    this.dTable.loading = false;
                });  
            },
            editDictionaryValue(params){
                this.addModal.show = true;
                this.addModal.form.id = params.row.id;
                this.addModal.form.dicCode = params.row.dicCode;
                this.addModal.form.dicValValue = params.row.dicValValue;
                this.addModal.form.dicValCode = params.row.dicValCode;
                this.addModal.form.dicValDesc = params.row.dicValDesc;
            },
            submitDictionaryValue(name){
                 this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.addModal.closable = false;
                        this.addModal.loading = true;
                        let url = this.API.saveDictionaryValue;
                        this.service({
                            url: url,
                            data: {
                                'id':this.addModal.form.id,
                                'dicCode':this.addModal.form.dicCode,
                                'dicValValue':this.addModal.form.dicValValue,
                                'dicValCode':this.addModal.form.dicValCode,
                                'dicValDesc':this.addModal.form.dicValDesc
                            },
                            method: "post"
                        }).then(response => {
                            let data = response.data;
                            if(data.success == true){
                                this.tipMessage("info","提交成功");
                                this.addModal.closable = true;
                                this.addModal.loading = false;
                                this.addModal.show = false; 
                                this.searchDictionaryValue(1);
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
            deleteDictionaryValue(id){
                this.$Modal.confirm({
                    title: "警告",
                    content: '<p>确定要删除吗？</p>',
                    onOk: () => {
                        this.handleSpinShow();
                        this.service({
                            url: this.API.deleteDictionaryValue + "?id="+id,
                            method: "post"
                        }).then(response => {
                            this.handleSpinHide();
                            var data = response.data;
                            if(data.success){
                                this.tipMessage("info","删除成功");
                                this.searchDictionaryValue(1);
                            }else{
                                this.tipMessage("error",data.msg);
                            }
                        });  
                    }
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
            cancelDictionaryValue(name){
                this.$refs[name].resetFields();
                this.addModal.form.id = null;
            }           
        }
    }
</script>
