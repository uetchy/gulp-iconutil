{expect} = require 'chai'
fs       = require 'fs'
gulp     = require 'gulp'
gutil    = require 'gulp-util'
{File}   = gutil
array    = require 'stream-array'
assert   = require 'stream-assert'
iconutil = require '../lib/gulp-iconutil'

iconFiles = ->
  array([
    new File
      cwd: __dirname,
      base: __dirname + '/fixtures/',
      path: __dirname + '/fixtures/icon_512x512.png',
      contents: new Buffer(fs.readFileSync(__dirname + '/fixtures/icon_512x512.png'))
    new File
      cwd: __dirname,
      base: __dirname + '/fixtures/',
      path: __dirname + '/fixtures/icon_512x512@2x.png',
      contents: new Buffer(fs.readFileSync(__dirname + '/fixtures/icon_512x512@2x.png'))
  ])

describe 'gulp-iconutil', ->
  describe 'iconutil()', ->
    it 'should throw error when icnsName is missing', ->
      expect(iconutil).to.throw(Error)

    it 'should throw error', (done) ->
      stream = iconutil 'app.icns'
      stream
        .pipe assert.length(0)
        .pipe assert.end(done)
      stream.write new File()
      stream.end()

    it 'should create icns', (done) ->
      icnsName = 'custom.icns'
      iconFiles()
        .pipe iconutil(icnsName)
        .pipe assert.first (data) ->
          expected = fs.readFileSync __dirname + '/fixtures/output.icns'
          expect(data.contents).to.eql(expected)
          expect(data.relative).to.eql(icnsName)
        .pipe assert.end(done)
