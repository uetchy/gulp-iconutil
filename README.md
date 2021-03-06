# gulp-iconutil

[![Build Status](https://travis-ci.com/uetchy/gulp-iconutil.svg?branch=master)](https://travis-ci.com/uetchy/gulp-iconutil) [![Coverage Status](https://coveralls.io/repos/github/uetchy/gulp-iconutil/badge.svg?branch=master)](https://coveralls.io/github/uetchy/gulp-iconutil?branch=master) [![npm version](https://badge.fury.io/js/gulp-iconutil.svg)](https://badge.fury.io/js/gulp-iconutil)

gulp-iconutil is a [**Gulp**](http://gulpjs.com/) plugin that provides `iconutil` wrapper.

This plugin requires macOS's `iconutil` command.

## Usage

```
npm install gulp-iconutil
```

```js
const gulp = require("gulp");
const iconutil = require("gulp-iconutil");

gulp.task("icon", () => {
  gulp
    .src("./app.iconset/icon_*.png")
    .pipe(iconutil("app.icns"))
    .pipe(gulp.dest("./"));
});
```

When you pass .png files through `iconutil()`, these files must be named like **icon_512x512.png** or **icon_128x128@2x.png**.

### Create .icns from .sketch w/ [gulp-sketch](https://github.com/cognitom/gulp-sketch)

.sketch files, which use for creating icons, must have artboard or slice named like **icon_512x512** or **icon_128x128**.

```js
const gulp = require('gulp')
const sketch = require('gulp-sketch')
const iconutil = require('gulp-iconutil')

gulp.task('icon', () => {
  gulp.src('./icons/sketch/*.sketch')
    .pipe(sketch({
      exports: 'artboards',
      format: 'png',
      scales: '1.0,2.0'
    }))
    .pipe(iconutil('app.icns'))
    .pipe(gulp.dest('./'))
```

## Test

```console
$ git clone https://github.com/uetchy/gulp-iconutil.git
$ cd gulp-iconutil
$ npm install
$ npm test
```

## Contribution

1.  Fork it ( https://github.com/uetchy/gulp-iconutil/fork )
2.  Create your feature branch (`git checkout -b my-new-feature`)
3.  Commit your changes (`git commit -am 'Add some feature'`)
4.  Push to the branch (`git push origin my-new-feature`)
5.  Create a new Pull Request
