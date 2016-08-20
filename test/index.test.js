const {expect} = require('chai')
const fs = require('fs')
const {join} = require('path')
const {File} = require('gulp-util')
const streamArray = require('stream-array')
const assert = require('stream-assert')

const iconutil = require('..')

const iconFiles = () => {
	const iconSize = [
		'512x512',
		'512x512@2x',
		'256x256',
		'256x256@2x',
		'128x128',
		'128x128@2x',
		'32x32',
		'32x32@2x',
		'16x16',
		'16x16@2x'
	]
	return streamArray(iconSize.map(size => {
		return new File({
			cwd: __dirname,
			base: join(__dirname, '/fixtures/app.iconset'),
			path: `icon_${size}.png`,
			contents: new Buffer(fs.readFileSync(join(__dirname, `/fixtures/app.iconset/icon_${size}.png`)))
		})
	}))
}

describe('gulp-iconutil', () => {
	describe('iconutil()', () => {
		it('should throw error when icnsName is missing', () => {
			expect(iconutil).to.throw(Error)
		})

		it('should throw error', done => {
			const stream = iconutil('app.icns')
			stream
				.pipe(assert.length(0))
				.pipe(assert.end(done))
			stream.write(new File())
			stream.end()
		})

		it('should create icns', done => {
			const icnsName = 'custom.icns'
			iconFiles()
				.pipe(iconutil(icnsName))
				.pipe(assert.first(data => {
					const expected = fs.readFileSync(join(__dirname, '/fixtures/app.icns'))
					expect(data.contents).to.deep.equal(expected)
					expect(data.relative).to.eql(icnsName)
				}))
				.pipe(assert.end(done))
		})
	})
})
