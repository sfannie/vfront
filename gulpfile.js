
var gulp = require('gulp');
var gutil = require('gulp-util');
var _ = require('underscore');

//删除文件
var rimraf = require('gulp-rimraf');

// less文件处理
var less = require('gulp-less');

//ejs文件处理
var ejs = require('gulp-ejs');

//css压缩
var cssmin = require('gulp-minify-css');

//js合并
var concat = require('gulp-concat');
//js压缩
var uglify = require('gulp-uglify');



// 设置路径
var Config = {
  src: ".",
  dest: "dist",
  templates: 'templates'
};

_.extend(Config, {
    //清空目录
    clean_dest: Config.dest + '/*',

    //less文件源路径
    less_src: Config.src + '/www/less/*.less',
    //less文件目标路径
    less_dest: Config.src + '/www/css/',

    //拷贝源路径
    copy_src: [
      '!' + Config.src + '/www/less/**',
      '!' + Config.src + '/www/server.js',
      Config.src + '/www/**/*'
    ],
    copy_dest: Config.dest + '/',

    //ejs源文件路径
    ejs_src: [
        Config.templates + "/**/*.ejs",
        "!" + Config.templates + "/include/**/*.ejs"
    ],
    ejs_dest: Config.dest + '/',

    //css文件压缩路径
    cssmin_src: Config.dest +'/css/*',
    cssmin_dest: Config.dest + '/css/'

    //优化js路径
});

// 1. 清除目录
gulp.task('clean', function(cb){
    return gulp.src(Config.clean_dest, {
      read: false
    }).pipe(rimraf({
        force: true
    }));
});

// 2. less编译
gulp.task('less', function(){
    gulp.src(Config.less_src)
        .pipe(less())
        .pipe(gulp.dest(Config.less_dest));
});

// 3. 拷贝
gulp.task('copy', function(){
    gulp.src(Config.copy_src)
        .pipe(gulp.dest(Config.copy_dest));
});

// 4. ejs编译
gulp.task('ejs', function(){
    gulp.src(Config.ejs_src)
      .pipe(ejs({ msg: 'Hello Gulp!'}, {}, { ext: '.html' }))
      .pipe(gulp.dest(Config.ejs_dest));
});

// 5. css 压缩
gulp.task('cssmin', function(){
    gulp.src(Config.cssmin_src)
        .pipe(cssmin())
        .pipe(gulp.dest(Config.cssmin_dest));
});

// 6. js 优化、合并
gulp.task('js_opitimaze', function(){

});

// 7. 构建
gulp.task('default', ['clean', 'less', 'copy', 'ejs', 'cssmin']);

// 8. 监听自动编译
gulp.task('watch', function(){

});