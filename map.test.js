var test = require('tape')
var co = require('./common.js')
var sleep = require('./sleep.js')
var asyncMap = require('./map.js')

test('sync map', async (t) => {
	// sync one by one
	let outs = await asyncMap([1, 2, 3, 4], (i) => i * 2, 1)
	t.equal(outs[0], 2)
	t.equal(outs[1], 4)
	t.equal(outs[2], 6)
	t.equal(outs[3], 8)

	outs = await asyncMap([1, 2, 3, 4], (i) => i * 2)
	t.equal(outs[0], 2)
	t.equal(outs[1], 4)
	t.equal(outs[2], 6)
	t.equal(outs[3], 8)

	// sync two by two
	outs = await asyncMap([1, 2, 3, 4], (i) => i * 2, 2)

	t.equal(outs[0], 2)
	t.equal(outs[1], 4)
	t.equal(outs[2], 6)
	t.equal(outs[3], 8)

	// sync five by four
	outs = await asyncMap([1, 2, 3, 4], 5, (i) => i * 2)

	t.equal(outs[0], 2)
	t.equal(outs[1], 4)
	t.equal(outs[2], 6)
	t.equal(outs[3], 8)

	t.end()
})

test('sequence async map', async (t) => {
	let outs = await asyncMap([1, 2, 3, 4], async (i) => {
		if (i % 2 === 0) await sleep(10)
		return i * 2
	})

	t.equal(outs[0], 2)
	t.equal(outs[1], 4)
	t.equal(outs[2], 6)
	t.equal(outs[3], 8)

	// sync two by two
	outs = await asyncMap(
		[1, 2, 3, 4],
		async (i) => {
			await sleep(10)
			return i * 2
		},
		2,
	)

	t.equal(outs[0], 2)
	t.equal(outs[1], 4)
	t.equal(outs[2], 6)
	t.equal(outs[3], 8)

	// sync five by four
	outs = await asyncMap(
		[1, 2, 3, 4],
		async (i) => {
			await sleep(10)
			return i * 2
		},
		5,
	)

	t.equal(outs[0], 2)
	t.equal(outs[1], 4)
	t.equal(outs[2], 6)
	t.equal(outs[3], 8)

	t.end()
})
