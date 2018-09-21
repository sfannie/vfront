define([
    'zepto',
    'vue', 
    'modules/common/testCommon'
  ], function($, Vue, C){

    var app = new Vue({

        data: function(){
            return {
              title: "Hello World",
              brief: 'Have a good time!',
               list: [{
                  id:'01',
                  title: 'Hello World!',
                  date: '2017-09-11'
               },{
                  id:'01',
                  title: 'Hello World!',
                  date: '2017-09-11'
               }]
            };
        },
        created: function(){

        },
        method: function(){

        }
    }).$mount("#app");

  });