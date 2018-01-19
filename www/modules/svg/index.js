define([
    'zepto',
    'vue', 
    'modules/common/svgCommon',
    'iScroll'
  ], function($, Vue, C, IScroll){

    var app = new Vue({

        data: function(){
            return {
              title: "SVG",
              iScroll: null
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
            drawLine: function(){
              
            }
        }
    }).$mount("#app");

  });