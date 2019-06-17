export default{
    install(Vue,options) {
       Vue.prototype.tipMessage = function (type,msg) {
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
        }
        Vue.prototype.confirmMessage = function (type,msg) {
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
        }    
    }   
}