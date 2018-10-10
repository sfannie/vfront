define([
    'zepto',
    'vue',
    'iScroll',
    'd3'
  ], function($, Vue, IScroll, D3){

    var app = new Vue({
        data: function(){
            return {
              iScroll: null,
              data: {
                'pie': [1,2,3,4,6,8,14]
              }
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
            draw: function(type, e){
                if (type == 'pie') {
                    $(e.target).after('<canvas style="height:2rem;" id="canvas-'+ e.target.id+'"></canvas>');
                    this.drawPie("#canvas-"+e.target.id, this.data[type]);
                }
                if(type = 'text') {
                  $(e.target).after('<p id="demo-'+ e.target.id+'"></p>');
                  var dataset = ["I like dogs","I like cats","I like snakes"];
                  this.drawText("#demo-"+e.target.id, dataset);
                }
            },
            drawText: function(id, data){
              var o = D3.select(id);
              o.data(data).text(function(d, i) {
                return d;
              });
            },
            drawPie: function(id,data){
              var canvas = document.querySelector(id);
              var ctx = canvas.getContext("2d");
              var width = canvas.width,
                  height = canvas.height,
                  radius = Math.min(width, height)/2;

              var colors = [
                "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
                "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
              ];

              var arc = D3.arc()
                  .outerRadius(radius - 10)
                  .innerRadius(0)
                  .padAngle(0.03)
                  .context(ctx);

              var pie = D3.pie();

              var arcs = pie(data);

              ctx.translate(width / 2, height / 2);

              ctx.globalAlpha = 0.5;
              arcs.forEach(function(d, i) {
                ctx.beginPath();
                arc(d);
                ctx.fillStyle = colors[i];
                ctx.fill();
              });

              ctx.globalAlpha = 1;
              ctx.beginPath();
              arcs.forEach(arc);
              ctx.lineWidth = 1.2;
              ctx.stroke();
            }
        }
    }).$mount("#app");

  });