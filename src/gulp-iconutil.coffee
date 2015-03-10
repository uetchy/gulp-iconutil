fs            = require 'fs'
path          = require 'path'
through       = require 'through2'
temporary     = require 'temporary'
del           = require 'del'
gutil         = require 'gulp-util'
{PluginError} = gutil
{File}        = gutil
child_process = require 'child_process'
{spawn}       = child_process

PLUGIN_NAME = 'gulp-iconutil'

module.exports = (icnsName, options = {}) ->
  unless icnsName
    throw new PluginError PLUGIN_NAME, 'Missing icns name'
  icons = []

  bufferContents = (file, encoding, callback) ->
    if file.isNull()
      callback()
      return

    if file.isStream()
      @emit 'error', new PluginError PLUGIN_NAME, 'Streams are not supported'
      callback()
      return

    icons.push file
    callback()

  endStream = (callback) ->
    unless icons.length
      callback()
      return

    tmpDir = new temporary.Dir()
    iconsetPath = path.join tmpDir.path, 'tmp.iconset'
    iconset = fs.mkdirSync(iconsetPath)
    outputPath = path.join tmpDir.path, 'tmp.icns'

    for icon in icons
      fs.writeFileSync path.join(iconsetPath, path.basename(icon.path)), icon.contents

    program = spawn '/usr/bin/iconutil', ['-c', 'icns', iconsetPath]
    program.stdout.on 'end', =>
      icns = new File
        cwd: icons[0].cwd
        base: icons[0].base
        path: path.join icons[0].base, icnsName
        contents: fs.readFileSync outputPath
      @push icns
      del tmpDir.path, force: true, -> callback()

  through.obj bufferContents, endStream
