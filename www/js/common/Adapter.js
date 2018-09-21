define([
    'zepto',
    'js/common/constant'
], function($, Constant) {

   var isAndroid = navigator.userAgent.match(/android/ig),
       isIos = navigator.userAgent.match(/iphone|ipod/ig),
       isIpad = navigator.userAgent.match(/ipad/ig),
       weixin = navigator.userAgent.match(/MicroMessenger/ig),
       isNative = navigator.userAgent.match(/AYLCAPP/ig) && !navigator.userAgent.match(/anydoor/ig);

  var Adapter = window.Adapter = {
      isAndroid: isAndroid,
      isIos: isIos,
      isIpad: isIpad,
      weixin: weixin,
      isNative: isNative,
      frameCall: function(u) {
          setTimeout(function() {
              var iframe = document.createElement("iframe");
              var _src = u;
              iframe.src = _src;
              iframe.style.display = "none";
              document.body.appendChild(iframe);
              iframe.parentNode.removeChild(iframe);
              iframe = null;
          }, 5);
      },
      call: function(funcName, params, callback) {
          var rdm = Math.random().toString().substr(2),
              globalFuncName = "globalCallback" + rdm,
              iframeName = "nativeFuncIframe" + rdm,
              strParams = "";
          window[globalFuncName] = function() {
              if (typeof callback === "function")
                  callback.apply(this, arguments);
              delete window[globalFuncName];
          }
          if (params && typeof params === "object") {
              params["callback"] = "window." + globalFuncName;
          } else {
              params = {
                  callback: "window." + globalFuncName
              };
          }
          try {
              strParams = JSON.stringify(params);
          } catch (e) {
              strParams = '{"error":"params data error!"}';
          }
          var u = 'ane://' + funcName + '?' + encodeURIComponent(strParams);
          this.frameCall(u); 
      },
      back: function(){
        Adapter.call('back');
      }
  };

  return Adapter;


});