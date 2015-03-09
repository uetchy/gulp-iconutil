var PLUGIN_NAME, child_process, del, fs, gutil, path, spawn, temporary, through;

fs = require('fs');

path = require('path');

through = require('through2');

gutil = require('gulp-util');

temporary = require('temporary');

del = require('del');

child_process = require('child_process');

spawn = child_process.spawn;

PLUGIN_NAME = 'gulp-iconutil';

module.exports = function(options) {
  var bufferContents, endStream, icons;
  if (options == null) {
    options = {};
  }
  icons = [];
  bufferContents = function(file, encoding, callback) {
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streams are not supported'));
      return callback();
    }
    icons.push(file);
    return callback();
  };
  endStream = function(callback) {
    var i, icon, iconset, iconsetPath, len, outputPath, program, tmpDir;
    tmpDir = new temporary.Dir();
    iconsetPath = path.join(tmpDir.path, 'tmp.iconset');
    iconset = fs.mkdirSync(iconsetPath);
    outputPath = path.join(tmpDir.path, 'tmp.icns');
    for (i = 0, len = icons.length; i < len; i++) {
      icon = icons[i];
      child_process.execFileSync('/bin/cp', [icon.path, iconsetPath]);
    }
    program = spawn('iconutil', ['-c', 'icns', iconsetPath]);
    return program.stdout.on('end', (function(_this) {
      return function() {
        var icns;
        icns = new gutil.File({
          cwd: icons[0].cwd,
          base: icons[0].base,
          path: path.join(icons[0].base, 'output.icns'),
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
