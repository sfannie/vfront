define([
    'zepto',
    'vue'
  ], function($, Vue){

    var List = {
        template: '#list-tpl',
        data: function() {
          return {
            list: [
              {
                title: 'details和summary'
              }
            ]
          };
        },
        created: function(){

        },
        mothods: {

        }
    };

    return List;

});