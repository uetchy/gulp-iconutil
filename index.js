const fs = require('fs')
const path = require('path')
const {spawn} = require('child_process')
const through = require('through2')
const temporary = require('temporary')
const del = require('del')
const {PluginError, File} = require('gulp-util')

const PLUGIN_NAME = 'gulp-iconutil'

module.exports = icnsName => {
	if (!icnsName) {
		throw new PluginError(PLUGIN_NAME, 'Missing icns name')
	}
	const icons = []

	const bufferContents = function (file, encoding, callback) {
		if (file.isNull()) {
			return callback()
		}

		if (file.isStream()) {
			this.emit('error', new PluginError(PLUGIN_NAME), 'Streams are not supported')
			return callback()
		}

		icons.push(file)
		callback()
	}

	const endStream = function (callback) {
		if (!icons.length) {
			return callback()
		}

		const self = this

		const tmpDir = new temporary.Dir()
		const iconsetPath = path.join(tmpDir.path, 'tmp.iconset')
		const outputPath = path.join(tmpDir.path, 'tmp.icns')

		fs.mkdirSync(iconsetPath)

		icons.forEach(icon => {
			fs.writeFileSync(path.join(iconsetPath, path.basename(icon.path)), icon.contents)
		})

		const program = spawn('/usr/bin/iconutil', ['-c', 'icns', iconsetPath])
		program.stdout.on('end', () => {
			const icns = new File({
				cwd: icons[0].cwd,
				base: icons[0].base,
				path: path.join(icons[0].base, icnsName),
				contents: fs.readFileSync(outputPath)
			})
			self.push(icns)
			del(tmpDir.path, {force: true}).then(() => callback())
		})
	}

	return through.obj(bufferContents, endStream)
}
