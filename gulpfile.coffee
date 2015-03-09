gulp     = require 'gulp'
plumber  = require 'gulp-plumber'
coffee   = require 'gulp-coffee'
iconutil = require './'

gulp.task 'build', ->
  gulp.src 'src/**/*.coffee'
    .pipe plumber()
    .pipe coffee bare: true
    .pipe gulp.dest './'

gulp.task 'watch', ['build'], ->
  gulp.watch 'src/**/*.coffee', ['build']
