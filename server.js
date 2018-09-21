
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var ejs = require('ejs'),
    _ = require('underscore'),
    Utils = require('./utils'),
    pkg = require('./package.json');

var path = require('path'),
    gutil = require('gulp-util');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
  
//静态页面托管
app.use('/www', express.static('www'));
app.use('/images', express.static('www/images'));
app.use('/modules', express.static('www/modules'));

//路径
var CONTEXT_PATH = "/www",

//构建时间
BUILD_TIMESTAMP = gutil.date(new Date(), "yyyymmddHHMMss"),

//环境
env = "DEV";

pkg.build = BUILD_TIMESTAMP;

//设置模板路径
app.set('views', path.join(__dirname, 'templates'));

//设置自定义模板
app.engine('ejs', function() {
  ejs.renderFile(arguments[0], {
    ctx: CONTEXT_PATH,
    _build: {
        pkg: pkg,
        version: pkg.version,
        ts: BUILD_TIMESTAMP,
        env: env
    },
    Utils: new Utils(env),
    _: _,
    data: {}
  }, arguments[1], arguments[2]);
});

//设置模板引擎
app.set('view engine', 'ejs');
ejs.delimiter = '@';

//app.engine('ejs', ejs.__express);

var request = require('request');

//匹配所有html文件
app.use('/*.html', function(req, res) {
  res.render(req.params[0]);
});

var server = app.listen(8899, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});