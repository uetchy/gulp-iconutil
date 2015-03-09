{expect} = require 'chai'
fs       = require 'fs'
gulp     = require 'gulp'
gutil    = require 'gulp-util'
array    = require 'stream-array'
assert   = require 'stream-assert'
iconutil = require '../'

iconFiles = ->
  array([
    new gutil.File
      cwd: __dirname,
      base: __dirname + '/fixtures/',
      path: __dirname + '/fixtures/icon_512x512.png',
      contents: new Buffer(fs.readFileSync(__dirname + '/fixtures/icon_512x512.png'))
    new gutil.File
      cwd: __dirname,
      base: __dirname + '/fixtures/',
      path: __dirname + '/fixtures/icon_512x512@2x.png',
      contents: new Buffer(fs.readFileSync(__dirname + '/fixtures/icon_512x512@2x.png'))
  ])

describe 'gulp-iconutil', ->
  describe 'iconutil()', ->
    it 'should create icns', (done) ->
      iconFiles()
        .pipe iconutil()
        .pipe gulp.dest './'
        .pipe assert.end(done)
