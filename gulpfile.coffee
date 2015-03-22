gulp     = require 'gulp'
plumber  = require 'gulp-plumber'
coffee   = require 'gulp-coffee'
mocha    = require 'gulp-mocha'

gulp.task 'build', ->
  gulp.src 'src/**/*.coffee'
    .pipe plumber()
    .pipe coffee bare: true
    .pipe gulp.dest 'lib'

gulp.task 'test', ['build'], ->
  gulp.src 'test/**/*.test.coffee', read: false
    .pipe mocha()

gulp.task 'watch', ['build'], ->
  gulp.watch 'src/**/*.coffee', ['test']

gulp.task 'default', ['watch']
