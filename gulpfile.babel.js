
require("babel-register");

import gulp from 'gulp';
import gutil from 'gulp-util';
import _  'underscore';
//const app = express();

//删除文件
import rimraf from 'gulp-rimraf';

// less文件处理
import less from 'gulp-less';

//ejs文件处理
import ejs form 'gulp-ejs';

//html文件压缩
import htmlmin from 'gulp-htmlmin';

//css压缩
import cssmin form 'gulp-minify-css';

//js合并
import concat from 'gulp-concat';
//js压缩
import uglify form 'gulp-uglify';

//同步执行任务
import runSequence from 'run-sequence';

//文件遍历
import fs from 'fs';
import path from 'path';

//构建requireJS模块
import amdOptimize from "amd-optimize";

// 设置路径
const Config = {
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
        .pipe(ejs({ 
            msg: 'ejs OK!',
            ctx: '',
            _build: {
                pkg: '',
                version: '',
                ts: '',
                cdn: '',
                env: 'DEV'
            },
            Utils: '',
            _: _,
            data: {},
            delimiter: "@"
            }, {
                root: __dirname + "/templates"
            }))
        //.pipe(htmlmin({collapseWhitespace: true}))
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


// 7. 构建
gulp.task('default', function(cb){
    runSequence(
        'clean',
        ['less', 'copy', 'ejs', 'cssmin', 'jsmin'],
        //'watch',
        function(error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('BUILD OUTPUT FINISHED SUCCESSFULLY');
            }
            callback(error);
        });
    );
});

// 8. 监听自动编译
gulp.task('watch', function(){

});