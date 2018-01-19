var gulp = require('gulp');
var gutil = require('gulp-util');
var chalk = require('chalk');
var fs = require('fs');
var _ = require('underscore');
var path = require('path');
var amdOptimize = require("amd-optimize");
var concat = require('gulp-concat');
var rimraf = require('gulp-rimraf');
var uglify = require('gulp-uglify');
var through2 = require("through2");
var ejs = require("gulp-ejs");
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var runSequence = require('run-sequence');
// var imagemin = require('gulp-imagemin');
var zip = require('gulp-zip');
var shell = require('child_process');
var pkg = require('./package.json');
var merge = require("merge-stream");
var BUILD_TIMESTAMP = gutil.date(new Date(), "yyyymmddHHMMss");
var Utils = require("./utils");
var htmlmin = require('gulp-htmlmin');
var concatTGTpl = require('gulp-concat-tg-tpl');

pkg.build = BUILD_TIMESTAMP;

// 设置默认工作目录为./www
process.chdir("www");

// 获取env
var argv = process.argv.slice(2);
var env = "PRD";
(function() {
    if ((envIndex = argv.indexOf("-env")) != -1) {
        var envValue = argv[envIndex + 1];
        var envs = ["DEV", "FAT", "UAT", "PRD", "PRDTEST"];
        if (envValue && envs.indexOf(envValue) != -1) {
            env = envValue;
        }
    }
})();


var CONTEXT_PATH = "/invest";
if (env != "DEV") {
    switch(env){
        case "FAT":
            CONTEXT_PATH = "/invest";
            break;
        case "UAT":
            CONTEXT_PATH = "/invest";
            break;
        case "PRD":
            CONTEXT_PATH = "/invest";
            break;
        case "PRDTEST":
            CONTEXT_PATH = "/invest";
            break;
        default:
            CONTEXT_PATH = "/.";
    }
}


var Config = {
    src: ".",
    dest: "../dist",
    patch:"../patch",
    output: "../output",
    templates: "../templates"
};

_.extend(Config, {
    // 拷贝路径
    copy_src: [
        "!" + Config.src + "/less/**",
        "!" + Config.src + "/prototype/**",
        "!" + Config.src + "/test/**",
        "!" + Config.src + "/web-server.js",
        Config.src + "/**/*"
    ],
    copy_app: Config.src + '/modules/*.js',
    copy_dest: Config.dest,
    // 清空路径
    clean_src: Config.dest + '/*',
    // 清空路径
    clean_patch: Config.patch + '/*',
    //清楚无用文件
    clean_useless_file: [
        Config.dest + '/less',
        Config.dest + '/prototype',
        Config.dest + '/test',
        Config.dest + '/modules'
    ],
    // ejs源文件路径
    ejs_src: [
        Config.templates + "/**/*.ejs",
        "!" + Config.templates + "/include/**/*.ejs"
    ],
    ejs_dest: Config.dest,
    // 源码路径
    source_src: [
        Config.src + "/js*/**/*.js",
        Config.src + "/modules*/**/*.js",
        Config.src + "/lib*/**/*.js",
        '!' + Config.src + '/modules/investplus',
        '!' + Config.src + '/modules/zuhe'
    ],
    // 源码目标地址
    source_dest: Config.dest + "/src",
    // less文件地址
    less_src: Config.src + "/less/*.less",
    // less目标地址
    less_dest: Config.src + '/css',
    minifycss_src: Config.src + '/**/*.css',
    minifycss_dest: Config.dest,
    uglifyjs_src: [
        Config.dest + '/modules*/**/*.js',
        Config.dest + '/js*/**/*.js',
        Config.dest + '/lib*/require-config.js'
    ],
    concat_modules_src: Config.src + "/modules",
    concat_exclude_modules: ['!' + Config.src + "/modules/investplus", '!' + Config.src + "/modules/zuhe"],
    concat_modules_dest: Config.dest + "/modules",
    uglifyjs_dest: Config.dest,
    archive_src: Config.dest + '/**/*',
    // require优化排除公共库
    optimize_exclude:[
    ],
    // require优化排除公共库
    exclude:{
        "zepto": 'empty:',
        'highcharts': 'empty:',
        'highchartsMore': 'empty:',
        'Chart': 'empty:',
        'highstock': 'empty:',
        'vue': 'empty:'
    }
})

var handleEnv = function() {
    return through2.obj(function(file, enc, cb) {
        if (file.path.indexOf("version.js") != -1) {
            file.contents = new Buffer(file.contents.toString().replace("new Date().getTime()", '"' + BUILD_TIMESTAMP + '"'));
        }
        return cb(null, file);
    });
}

/*
 * 清空目标工程目录
 */
gulp.task('clean', function() {
    return gulp.src(Config.clean_src, {
            read: false
        })
        .pipe(rimraf({
            force: true
        }));
});

gulp.task('clean_useless_file', function() {
    return gulp.src(Config.clean_useless_file, {
            read: false
        })
        .pipe(rimraf({
            force: true
        }));
});

/*
 * 拷贝文件到目标工程目录
 */
gulp.task('copy', function() {
    return gulp.src(Config.copy_src)
        .pipe(handleEnv())
        .pipe(gulp.dest(Config.dest));
});
gulp.task('copy_app', function() {
    return gulp.src(Config.copy_app)
        .pipe(handleEnv())
        .pipe(gulp.dest(Config.dest + '/modules'));
});
/*
 * 拷贝源文件文件到目标工程目录
 */
gulp.task('source', function() {
    return gulp.src(Config.source_src)
        .pipe(gulp.dest(Config.source_dest));
});
/*
 * 编译ejs页面
 */
gulp.task("ejs", function() {
    return gulp.src(Config.ejs_src)
        .pipe(ejs({
            ctx: CONTEXT_PATH,
            _build: {
                pkg: pkg,
                version: pkg.version,
                ts: BUILD_TIMESTAMP,
                env: env
            },
            Utils: new Utils(env),
            _: _,
            data: {},
            delimiter: "@"
        }, {
            root: __dirname + "/templates"
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(Config.ejs_dest));
})

/*
 * 编译less
 */
gulp.task('less', function() {
    return gulp.src(Config.less_src)
        .pipe(less({
            Config: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest(Config.less_dest));
});

/*
 * 编译压缩css
 */
gulp.task('minifycss', function() {
    return gulp.src(Config.minifycss_src)
        .pipe(minifyCSS())
        .pipe(gulp.dest(Config.minifycss_dest));
});

// /*
// * 图片压缩
// */
// gulp.task("imagemin",function(){
//  return gulp.src(Config.src+'/images/*')
//         .pipe(imagemin({
//             progressive: true,
//             optimizationLevel:3,
//             svgoPlugins: [{removeViewBox: false}]
//         }))
//         .pipe(gulp.dest(Config.dest+'/images'));
// })

/*
 * 编译压缩js
 */
gulp.task('uglifyjs', function() {
    return gulp.src(Config.uglifyjs_src)
        .pipe(handleEnv())
        .pipe(uglify({
            // output: {
                // max_line_len: 120
            // }
        }).on("error", gutil.log))
        .pipe(gulp.dest(Config.uglifyjs_dest));
});
// /*
//  * 编译压缩js
//  */
// gulp.task('concat_modules', function() {
//     var files = fs.readdirSync(Config.concat_modules_src);
//     var dirs = [];
//     var sequence = [];
//     _.each(files, function(fn) {
//         var fname = Config.concat_modules_src + "/"+fn;
//         var stat = fs.lstatSync(fname);
//         if (stat.isDirectory() == true) {
//             dirs.push(fname)
//         }
//         sequence.push(
//             gulp.src(fname+"/**/*.js")
//             .pipe(concat("main.js"))
//             .pipe(gulp.dest(Config.concat_modules_dest+"/"+fn))
//         )
//     })
//     return merge.apply(this,sequence);
//     // return gulp.src(Config.uglifyjs_src)
//     //     .pipe(concat({
//     //         output: {
//     //             max_line_len: 120
//     //         }
//     //     }).on("error", gutil.log))
//     //     .pipe(gulp.dest(Config.uglifyjs_dest));
// });


gulp.task('concatEjsTpl2Js', function() {
    return gulp.src([
            Config.dest + '/modules/**/*.js'
        ])
        .pipe(concatTGTpl({srcPath: Config.templates, prefix: '/invest', minify: true, basepath: Config.dest}))
        .pipe(gulp.dest(Config.dest + ''))
});

/*
 * require js 优化
 */
gulp.task("js_optimize", function() {
    var sequence = [];
    sequence.push(
        // 优化common
        gulp.src(Config.src + "/js/**/*.js")
        .pipe(amdOptimize("C", {
            configFile: Config.src + "/lib/require-config.js",
            paths: Config.exclude,
            exclude: Config.optimize_exclude
        }))
        .pipe(handleEnv())
        // 合并
        .pipe(concat("common.js"))
        // .pipe(uglify().on("error", gutil.log))
        // 输出
        .pipe(gulp.dest(Config.dest + "/js/common"))
    );

    var files = fs.readdirSync(Config.concat_modules_src);
    var dirs = [];
    var sequence = [];
    _.each(files, function(fn) {
        var fname = Config.concat_modules_src + "/" + fn;
        var stat = fs.lstatSync(fname);

        var concatModulesIndexs;
        if (Config.concat_exclude_modules.indexOf('!' + fname) === -1) {
            if (stat.isDirectory() == true) {
                 concatModulesIndexs = fs.readdirSync(fname + '/');
                _.each(concatModulesIndexs, function(indexName) {
                    if (/\.js$/.test(indexName)) {
                        sequence.push(
                            // 优化common
                            gulp.src(Config.src + "/modules/**/*.js")
                            .pipe(amdOptimize("modules/" + fn + "/" + indexName.substring(0, indexName.indexOf('.js')), {
                                configFile: Config.src + "/lib/require-config.js",
                                paths: Config.exclude,
                                exclude: Config.optimize_exclude.concat(["C"])
                            }))
                            .pipe(handleEnv())
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
    })
    return merge.apply(this, sequence);
});

/*
 * 打包zip
 */
gulp.task('archive', function() {
    return gulp.src(Config.archive_src)
        .pipe(zip(pkg.name + "_v_" + pkg.version.replace(/\./g, "_") + "_" + env.toLowerCase() + "_" + BUILD_TIMESTAMP + '.zip'))
        .pipe(gulp.dest(Config.output));
});

// gulp.task('archive', function () {
//     return gulp.src('src/*')
//         .pipe(zip('archive.zip'))
//         .pipe(gulp.dest('dist'));
// });
gulp.task('watch', function() {
    gulp.watch(Config.src+"/less/**/*.less", ['less','copy']);
    gulp.watch(Config.src+"/**/*.js", ['copy']);
    gulp.watch("../**/*.ejs", ['ejs']);
});


/*
 * 部署到测试环境
 */
gulp.task('deploy', function() {
});

gulp.task('clean_patch', function() {
  return gulp.src(Config.clean_patch, { read: false })
    .pipe(rimraf({ force: true }));
});

/*
* 拷贝文件到目标工程目录
*/
gulp.task('copy_patch', function() {
    var filelist = fs.readFileSync("../patchlist.txt","UTF-8");
    filelist = filelist.replace(/\r/g,"");
    var list = filelist.split("\n");
    var rs = [];
    var obj = {};
    _.each(list,function(item){
        if(/^modules/.test(item)){
            var items = item.split("/");
            item = [items[0],items[1],"**/*"].join("/");
        }
        obj[item]=true;
    })
    for(var key in obj){
        console.log(key);
        rs.push(key);
    }
    rs.push("js/version.js");
    return gulp.src(rs,{cwd:Config.dest,base:Config.dest})
        .pipe(gulp.dest(Config.patch));
});


/*
* 开始构建
*/
gulp.task('patch', function (callback) {
      runSequence(
        "clean_patch",
        "copy_patch",
        function (error) {
          if (error) {
            console.log(error.message);
          } else {
            console.log('RELEASE FINISHED SUCCESSFULLY');
          }
          callback(error);
     });
});

gulp.task('copy_patch_2_common', function() {
    return gulp.src(Config.patch+"/**/*",{cwd:Config.patch,base:Config.patch})
        .pipe(gulp.dest(Config.output + '/common'));
})

/*
 * 清空output目录
 */
gulp.task('clean_output', function() {
    return gulp.src(Config.output, {
            read: false
        })
        .pipe(rimraf({
            force: true
        }));
});

/*
 * 把dist拷贝到output目录下
 */
gulp.task('copy_output', function() {
    return gulp.src(Config.dest+"/**/*",{cwd:Config.dest,base:Config.dest})
        .pipe(gulp.dest(Config.output+"/differ/"+env.toLowerCase()));
});

/**
 * 创建各环境空目录（临时）
 */
gulp.task('mk_output', function() {
  fs.exists(Config.output, function (exists) {
    if (!exists) {
      fs.mkdir(Config.output);
    }
  });

  fs.exists(Config.output + '/differ', function (exists) {
    if (!exists) {
      fs.mkdir(Config.output + '/differ');
    }
  });

  fs.exists(Config.output+"/differ/"+env.toLowerCase(), function (exists) {
    if (!exists) {
      fs.mkdir(Config.output+"/differ/"+env.toLowerCase());
    }
  });
});

/**
 * 创建公共目录
 */
gulp.task('mk_common', function () {
    fs.mkdir(Config.output + '/common');
});

/**
 * 把dist拷贝到common目录下（临时）
 */
gulp.task('copy_common', function () {
  return gulp.src(Config.dest+"/**/*",{cwd:Config.dest,base:Config.dest})
      .pipe(gulp.dest(Config.output + '/common'));
});

/*
 * 打包zip
 */
gulp.task('archive_output', function() {
    return gulp.src(Config.output+"/**/*")
        .pipe(zip('invest.zip'))
        .pipe(gulp.dest('../' + Config.output));
});

/*
 * 开始构建
 */
gulp.task('build', function(callback) {
    runSequence(
        "clean",
        'less',
        "copy",
        'clean_useless_file',
        'ejs',
        'source',
        'js_optimize',//这个运行时需要10几分钟，暂时注释掉
        'copy_app',
        // 'uglifyjs', 
        'concatEjsTpl2Js',
        'patch',
        //'minifycss',
        //'archive',
        function(error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('RELEASE FINISHED SUCCESSFULLY');
            }
            callback(error);
        });
});


gulp.task('copyzuhe', function() {
    return gulp.src(path.resolve(__dirname, './distzuhe/**/*'))
        .pipe(gulp.dest(path.resolve(__dirname, './dist')));
});