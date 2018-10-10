define([
    'zepto',
    'vue', 
    'modules/common/svgCommon',
    'iScroll',
    'modules/svg/component/vChart'
  ], function($, Vue, C, IScroll,VChart){

    var app = new Vue({

        data: function(){
            return {
              title: "SVG",
              iScroll: null,
              wHeight: $(window).height() - $('#header').height()
            };
        },

        components: {
          'v-chart': VChart
        },

        created: function(){
          $('#wrapper').height(this.wHeight);
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