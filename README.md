# gulp-iconutil

gulp-iconutil is a [__Gulp__](http://gulpjs.com/) plugin that provides `iconutil` wrapper.

This plugin requires `iconutil` command in OS X.

## Installation

```console
$ npm install --save-dev gulp-iconutil
```

## Usage

```coffee
gulp     = require "gulp"
iconutil = require "gulp-iconutil"
```

then:

```coffee
gulp.task "icons", ->
  gulp.src "./app.iconset/icon_*.png"
    .pipe iconutil("app.icns")
    .pipe gulp.dest "./"
```

When you pass .png files through `iconutil()`, these files must be named like __icon_512x512.png__ or __icon_128x128@2x.png__.

### Create .icns from .sketch w/ [gulp-sketch](https://github.com/cognitom/gulp-sketch)

```coffee
gulp     = require "gulp"
sketch   = require "gulp-sketch"
iconutil = require "gulp-iconutil"

gulp.task "icons", ->
  gulp.src "./icons/sketch/*.sketch"
    .pipe sketch
      exports: "artboards"
      format: "png"
      scales: "1.0,2.0"
    .pipe iconutil("app.icns")
    .pipe gulp.dest "./icons"
```

## Testing

```console
$ git clone https://github.com/uetchy/gulp-iconutil.git
$ cd gulp-iconutil
$ npm install
$ npm test
```

## Contributing

1. Fork it ( https://github.com/uetchy/gulp-iconutil/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
