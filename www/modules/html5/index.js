define([
    'zepto',
    'vue', 
    'modules/common/testCommon',
    'modules/html5/component/VList',
    'iScroll'
  ], function($, Vue, C, VList, IScroll){

    var app = new Vue({

        data: function(){
            return {
              title: "html5 新元素",
              iScroll: null
            };
        },

        components: {
          'v-list': VList
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