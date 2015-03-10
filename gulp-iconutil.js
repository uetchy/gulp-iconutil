var File, PLUGIN_NAME, PluginError, child_process, del, fs, gutil, path, spawn, temporary, through;

fs = require('fs');

path = require('path');

through = require('through2');

temporary = require('temporary');

del = require('del');

gutil = require('gulp-util');

PluginError = gutil.PluginError;

File = gutil.File;

child_process = require('child_process');

spawn = child_process.spawn;

PLUGIN_NAME = 'gulp-iconutil';

module.exports = function(icnsName, options) {
  var bufferContents, endStream, icons;
  if (options == null) {
    options = {};
  }
  if (!icnsName) {
    throw new PluginError(PLUGIN_NAME, 'Missing icns name');
  }
  icons = [];
  bufferContents = function(file, encoding, callback) {
    if (file.isNull()) {
      callback();
      return;
    }
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported'));
      callback();
      return;
    }
    icons.push(file);
    return callback();
  };
  endStream = function(callback) {
    var i, icon, iconset, iconsetPath, len, outputPath, program, tmpDir;
    if (!icons.length) {
      callback();
      return;
    }
    tmpDir = new temporary.Dir();
    iconsetPath = path.join(tmpDir.path, 'tmp.iconset');
    iconset = fs.mkdirSync(iconsetPath);
    outputPath = path.join(tmpDir.path, 'tmp.icns');
    for (i = 0, len = icons.length; i < len; i++) {
      icon = icons[i];
      fs.writeFileSync(path.join(iconsetPath, path.basename(icon.path)), icon.contents);
    }
    program = spawn('/usr/bin/iconutil', ['-c', 'icns', iconsetPath]);
    return program.stdout.on('end', (function(_this) {
      return function() {
        var icns;
        icns = new File({
          cwd: icons[0].cwd,
          base: icons[0].base,
          path: path.join(icons[0].base, icnsName),
          contents: fs.readFileSync(outputPath)
        });
        _this.push(icns);
        return del(tmpDir.path, {
          force: true
        }, function() {
          return callback();
        });
      };
    })(this));
  };
  return through.obj(bufferContents, endStream);
};
