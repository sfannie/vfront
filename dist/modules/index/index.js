define([
    'zepto',
    'vue',
    'iScroll'
  ], function($, Vue, IScroll){

    var app = new Vue({
        data: function(){
            return {
              iScroll: null,
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
            $('#wrapper').height($(window).height() - $('#header').height());
        },
        mounted: function(){
            if(!this.iScroll){
                this.iScroll = new IScroll('#wrapper', {
                  scrollbars: true,
                  mouseWheel: true,
                  interactiveScrollbars: true,
                  shrinkScrollbars: 'scale',
                  fadeScrollbars: true
                });
            }else{
              this.iScroll.refresh();
            }
        },
        methods: {

        }
    }).$mount("#app");

  });