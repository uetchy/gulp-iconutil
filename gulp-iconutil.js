const fs = require('fs')
const { join, basename } = require('path')
const { spawn } = require('child_process')
const through = require('through2')
const temporary = require('temporary')
const del = require('del')
const { PluginError, File } = require('gulp-util')

const PLUGIN_NAME = 'gulp-iconutil'

module.exports = function iconUtil(icnsName) {
  if (!icnsName) {
    throw new PluginError(PLUGIN_NAME, 'Missing icns name')
  }
  const icons = []

  const bufferContents = function(file, encoding, callback) {
    if (file.isNull()) {
      return callback()
    }

    if (file.isStream()) {
      this.emit(
        'error',
        new PluginError(PLUGIN_NAME),
        'Streams are not supported'
      )
      return callback()
    }

    icons.push(file)
    callback()
  }

  const endStream = function(callback) {
    if (!icons.length) {
      return callback()
    }

    const tmpDir = new temporary.Dir()
    const iconsetPath = join(tmpDir.path, 'tmp.iconset')
    const outputPath = join(tmpDir.path, 'tmp.icns')

    fs.mkdirSync(iconsetPath)

    for (const icon of icons) {
      fs.writeFileSync(join(iconsetPath, basename(icon.path)), icon.contents)
    }

    const program = spawn('/usr/bin/iconutil', ['-c', 'icns', iconsetPath])
    program.stdout.on('end', () => {
      const icns = new File({
        cwd: icons[0].cwd,
        base: icons[0].base,
        path: join(icons[0].base, icnsName),
        contents: fs.readFileSync(outputPath),
      })
      this.push(icns)
      del(tmpDir.path, { force: true }).then(() => callback())
    })
  }

  return through.obj(bufferContents, endStream)
}
