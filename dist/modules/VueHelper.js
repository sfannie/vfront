/*
  vue app核心
  路由、模板功能的实现
*/
define([
  "zepto"
],function($){
    var vueApp = {
      getTemplate:function(url,callback){
            window._TEMPLATE = window._TEMPLATE || {};
            var tmpl
            if(!!(tmpl = window._TEMPLATE[url])){
                callback(tmpl);
            }else{
                $.ajax({
                    url:url,
                    data:{v:_app.version},
                    type:"get",
                    dataType:"text",
                    beforeSend:function(){},
                    complete:function(){},
                    success:function(tmpl){
                        window._TEMPLATE[url] = tmpl;
                        callback(tmpl);
                    }
                });
            }
        }
    }
    return vueApp;
});