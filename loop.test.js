var test = require('tape')
var co = require('./common.js')
var sleep = require('./sleep.js')
var loop = require('./loop.js')

test('loop async', async t => {
	var i = 0
	var n = 0
	await loop(async () => {
		await sleep(10)
		n++
		if (n === 10) return false
		return true
	})

	t.equal(n, 10)

	loop(async () => {
		await sleep(100)
		n++
		if (n === 20) return false
		return true
	})
	await sleep(1000)
	t.notEqual(n, 20)
	await sleep(1100)
	t.equal(n, 20)
	t.end()
})

test('loop sync', async t => {
	var i = 0
	var n = 0
	await loop(() => {
		n++
		if (n === 10) return false
		return true
	})

	t.equal(n, 10)
	t.end()
})
