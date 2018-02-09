
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

//同步执行任务
var runSequence = require('run-sequence');

//文件遍历
var fs = require('fs');
var path = require('path');

//构建requireJS模块
var amdOptimize = require("amd-optimize");



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
    cssmin_dest: Config.dest + '/css/',

    //js压缩源路径
    uglifyjs_src: [
        Config.dest + '/modules*/**/*.js',
        Config.dest + '/js*/**/*.js',
        Config.dest + '/libs*/require-config.js'
    ],
    uglifyjs_dest: Config.dest,

    //js合并源路径
    concatjs_modules_src: Config.src + '/www/modules',
    concatjs_modules_dest: Config.dest + '/modules',
    concat_exclude_modules: [],
    //优化排除公共库
    optimize_exclude: [],
    //排除公共库
    exclude: {
        'zepto': 'empty:',
        'Chart': 'empty:',
        'vue': 'empty:'
    }

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
      .pipe(ejs({ msg: 'ejs OK!'}, {}, { ext: '.html' }))
      .pipe(gulp.dest(Config.ejs_dest));
});

// 5. css 压缩
gulp.task('cssmin', function(){
    gulp.src(Config.cssmin_src)
        .pipe(cssmin())
        .pipe(gulp.dest(Config.cssmin_dest));
});

// 6. js压缩
gulp.task('jsmin', function(){
    gulp.src(Config.uglifyjs_src)
        .pipe(uglify({})
        .on("error", gutil.log))
        .pipe(gulp.dest(Config.uglifyjs_dest));
});

// 6. js 合并
gulp.task('js_optimize', function(){
    var sequence = [];
    sequence.push(
        gulp.src(Config.src + '/www/js/**/*.js')
        .pipe(amdOptimize('C', {
            configFile: Config.src + '/www/libs/require-config.js',
            paths: Config.exclude,
            exclude: Config.optimize_exclude
        }))
        .pipe(concat('common.js'))
        .pipe(gulp.dest(Config.dest + '/js/common'))
    );

    var files = fs.readdirSync(Config.concatjs_modules_src);
    var dirs = [];
    sequence = [];

    _.each(files, function(fn) {
        var fname = Config.concatjs_modules_src + '/' + fn;
        var stat = fs.lstatSync(fname);
        var concatModulesIndexs;
        if (Config.concat_exclude_modules.indexOf('!' + fname) === -1) {
            if (stat.isDirectory() == true) {
                 concatModulesIndexs = fs.readdirSync(fname + '/');
                _.each(concatModulesIndexs, function(indexName) {
                    if (/\.js$/.test(indexName)) {
                        sequence.push(
                            // 优化common
                            gulp.src(Config.src + "/www/modules/**/*.js")
                            .pipe(amdOptimize("modules/" + fn + "/" + indexName.substring(0, indexName.indexOf('.js')), {
                                configFile: Config.src + "/www/libs/require-config.js",
                                paths: Config.exclude,
                                exclude: Config.optimize_exclude.concat(["C"])
                            }))
                            //.pipe(handleEnv())
                            // 合并
                            .pipe(concat(indexName))
                            // .pipe(uglify().on("error", gutil.log))
                            // 输出
                            .pipe(gulp.dest(Config.concat_modules_dest + "/" + fn))
                        )
                    }
                });
            }
        }
    });

    return merge.apply(this, sequence);

});

// 7. 构建
gulp.task('default', function(cb){
    runSequence(
        'clean',
        ['less', 'copy', 'ejs', 'cssmin', 'jsmin'],
        'watch',
        cb
    );
});

// 8. 监听自动编译
gulp.task('watch', function(){

});