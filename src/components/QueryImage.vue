<template>
    <div>
        <div class="min_tools">
            <div class="tools" ref="tools" :class="{'is_fixed' : isFixed}">
                <Input  placeholder="请输入标题..." v-model="searchForm.title" clearable class="inp"/>
                <Select placeholder="请输入类别..." v-model="searchForm.category" clearable filterable class="inp">
                    <Option v-for="item in categoryList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Button type="warning" custom-icon="iconfont icon-sousuo" @click="searchImage(1)">Search</Button>
                <Button type="warning" custom-icon="iconfont icon-jiajianzujianjiahao" @click="openAddModel">Add</Button>
            </div>
        </div>
        <Divider orientation="left"><h4>查询结果</h4></Divider>
            <Drawer  :closable="false" v-model="drawerFlag" :width="85" > 
                <Divider orientation="left"><h4>填写信息</h4></Divider>
                <div>
                    <Form :model="formItem" :label-width="80">
                        <FormItem label="标题：" >
                            <Input v-model="formItem.title" placeholder="请输入标题..." class="form_inp"/>
                            <Button style="float:right;" type="warning" @click="submitImage" :style="{width:'100px'}">
                                <span v-if="formItem.id == null || formItem.id == ''">保存草稿</span>
                                <span v-if="formItem.id != null && formItem.id != ''">更新草稿</span>
                            </Button>
                        </FormItem>
                        <FormItem label="分类：" >
                            <Cascader :data="cascaderList" v-model="categorys" class="form_inp"></Cascader>
                        </FormItem>
                        <FormItem label="概要：" >
                            <Input v-model="formItem.outline" placeholder="请输入内容概要..." />
                        </FormItem>
                        <FormItem label="图片：">
                            <div class="demo-upload-list" v-if="formItem.imageUrl != null && formItem.imageUrl != ''">
                                <img :src="formItem.imageUrl" >
                                <div class="demo-upload-list-cover">
                                    <Icon type="ios-eye-outline" @click.native="handleView()"></Icon>
                                    <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
                                </div>
                            </div>
                            <Upload
                                :show-upload-list="showUploadList"
                                :format="['jpg','jpeg','png']"
                                style="width:7em; display: inline-block;"
                                :on-success="uploadSuccess"
                                :on-error="uploadFail"
                                :on-remove="removeUpload"
                                :headers="headers"
                                type="drag"
                                name="multipartFile"
                                :action="uploadToOss">
                                <div style="height:58px;line-height: 58px; ">
                                    <Icon type="ios-camera" size="30"></Icon>
                                </div>
                            </Upload>
                    
                        </FormItem>
                        <FormItem label="正文：">
                                <mavon-editor ref=md v-model="markdownEdit.value" :toolbars="toolbars" style="min-height:400px;" :ishljs="false"
                                    @change="changeData" @imgAdd="$imgAdd" @imgDel="$imgDel" :boxShadow="false"/>
                        </FormItem>
                    </Form>
                </div>
            </Drawer>
        <Modal title="View Image" v-model="visible">
            <img :src="itemUrl" v-if="visible" style="width: 100%">
        </Modal>
        <div class="content">
            <Table :loading="imageTable.loading" :columns="imageTable.columns" ref="selection" :data="imageTable.datas" ></Table>
            <div style="margin: 10px 10px 0 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="imageTable.page.total" :page-size="imageTable.page.pageSize" :current="imageTable.page.pageIndex" @on-change="searchImage"
                        @on-page-size-change="handlePageSize" show-sizer show-total show-elevator/>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
form .form_inp{
    width:500px;
}
.table table{
    min-width: 1600px;
}
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
.content {
    padding: 5px;
    height: 100%;
    overflow:hidden;
}
/* 上传图片的样式 */
.demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
}
.demo-upload-list img{
    width: 100%;
    height: 100%;
}
.demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
    display: block;
}
.demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}
</style>
<script>
import {setCookie,getCookie,delCookie} from '../js/cookieUtil.js'
import {isEmptyOrUndefined} from '../js/util'
import $ from 'jquery'
export default {
        data () {
            return {
                itemUrl:'',
                showUploadList: true,
                visible: false,
                uploadToOss: this.API.uploadToOss,
                markdownEdit:{
                    value: '# 你好'
                },
                img_file:{},
                headers:{},
                formItem: {
                    id: null,
                    title: '',
                    outline: '',
                    content: '',
                    markdownText:'',
                    imageUrl: null,
                    categoryName: '',
                    categoryId: '',
                    parentCategoryName: '',
                    parentCategoryId: ''
                },
                toolbars:{
                    bold: true, // 粗体
                    italic: true, // 斜体
                    header: true, // 标题
                    underline: true, // 下划线
                    strikethrough: true, // 中划线
                    mark: true, // 标记
                    superscript: true, // 上角标
                    subscript: true, // 下角标
                    quote: true, // 引用
                    ol: true, // 有序列表
                    ul: true, // 无序列表
                    link: true, // 链接
                    imagelink: true, // 图片链接
                    code: true, // code
                    table: true, // 表格
                    fullscreen: true, // 全屏编辑
                    readmodel: true, // 沉浸式阅读
                    htmlcode: true, // 展示html源码
                    help: true, // 帮助
                    undo: true, // 上一步
                    redo: true, // 下一步
                    trash: false, // 清空
                    save: false, // 保存（触发events中的save事件）
                    navigation: true, // 导航目录
                    alignleft: true, // 左对齐
                    aligncenter: true, // 居中
                    alignright: true, // 右对齐
                    subfield: true, // 单双栏模式
                    preview: true, // 预览
                },           
                drawerFlag: false,
                isFixed: false,
                offsetTop:0,
                offsetWidth:0,
                searchForm:{
                    title:'',
                    category:''
                },
                categoryList:[
                    {
                        value: 'front',
                        label: '前端'
                    },
                    {
                        value: 'back',
                        label: '后端',
                    },
                    {
                        value: 'base',
                        label: '基础',
                    },
                    {
                        value: 'lz',
                        label: '栗子生活',
                    }
                ],
                categorys:[],
                cascaderList:[],
                imageTable:{
                    loading:false,
                    columns:[
                        {
                            "title":"标题",
                            "key":"title"
                        },
                        {
                            "title":"概要",
                            "key":"outline",
                            tooltip:true
                        },
                        {
                            "title":"类别",
                            "key":"categoryName",
                            width:100
                        },
                        {
                            "title":"图片",
                            "key":"imageUrl",
                            tooltip:true
                        },
                        {
                            "title":"状态",
                            "key":"statusName",
                            width:80
                        },
                        {
                            "title":"操作",
                            "key":"",
                            width:260,
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
                                                this.editImage(params.row);
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
                                                this.disableImage(params.row.id);
                                            }
                                        }
                                    }, 'Disa'),
                                    h('Button', {
                                        props: {
                                            type: 'warning',
                                            size: 'default',
                                            ghost: true,
                                            'custom-icon': 'iconfont icon-fenxiang'
                                        },
                                        style: {
                                            padding: '5px 10px 5px 10px'
                                        },
                                        on: {
                                            click: () => {
                                                this.updateImageBlog(params.row.id);
                                            }
                                        }
                                    }, 'Share')   
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
        created(){
            let token = getCookie("token");
            let refreshToken = getCookie("refreshToken");
            let jsonStr = '{"Authorization":"'+token+'","Refresh_Token":"'+refreshToken+'"}';
            this.headers = JSON.parse(jsonStr);
        },
        mounted(){
            this.initBlogCategoryList();
            window.addEventListener('scroll', this.handleScroll);
            this.$nextTick(function(){
                this.offsetTop = $(".tools").offset().top;
            });
            this.searchImage(1);
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
                this.imageTable.page.pageSize = pageSize;
                this.searchImage(1);
            },
            handleView () {
                this.itemUrl = this.formItem.imageUrl;
                this.visible = true;
            },
            handleRemove () {
                this.uploadUrl = '';
            },
            initBlogCategoryList(){
                this.service({
                    url: this.API.blogCategoryList,
                    method: "post"
                }).then(response => {
                    var data = response.data.data;
                    this.cascaderList = data;
                });  
            },
            searchImage(page){
                this.imageTable.loading = true;
                this.service({
                    url: this.API.imagePageList + '?pageIndex=' + page + '&pageSize=' + this.imageTable.page.pageSize,
                    data: {
                        'title':this.searchForm.title,
                        'categoryId':this.searchForm.category
                    },
                    method: "post"
                }).then(response => {
                    var data = response.data.data;
                    this.imageTable.datas = data.records;
                    this.imageTable.page.total = data.total;
                    this.imageTable.loading = false;
                });  
            },
            openAddModel(){
                this.resetImage();
                this.drawerFlag = true;
            },
            editImage(row){
                this.resetImage();
                this.drawerFlag = true;
                this.formItem.id = row.id;
                this.markdownEdit.value = row.markdownText;
                this.formItem.imageUrl = row.imageUrl;
                this.formItem.title = row.title;
                this.formItem.outline = row.outline;
                this.formItem.categoryName = row.categoryName;
                this.formItem.categoryId = row.categoryId;
                this.formItem.parentCategoryId = row.parentCategoryId;
                this.formItem.parentCategoryName = row.parentCategoryName;
                this.categorys.push(row.parentCategoryId);
                this.categorys.push(row.categoryId);
            },
            disableImage(id){
                if(isEmptyOrUndefined(id)){
                    this.tipMessage("warning", "删除的id不存在");
                }else{
                    this.$Modal.confirm({
                        title: "警告",
                        content: '<p>确定要删除数据吗？</p>',
                        onOk: () => {
                            this.handleSpinShow();
                            this.service({
                                url: this.API.disableImage + "?id="+id,
                                method: "post"
                            }).then(response => {
                                let data = response.data;
                                if(data.success == true){
                                    this.tipMessage("info","操作成功");
                                    this.searchImage(1);
                                }else{
                                    this.tipMessage("error",data.msg);
                                }
                                this.handleSpinHide();
                            });    
                        }
                    });
                }
            },
            updateImageBlog(id){
                if(isEmptyOrUndefined(id)){
                    this.tipMessage("warning", "id不存在");
                }else{
                    this.$Modal.confirm({
                        title: "警告",
                        content: '<p>确定是否提交数据？提交的数据会立即生效。</p>',
                        onOk: () => {
                            this.handleSpinShow();
                            this.service({
                                url: this.API.updateImageBlogStatus + "?id="+id,
                                method: "post"
                            }).then(response => {
                                let data = response.data;
                                if(data.success == true){
                                    this.tipMessage("info","提交成功");
                                    this.searchImage(1);
                                }else{
                                    this.tipMessage("error",data.msg);
                                }
                                this.handleSpinHide();
                            });    
                        }
                    });
                }
            },
            // 全局loading开启
            handleSpinShow () {
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
            handleSpinHide () {
                this.$Spin.hide();
            },
            // markdown中上传图片
            $imgAdd(pos, $file){
                this.img_file[pos] = $file;
                 // 第一步.将图片上传到服务器.
                var formdata = new FormData();
                formdata.append('multipartFile', $file);
                this.handleSpinShow();
                this.service({
                    url: this.API.uploadToOss,
                    data: formdata,
                    headers: { 'Content-Type': 'multipart/form-data' },
                    method: "post"
                }).then(response => {
                    let data = response.data;
                    if(data.success == true){
                        var url = data.data;
                        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                        this.$refs.md.$img2Url(pos, url);
                    }else{
                        this.tipMessage("error",data.msg);
                    }
                    this.handleSpinHide();
                })
            },
            // 删除markdown中的图片
            $imgDel(pos){
                this.service({
                    url: this.API.deleteFromOss + '?key=' + pos[0].name,
                    method: "post"
                })
                delete this.img_file[pos]
            },
            uploadSuccess(response){
                let data = response.data;
                if(response.success == true){
                    this.formItem.imageUrl = data;
                    this.showUploadList  = false;
                }
            },
            uploadFail(error){
                this.tipMessage("error", "上传失败");
            },
            removeUpload(response, file){
                let data = response.response.data;
                this.$axios.post('http://127.0.0.1:8888/upload/deleteUploadImg?id=' + data.id).then(rs => {
                    this.formItem.imageUrl = null;
                    this.tipMessage("info", "删除成功");
                });  
            },
            changeData(value, render) {
                this.formItem.content = render;
                this.formItem.markdownText = value;
            },
            submitImage(){
                // 提交之前的校验
                if(!this.checkForm()){
                    return;
                }
                this.formItem.parentCategoryId = this.categorys[0];
                this.formItem.categoryId = this.categorys[1];
                 // 遍历数组
                for(let i = 0; i < this.cascaderList.length ; i++){
                    if(this.formItem.parentCategoryId == this.cascaderList[i].value){
                        this.formItem.parentCategoryName = this.cascaderList[i].label;
                        for(let j = 0; this.cascaderList[i].children.length; j++){
                            if(this.formItem.categoryId == this.cascaderList[i].children[j].value){
                                this.formItem.categoryName = this.cascaderList[i].children[j].label;
                                break
                            }
                        }
                        break;
                    }
                }
                this.handleSpinShow();
                this.service({
                    url: this.API.saveImage,
                    data: {
                        'id':this.formItem.id,
                        'title':this.formItem.title,
                        'outline':this.formItem.outline,
                        'content':this.formItem.content,
                        'markdownText':this.formItem.markdownText,
                        'categoryName':this.formItem.categoryName,
                        'categoryId':this.formItem.categoryId,
                        'parentCategoryName':this.formItem.parentCategoryName,
                        'parentCategoryId':this.formItem.parentCategoryId,
                        'imageUrl': this.formItem.imageUrl
                    },
                    method: "post"
                }).then(res => {
                    this.drawerFlag = false;
                    this.handleSpinHide();
                    let data = res.data;
                    if(data.success == true){
                        this.tipMessage("info","保存成功");
                        this.searchImage(1);
                    }else{
                        this.tipMessage("error",data.msg);
                    }
                });
            },
            resetImage(){
                this.formItem.id = null;
                this.formItem.markdownText = '';
                this.formItem.imageUrl = '';
                this.formItem.title = '';
                this.formItem.outline = '';
                this.formItem.content = '';
                this.formItem.categoryName = '';
                this.formItem.categoryId = '';
                this.markdownEdit.value  = '';
                this.formItem.parentCategoryId = '';
                this.formItem.parentCategoryName = '';
                this.categorys = [];
            },
            checkForm(){
                if(isEmptyOrUndefined(this.formItem.title)){
                    this.tipMessage("warning", "标题不能为空");
                    return false;
                }
                if(this.categorys.length < 1){
                    this.tipMessage("warning", "请选择分类");
                    return false;
                }
                // if(isEmptyOrUndefined(this.formItem.categoryId)){
                    
                // }
                if(isEmptyOrUndefined(this.formItem.outline)){
                    this.tipMessage("warning", "请填写概要");
                    return false;
                }
                if(isEmptyOrUndefined(this.formItem.imageUrl)){
                    this.tipMessage("warning", "请先上传附件");
                    return false;
                }
                if(isEmptyOrUndefined(this.formItem.content)){
                    this.tipMessage("warning", "请填写正文");
                    return false;
                }
                return true;
            }
        }
    }
</script>
