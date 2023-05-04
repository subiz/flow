var test = require('tape')
var Batch = require('./batch.js')
var asyncMap = require('./map.js')
var co = require('./common.js')
var sleep = require('./sleep.js')

test('window should execute', async (t) => {
	let bat = new Batch(20, 200, async (is) => {
		let outs = await asyncMap(
			is,
			async (i) => {
				await sleep(20)
				return i * 2
			},
			2,
		)
		return outs
	})

	let outPromises = []
	for (var i = 0; i < 1000; i++) outPromises[i] = bat.push(i)

	let outs = await Promise.all(outPromises)
	for (var i = 0; i < 1000; i++) t.equal(outs[i], i * 2)
	t.end()
})

test('async execute', async (t) => {
	let bat = new Batch(20, 200, async (is) => {
		await sleep(2000)
		console.log('AAAAAAAAA')
	})

	await bat.push(20)
	console.log('BBBBBBB')
	t.end()
})
