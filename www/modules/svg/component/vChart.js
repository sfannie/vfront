define([
    'zepto',
    'vue', 
    'modules/common/svgCommon',
    'snap'
  ], function($, Vue, C, Snap){

      var M = {
          template: '<div id="chart-svg"></div>',
          props: ['wHeight'],
          data: function(){
            return {
              w: 0,
              h: 0
            }
          },
          created: function(){
              
          },
          mounted: function(){
            var self = this;
            $('#chart-svg').height($('#wrapper').height())
            this.w = $('#chart-svg').width();
            this.h = $('#chart-svg').height();
            var svg_width = this.w, svg_height = this.h;
            var xc = this.w/5, i=0;

            var svg = Snap(svg_width,svg_height).attr({
              fill: "#ffffff"
            });
            var paper = svg.paper;

            //折线
            var g1 = paper.g();
            var data1 = [3.56,-7.45,-3.78,null,-1.65], data1_new = [];
            var y1_0 = 220;
            var x1 = [];
            for (i=0; i<5; i++) {
                if(data1[i]!==null) {
                    x1.push((i+1/2)*xc);
                    data1_new.push(data1[i]);
                }
            }

            for(i=0;i<data1_new.length; i++) {
                var point = paper.circle(x1[i],data1_new[i]*20+y1_0,10).attr({
                  fill: "#ff8000"
                });

                g1.add(point);

                if(i<data1_new.length-1) {
                  console.log(i);
                  var line = paper.line(x1[i],data1_new[i]*20+y1_0,x1[i+1],data1_new[i+1]*20+y1_0).attr({
                    stroke: "#ff8000",
                    strokeWidth: 5
                  });
                  g1.add(line);
                }
                
            }

            //曲线
            var g2 = paper.g();
            var data2 = [3115.64,3085.5,2988.3, null,3085.3], data2_new = [];
            var x2 = [];
            for(i=0; i<5;i++) {
              if(data2[i]!== null) {
                x2.push((i+1/2)*xc);
                data2_new.push(data2[i]);
              }
            }
            var bgf = paper.gradient("L(0, 0, 0, 300)#000-#f00:25-#fff");
            var path2 = paper.path('M100,300 Q200,50 500,300 T700,100').attr({
              fill: bgf,
              stroke: 'red',
              strokeWidth: 5
            });
            g2.add(path2);

            //柱图
            var data3 = [3015,2536,1245,3025,1025];
            var g3 = paper.g();
            
            for(i= 0; i<data3.length; i++) {
                var y = data3[i]/30>50?data3[i]/30:60;
                var a = i>0?2:0;
                var rect = paper.rect(i*xc+a, this.h-y, xc-a, y, 10).attr({
                  fill: "#648dc2"
                });
                var text = paper.text(i*xc+20+a, this.h-20, data3[i]+'亿').attr({
                  fill: "#fff"
                });
                g3.add(rect,text);
            }
            

            $('#chart-svg').append(svg.node);

          },
          methods: {

          }
      };

      return M;
  });