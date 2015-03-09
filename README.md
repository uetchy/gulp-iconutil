# gulp-iconutil

gulp-iconutil is a [__Gulp__](http://gulpjs.com/) plugin that provides `iconutil` wrapper.

Here is example:

__gulpfile.coffee__

```node
gulp     = require 'gulp'
sketch   = require 'gulp-sketch'
iconutil = require 'gulp-iconutil'

gulp.task 'icns', ->
  gulp.src './icons/sketch/*.sketch'
    .pipe sketch
      exports: 'artboards'
      format: 'png'
      scales: '1.0,2.0'
    .pipe iconutil('app.icns')
    .pipe gulp.dest './icons'
```

## Installation

```console
$ npm install --save-dev gulp-iconutil
```

## Testing

```console
$ npm install
$ npm test
```

## Contributing

1. Fork it ( https://github.com/uetchy/gulp-iconutil/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
