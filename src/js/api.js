let API = function(config){
    let api = {
        "login": config.lmOrange + '/login/goLogin',
        "judgeLogin": config.lmOrange + '/login/judgeLogin',
        "quitLogin": config.lmOrange + '/login/quitLogin',
        "validateCode": config.lmOrange + '/login/validateCode',
        "employeePageList": config.lmOrange + '/orangeblog/employee/employeePageList',
        "saveEmployee": config.lmOrange + '/orangeblog/employee/saveEmployee',
        "disableEmployee": config.lmOrange + '/orangeblog/employee/disableEmployee',
        "imagePageList": config.lmOrange + '/orangeblog/image/imageBlogPageList',
        "imageDetail": config.lmOrange + '/orangeblog/image/imageDetail',
        "saveImage": config.lmOrange + '/orangeblog/image/saveImageBlog',
        "disableImage": config.lmOrange + '/orangeblog/image/deleteImageBlog',
        "uploadToOss": config.lmOrange + '/orangeblog/aliOss/uploadToOss',
        "deleteFromOss": config.lmOrange + '/orangeblog/aliOss/deleteFromOss',
        "updateImageBlogStatus": config.lmOrange + '/orangeblog/image/updateImageBlogStatus',
        "dictionaryPageList": config.lmOrange + '/orangeblog/dictionary/dictionaryPageList',
        "saveDictionary": config.lmOrange + '/orangeblog/dictionary/saveDictionary',
        "dictionaryValuePageList": config.lmOrange + '/orangeblog/dictionaryValue/dictionaryValuePageList',
        "saveDictionaryValue": config.lmOrange + '/orangeblog/dictionaryValue/saveDictionaryValue',
        "getAllDictionaryList": config.lmOrange + '/orangeblog/dictionary/getAllDictionaryList',
        "deleteDictionary": config.lmOrange + '/orangeblog/dictionary/deleteDictionary',
        "deleteDictionaryValue": config.lmOrange + '/orangeblog/dictionaryValue/deleteDictionaryValue'
    };
    return api;
}

export default {API}