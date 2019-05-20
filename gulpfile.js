let gulp = require("gulp");
let ts = require("gulp-typescript");
let tsProject = ts.createProject("tsconfig.json");
let sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const debug = require('gulp-debug');
let sourcemaps = require('gulp-sourcemaps');
const minify = require('gulp-minify');
const del = require('del')
let rename = require("gulp-rename");
let fs = require('fs');
var connect = require('gulp-connect');
let lambdaNow = require('./modules/taskflower.js')
let lambdaAWS = require('./modules/taskowl.js')
importComponent =require('./modules/protectComponents.js')
protectComponent =require('./modules/protectComponents.js')
let taskNowCopy = require('./modules/replace:deploy:now.js')
let shadowRoot = require('./modules/shadowRoot.js')
gulpModule = require('gulp-module');
let replaceCssGitHub = require('./modules/replace:css:GitHub.js')
inject = require('gulp-inject-string');
var uglify = require('gulp-uglify');
var webpackConfig = require("./webpack.config.js");
let webpack = require("webpack");
let WebpackDevServer = require("webpack-dev-server");
let stream = require('webpack-stream');
var log = require('fancy-log');
let path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { rules, plugins, loaders } = require('webpack-atoms');
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
var PluginError = require('plugin-error');
const WorkboxPlugin = require('workbox-webpack-plugin');
var gls = require('gulp-live-server');
let livereload = require('gulp-livereload');
var exec = require('child_process').exec;
// var plugins = require('gulp-load-plugins')();
let nodemon = require('gulp-nodemon')
// var gulpif = require('gulp-if');
let manifest = require('./modules/manifest.js')
let imports = require('./modules/import.js')
let spawn   = require('child_process').spawn,
    bunyan

let functionHandler = 'handler'
let obj = {}
obj['path'] = {}
obj['path']['path-old'] = 'src/test-dev'
obj['path']['path-new'] = 'src/test-dev'
obj['name'] = 'Sergey'
obj['component'] = 'waves-auth'
obj['type'] = 'module'
obj['server'] = 'now'
obj['dir'] = 'frontend-server'
obj['ts'] = false
obj['webpack'] = false
obj['host'] = {}
obj['host']['GitHub'] = false
obj['host']['Firebase'] = false
obj['host']['Now'] = false
obj['host']['module'] ={}
obj['host']['module']['auth'] = true
obj['path'] = `./${obj['server']}:${obj['component']}`
obj['pathComponents'] = `./src/html/components`
obj['destPathComponents'] = `${obj['path']}/client/static/html/components`
obj['src'] = `./src/${obj['component']}`
obj['react'] = {}
obj['react']['path'] ={}
obj['react']['components'] = {}
obj['react']['path']['src'] = `./src/html/react/waves-auth/components`
obj['react']['path']['dest'] =  `${obj['path']}/client/static/html/react`
obj['react']['components']['Navbar'] = 'Navbar'
obj['react']['components']['import'] = []
obj['react']['components']['import'].push('Navbar')
const isDevelopement = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

function callback(error, data) {
    console.log(error);
    console.log(data);
}
if(obj['host']['module']['auth'] === true){

    gulp.task(`clean:${obj['component']}`, function () {
        return del(`./${obj['path']}`)
    });
    gulp.task(`server:${obj['component']}:copy`, function () {
        return  gulp.src(`./src/${obj['component']}/**`)
            .pipe(gulp.dest(`./${obj['path']}`));
    });
    gulp.task(`client:${obj['component']}:copy.mjs`, function () {
        return  gulp.src(`${obj['pathComponents']}/${obj['component']}/${obj['component']}.mjs`)
            .pipe(imports[functionHandler](events, obj, callback))
            .pipe(gulp.dest(`${obj['destPathComponents']}/${obj['component']}`));
    });
    gulp.task(`client:${obj['component']}:copy.html`, function () {
        return  gulp.src(`${obj['pathComponents']}/${obj['component']}/${obj['component']}.html`)
            .pipe(gulp.dest(`${obj['destPathComponents']}/${obj['component']}`));
    });
    gulp.task(`client:${obj['component']}:copy.external`, function () {
        return  gulp.src(`${obj['pathComponents']}/${obj['component']}/external/${obj['component']}-external.html`)
            .pipe(gulp.dest(`${obj['destPathComponents']}/${obj['component']}/external`));
    });
    gulp.task(`styles:${obj['component']}:light`, function () {
        return gulp.src(`${obj['pathComponents']}/${obj['component']}/light/**`)
            // .pipe(gulpif(isDevelopement, sourcemaps.init()))
            .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
            .pipe(debug({title: 'sass:'}))
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            // .pipe(gulpif(isDevelopement,sourcemaps.write()))
            .pipe(debug({title: 'prefix:'}))
            .pipe(gulp.dest(`${obj['destPathComponents']}/${obj['component']}/light`))
    });
    gulp.task(`styles:${obj['component']}:shadow`, function () {
        return gulp.src(`${obj['pathComponents']}/${obj['component']}/shadow/**`)
            // .pipe(gulpif(isDevelopement, sourcemaps.init()))
            .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
            .pipe(debug({title: 'sass:'}))
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            // .pipe(gulpif(isDevelopement,sourcemaps.write()))
            .pipe(debug({title: 'prefix:'}))
            .pipe(gulp.dest(`${obj['destPathComponents']}/${obj['component']}/shadow`))
    });
    gulp.task(`client:${obj['component']}:copy`,  gulp.parallel(
        `client:${obj['component']}:copy.mjs`,
        `client:${obj['component']}:copy.html`,
        `client:${obj['component']}:copy.external`,
        `styles:${obj['component']}:light`,
        `styles:${obj['component']}:shadow`
        ));
    gulp.task(`import:${obj['component']}:client`, gulp.parallel(`client:${obj['component']}:copy`));
    gulp.task(`connect:${obj['component']}:server`, function (done){
         nodemon({
            // nodemon: require('nodemon'),
             script: `${obj['path']}/server.mjs`
            , verbose: true
            , env: {'NODE_ENV': 'development'}
            , exec: 'nodemon --experimental-modules'
            , watch: './'
            , ext: 'js coffee'
            , done: done

        }).on('readable', function() {

            // free memory
            bunyan && bunyan.kill()

            bunyan = spawn('./node_modules/bunyan/bin/bunyan', [
                '--output', 'short',
                '--color'
            ])

            bunyan.stdout.pipe(process.stdout)
            bunyan.stderr.pipe(process.stderr)

            this.stdout.pipe(bunyan.stdin)
            this.stderr.pipe(bunyan.stdin)
        });
    })
    gulp.task(`connect:${obj['component']}:client`, function () {
        return  connect.server({
            name: `${obj['component']}`,
            root: `${obj['path']}/client`,
            port: 5001,
            livereload: true
        });
    });
    gulp.task(`server:${obj[`component`]}`, function() {
        return  gulp.src(`${obj['src']}/**`)
            .pipe(gulp.dest(`./${obj['path']}`));
    })
    gulp.task(`client:${obj[`component`]}`, function() {
        return gulp.src('./src/z.config.mjs')
            .pipe(stream( {
                mode: 'production',
                cache: true,
                name: 'component',
                devtool: 'eval',
                resolve: {
                    extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx']
                },
                output: {
                    filename: `[name].bundle.mjs`,
                    chunkFilename: `[name].bundle.mjs`,
                    library: 'bundle',
                },
                module: {
                    rules: [
                        rules.js(),
                        rules.images(),
                        rules.css(),
                    ]
                },
                optimization: {
                    splitChunks: {
                        chunks: 'all'
                    },
                    minimizer: [
                        new UglifyJsPlugin({
                            cache: true,
                            parallel: true,
                            uglifyOptions: {
                                output: {
                                    comments: false
                                }
                            }
                        })
                    ]
                },
                plugins: [
                    plugins.loaderOptions(),
                    new WorkboxPlugin.GenerateSW({

                        exclude: [/\.(?:png|jpg|jpeg|svg)$/],

                        runtimeCaching: [{

                            urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

                            handler: 'CacheFirst',

                            options: {

                                cacheName: 'images',
                                expiration: {
                                    maxEntries: 10,
                                },
                            }

                        }]

                    }),
                    new CompressionPlugin(
                        {
                            test: /\.js/,
                            include: /\/includes/,
                            exclude: /\/excludes/,
                            cache: true
                        }
                    ),
                    new CopyWebpackPlugin([
                        {
                            from: path.resolve(__dirname, './src/manifest'),
                            to: './',
                            ignore: ['*.mjs']
                        }
                    ]),
                    new CopyWebpackPlugin([
                        {
                            from: path.resolve(__dirname, './src/static'),
                            to: './static',
                            ignore: ['.*']
                        }
                    ]),
                    new HtmlWebpackPlugin({
                        // filename: config.build.index,
                        title: process.env.npm_package_description,
                        template: './src/index.html',
                        filename: './index.html',
                        inject: true,
                        minify: {
                            removeComments: true,
                            collapseWhitespace: true,
                            removeAttributeQuotes: true
                        },
                        chunksSortMode: 'dependency',
                    })
                ],
            }))
            .pipe(gulp.dest(`${obj['path']}/client`));
    });
    gulp.task(`protect:${obj['component']}:client`, function () {
        return  gulp.src('./src/html/components/index.html')
            .pipe(protectComponent[functionHandler]('replace',obj, callback))
            .pipe(gulp.dest(`${obj['destPathComponents']}`));
    });
    let events = {}
    events['slot00'] = obj['component']
    events['header'] = `header`
    gulp.task(`manifest:${obj['component']}:client`, function () {
        return  gulp.src('./src/manifest/z.config.mjs')
            .pipe(manifest[functionHandler](events, obj, callback))
            .pipe(gulp.dest(`./src`));
    });
    gulp.task(`inject:${obj['component']}:client`, function(){
        return  gulp.src(`${obj['path']}/client/index.html`)
            .pipe(inject.before('<noscript', `<${obj['component']}></${obj['component']}>`))
            .pipe(gulp.dest(`${obj['path']}/client`));
    });


    gulp.task(`import:${obj[`component`]}:react-${obj['react']['components']['NavBar']}`, function() {
        return  gulp.src(`${obj['react']['path']['src']}/layout/${obj['react']['components']['Navbar']}.js`)
            .pipe(gulp.dest(`./${obj['react']['path']['dest']}/${obj['component']}`));
    })
    gulp.task('killAll', function (cb) {
        exec('killall -9 node', function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    });
    gulp.task(`watch:${obj[`component`]}:client`, function (callback) {

        gulp.watch(`./src/manifest/z.config.mjs`, gulp.series(`manifest:${obj['component']}:client`,`client:${obj[`component`]}`,`inject:${obj['component']}:client`))
        gulp.watch(`${obj['pathComponents']}/${obj[`component`]}/${obj[`component`]}.mjs`, gulp.series(`client:${obj['component']}:copy.mjs`))

        callback()
    });
    gulp.task(`watch:${obj[`component`]}:server`, function (callback) {

        gulp.watch(`${obj['src']}/**`, gulp.series(`server:${obj['component']}:copy`) )

        callback()
    });

    gulp.task('import', gulp.series(`import:${obj[`component`]}:react-${obj['react']['components']['NavBar']}`));


    gulp.task('client', gulp.series(`manifest:${obj['component']}:client`, `client:${obj[`component`]}`, `import:${obj['component']}:client`, `protect:${obj['component']}:client`, `inject:${obj['component']}:client`, gulp.parallel(`connect:${obj['component']}:client`, `watch:${obj[`component`]}:client`)));

    gulp.task('server', gulp.series(`server:${obj[`component`]}`,gulp.parallel(`connect:${obj['component']}:server`,`watch:${obj[`component`]}:server`)));

    gulp.task('default', gulp.series(`clean:${obj['component']}`,gulp.parallel('client', 'import')));


    gulp.task('dev', gulp.series('default'))

}else{

}
