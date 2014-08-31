"use strict"

gulp = require("gulp")
$ = require("gulp-load-plugins")()
runSequence = require("run-sequence")
browserSync = require("browser-sync")
reload = browserSync.reload
exec = require("child_process").exec
spawn = require("child_process").spawn

AUTOPREFIXER_BROWSERS = [
  "ie >= 10"
  "ie_mob >= 10"
  "ff >= 30"
  "chrome >= 34"
  "safari >= 7"
  "opera >= 23"
  "ios >= 7"
  "android >= 4.4"
  "bb >= 10"
]
Notification = require("node-notifier")
notifier = new Notification()

# dirctory settings
src =
  css: [
    "assets/css/**/*.css"
    "!assets/css/all.css"
    "!assets/css/all.min.css"
    ]
  js: [
    "assets/js/**/*.js"
    "!assets/js/lib/**/*.js"
    "!assets/js/all.js"
    "!assets/js/all.min.js"
  ]
  lib: [
    "assets/js/lib/**/*.js"
    "!assets/js/lib/lib.js"
    "!assets/js/lib/lib.min.js"
  ]
  jade: [
    "src/jade/**/*.jade"
    "!src/jade/_layout/**/*.jade"
  ]
  stylus: [
    "src/styl/**/*.styl"
    "!src/styl/_module/**/*.styl"
  ]
  coffee: "src/coffee/**/*.coffee"
  
dest =
  js: "assets/js"
  lib: "assets/js/lib"
  css: "assets/css"
  html: "."

baseDir = "."  


# handler function
plumberWithNotify = ->
  $.plumber({errorHandler: $.notify.onError("<%= error.message %>")})

errorHandler = (error) ->
  notifier.notify({message: error.message, title: error.plugin})
  

gulp.task "jade", ->
  gulp.src(src.jade)
    # .pipe $.cached("jade")
    .pipe plumberWithNotify()
    .pipe $.jade(pretty: true)
    .pipe gulp.dest(dest.html)

# Automatically Prefix CSS
gulp.task "css", ->
  gulp.src(src.css)
    .pipe $.autoprefixer(AUTOPREFIXER_BROWSERS)
    .pipe gulp.dest(dest.css)

# Compile Any Other Stylus Files You Added (src/styl)
gulp.task "stylus", ->
  gulp.src(src.stylus)
    # .pipe $.cached("stylus")
    .pipe plumberWithNotify()
    .pipe $.stylus()
    .pipe $.autoprefixer(AUTOPREFIXER_BROWSERS)
    .pipe gulp.dest(dest.css)

# Compile Any Other Coffee Files You Added (src/coffee)
gulp.task "coffee", ->
  gulp.src(src.coffee)
    .pipe $.cached("coffee")
    .pipe plumberWithNotify()
    .pipe $.coffee()
    .pipe gulp.dest(dest.js)
    
gulp.task "optimize:css", ["stylus"], ->
  gulp.src(src.css)
    .pipe $.concat("all.css")
    .pipe gulp.dest(dest.css)
    .pipe $.minifyCss()
    .pipe $.rename( extname: ".min.css")
    .pipe gulp.dest(dest.css)

gulp.task "optimize:js", ["coffee"], ->
  gulp.src(src.js)
    .pipe $.concat("all.js")
    .pipe gulp.dest(dest.js)
    .pipe $.uglify()
    .pipe $.rename( extname: ".min.js")
    .pipe gulp.dest(dest.js)

gulp.task "optimize", ["optimize:css", "optimize:js"]

gulp.task "lib", ->
  gulp.src(src.lib)
    .pipe $.concat("lib.js")
    .pipe gulp.dest(dest.lib)
    .pipe $.uglify()
    .pipe $.rename( extname: ".min.js")
    .pipe gulp.dest(dest.lib)

gulp.task "hologram", (cb) ->
  exec("bundle exec hologram -c doc/hologram_config.yml", (err, stdout, stderr) ->
    stdout? $.util.log(stdout);
    stderr? $.util.log(stderr);
    cb(err);
  )  

# Watch Files For Changes & Reload
gulp.task "default", ->
  browserSync.init null,
    server:
      baseDir: [baseDir]
    notify: false
    host: "localhost"
  # gulp.watch ["src/styl/**/*.styl"], ["stylus", reload]
  # gulp.watch ["src/styl/**/*.styl"], ["optimize:css", reload]
  gulp.watch ["src/styl/**/*.styl"], ["optimize:css"]
  gulp.watch ["src/coffee/**/*.coffee"], ["coffee", reload]
  gulp.watch ["assets/css/all.css"], ["hologram", reload]
  gulp.watch ["src/jade/**/*.jade"], ["jade", reload]
  # gulp.watch ["styleguide/*.html"], reload
  # gulp.watch ["./*.html"], reload
