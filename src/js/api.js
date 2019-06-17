let API = function(config){
    let api = {
        "login": config.lmOrange + '/login/goLogin',
        "judgeLogin": config.lmOrange + '/login/judgeLogin',
        "quitLogin": config.lmOrange + '/login/quitLogin',
        "employeePageList": config.lmOrange + '/orangeblog/employee/employeePageList',
        "saveEmployee": config.lmOrange + '/orangeblog/employee/saveEmployee',
        "disableEmployee": config.lmOrange + '/orangeblog/employee/disableEmployee',
        "imagePageList": config.lmOrange + '/orangeblog/image/imageBlogPageList',
        "imageDetail": config.lmOrange + '/orangeblog/image/imageDetail',
        "saveImage": config.lmOrange + '/orangeblog/image/saveImageBlog',
        "disableImage": config.lmOrange + '/orangeblog/image/deleteImageBlog',
        "uploadToOss": config.lmOrange + '/orangeblog/aliOss/uploadToOss',
        "deleteFromOss": config.lmOrange + '/orangeblog/aliOss/deleteFromOss',
        "updateImageBlogStatus": config.lmOrange + '/orangeblog/image/updateImageBlogStatus'
    };
    return api;
}

export default {API}