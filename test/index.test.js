import fs from 'fs'
import { join } from 'path'
import { File } from 'gulp-util'
import streamArray from 'stream-array'
import streamAssert from 'stream-assert'
import test from 'ava'

import iconutil from '..'

const iconFiles = () => {
  const iconSize = ['16x16', '16x16@2x']
  return streamArray(
    iconSize.map(size => {
      return new File({
        cwd: __dirname,
        base: join(__dirname, '/fixtures/app.iconset'),
        path: `icon_${size}.png`,
        contents: Buffer.from(
          fs.readFileSync(
            join(__dirname, `/fixtures/app.iconset/icon_${size}.png`)
          )
        ),
      })
    })
  )
}

test('should throw error when icnsName is missing', t => {
  t.throws(iconutil, Error)
})

test.cb('should throw error', t => {
  const stream = iconutil('app.icns')
  stream.pipe(streamAssert.length(0)).pipe(streamAssert.end(t.end))
  stream.write(new File())
  stream.end()
})

test.cb('should create icns', t => {
  const icnsName = 'custom.icns'

  iconFiles()
    .pipe(iconutil(icnsName))
    .pipe(
      streamAssert.first(data => {
        t.true(String(data.contents).indexOf('icns\u0000\u0000') > -1)
        t.is(data.relative, icnsName)
      })
    )
    .pipe(streamAssert.end(t.end))
})
