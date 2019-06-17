// 判断是否是空
export function isEmptyOrUndefined(obj){
    return (obj == '' || obj == null || obj == undefined || obj === 0 || obj.length == 0) ? true : false;
};

