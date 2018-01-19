
var gulp = require('gulp');
var gutil = require('gulp-util');

//删除
var rimraf = require('gulp-rimraf');

// 设置路径
var Config = {
  src: '.',
  dest: '../dist',
};

_.extend(Config, {
    //清空目录
    clean_dest: Config.dest + '/*'
});

// 1. 清除目录
gulp.task('clean', function(){
    return gulp.src();
});

// 2. less编译
gulp.task('less', function(){

});

// 3. 拷贝
gulp.task('copy', function(){

});

// 4. ejs编译
gulp.task('ejs', function(){

});

// 5. css 压缩
gulp.task('css', function(){

});

// 6. js 优化、合并
gulp.task('js_opitimaze', function(){

});

// 7. 构建
gulp.task('default', ['clean']);

// 8. 监听自动编译
gulp.task('watch', function(){

});