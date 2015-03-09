gulp     = require 'gulp'
plumber  = require 'gulp-plumber'
coffee   = require 'gulp-coffee'

gulp.task 'build', ->
  gulp.src 'src/**/*.coffee'
    .pipe plumber()
    .pipe coffee bare: true
    .pipe gulp.dest './'

gulp.task 'watch', ['build'], ->
  gulp.watch 'src/**/*.coffee', ['build']

gulp.task 'default', ['watch']
