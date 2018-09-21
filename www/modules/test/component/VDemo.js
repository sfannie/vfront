define([
    'zepto',
    'vue'
  ], function($, Vue){

    var List = {
        extends: '',
        mixins: '',
        props: {},
        data: function() {
          return {
            list: [
              {
                title: '滚动的特性',
                brief: '一些（网站）滚动的效果是如此令人着迷但你却不知该如何实现，本文将为你揭开它们的神秘面纱。我们将基于最新的技术与规范为你介绍最新的 JavaScript 与 CSS 特性，将使你的页面滚动更平滑、美观且性能更好。著作权归作者所有。'
              }
            ]
          };
        },
        computed: {},
        created: function(){

        },
        watch: {},
        methods: {
            tap: function(index){
                //alert(index);
            }
        },
        template: '#list-tpl'
    };

    return List;

});