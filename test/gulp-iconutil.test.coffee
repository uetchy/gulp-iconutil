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
      base: __dirname + '/fixtures/app.iconset',
      path: 'icon_512x512.png',
      contents: new Buffer(fs.readFileSync(__dirname + '/fixtures/app.iconset/icon_512x512.png'))
    new File
      cwd: __dirname,
      base: __dirname + '/fixtures/app.iconset',
      path: 'icon_512x512@2x.png',
      contents: new Buffer(fs.readFileSync(__dirname + '/fixtures/app.iconset/icon_512x512@2x.png'))
    new File
      cwd: __dirname,
      base: __dirname + '/fixtures/app.iconset',
      path: 'icon_256x256.png',
      contents: new Buffer(fs.readFileSync(__dirname + '/fixtures/app.iconset/icon_256x256.png'))
    new File
      cwd: __dirname,
      base: __dirname + '/fixtures/app.iconset',
      path: 'icon_256x256@2x.png',
      contents: new Buffer(fs.readFileSync(__dirname + '/fixtures/app.iconset/icon_256x256@2x.png'))
    new File
      cwd: __dirname,
      base: __dirname + '/fixtures/app.iconset',
      path: 'icon_128x128.png',
      contents: new Buffer(fs.readFileSync(__dirname + '/fixtures/app.iconset/icon_128x128.png'))
    new File
      cwd: __dirname,
      base: __dirname + '/fixtures/app.iconset',
      path: 'icon_128x128@2x.png',
      contents: new Buffer(fs.readFileSync(__dirname + '/fixtures/app.iconset/icon_128x128@2x.png'))
    new File
      cwd: __dirname,
      base: __dirname + '/fixtures/app.iconset',
      path: 'icon_32x32.png',
      contents: new Buffer(fs.readFileSync(__dirname + '/fixtures/app.iconset/icon_32x32.png'))
    new File
      cwd: __dirname,
      base: __dirname + '/fixtures/app.iconset',
      path: 'icon_32x32@2x.png',
      contents: new Buffer(fs.readFileSync(__dirname + '/fixtures/app.iconset/icon_32x32@2x.png'))
    new File
      cwd: __dirname,
      base: __dirname + '/fixtures/app.iconset',
      path: 'icon_16x16.png',
      contents: new Buffer(fs.readFileSync(__dirname + '/fixtures/app.iconset/icon_16x16.png'))
    new File
      cwd: __dirname,
      base: __dirname + '/fixtures/app.iconset',
      path: 'icon_16x16@2x.png',
      contents: new Buffer(fs.readFileSync(__dirname + '/fixtures/app.iconset/icon_16x16@2x.png'))
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
          expected = fs.readFileSync __dirname + '/fixtures/app.icns'
          expect(data.contents).to.deep.equal(expected)
          expect(data.relative).to.eql(icnsName)
        .pipe assert.end(done)
