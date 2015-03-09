fs            = require 'fs'
path          = require 'path'
through       = require 'through2'
gutil         = require 'gulp-util'
temporary     = require 'temporary'
del           = require 'del'
child_process = require 'child_process'
{spawn}       = child_process

PLUGIN_NAME = 'gulp-iconutil'

module.exports = (options = {}) ->
  icons = []

  bufferContents = (file, encoding, callback) ->
    if file.isStream()
      @emit 'error', new gutil.PluginError PLUGIN_NAME, 'Streams are not supported'
      return callback()

    icons.push file
    callback()

  endStream = (callback) ->
    tmpDir = new temporary.Dir()
    iconsetPath = path.join tmpDir.path, 'tmp.iconset'
    iconset = fs.mkdirSync(iconsetPath)
    outputPath = path.join tmpDir.path, 'tmp.icns'

    for icon in icons
      child_process.execFileSync '/bin/cp', [icon.path, iconsetPath]

    program = spawn 'iconutil', ['-c', 'icns', iconsetPath]
    program.stdout.on 'end', =>
      icns = new gutil.File
        cwd: icons[0].cwd
        base: icons[0].base
        path: path.join icons[0].base, 'output.icns'
        contents: fs.readFileSync outputPath
      @push icns
      del tmpDir.path, force: true, -> callback()

  through.obj bufferContents, endStream
