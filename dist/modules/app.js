define(["zepto"],function(
  $
  ){
  var controller = {};
  var services = {};
  var app = {
    bootstrap:function(){
      var self = this;
      $(function(){
        //拦截，用于自动执行登陆打断原有应该执行的回调
        var data, autoFunName, autoFunData;
        try {
          data = sessionStorage.getItem('TG_AUTO_FUN');
          data = JSON.parse(data);
          autoFunName = new RegExp('[&,?]autoFunName=([^\\&]*)', 'i').exec(location.search)[1];
          if (data && data[autoFunName]) {
            autoFunData = data[autoFunName];
            delete data[autoFunName];
            sessionStorage.setItem('TG_AUTO_FUN', JSON.stringify(data));
            window[autoFunName] && window[autoFunName](autoFunData);
          }
        } catch(e) {}
        var ctrlName = $("[data-controller]").attr("data-controller");
        if(!ctrlName){
          alert("找不到controller,请在body上声明data-controller");
          return;
        }
        if(!controller[ctrlName]){
          alert("找不到controller,请声明Controller");
          return;
        }
                controller[ctrlName]();
      })
    },
    controller:function(module,init){
      controller[module] = init;
      return app;
    }
  }
  return app;
});