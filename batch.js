var loop = require('./loop.js')
// item: {payload, priority}

// idle => executing

module.exports = function (maxBatch, maxDelay, handler) {
	var myBuffers = [] // job buffers
	var myState = 'idle'

	var myExecute = function (buffers) {
		var payloads = buffers.map(function (i) {
			return i.payload
		})
		var pro = handler(payloads)
		// func return result instead of a promise
		// we treat the out put as a promise
		if (!pro || !pro.then) pro = Promise.resolve(pro)

		var resolves = buffers.map(function (i) {
			return i.rs
		})
		return new Promise(function (resolve) {
			pro.then(function (outs) {
				resolves.map(function (rs, i) {
					rs(outs && outs[i])
				})
				resolve()
			})
		})
	}

	var myFlush = function () {
		if (myState === 'executing') return
		myState = 'executing'

		loop(function () {
			if (myBuffers.length <= maxBatch) return Promise.resolve(false)
			var buffers = myBuffers.splice(0, maxBatch) // myBuffers would also be trimmed
			return myExecute(buffers).then(function () {
				return true // continue loop
			})
		}).then(function () {
			if (myBuffers.length === 0) {
				myState = 'idle'
				return
			}

			// last batch
			var nextms = maxDelay - (Date.now() - myBuffers[0].created)
			if (nextms >= 1) {
				// set timeout for the first item in queue
				// the settedTimeout property will make sure that we won't
				// set multiple timeouts for this one
				myState = 'idle'

				if (myBuffers[0].settedTimeout) return
				myBuffers[0].settedTimeout = true
				setTimeout(myFlush, nextms)
				return
			}

			// have to execute remaining items
			var buffers = myBuffers
			myBuffers = []
			myExecute(buffers).then(function () {
				// myBuffers may have been added new item, must check after executed the last batch
				myState = 'idle'
				myFlush()
			})
		})
	}

	this.push = function (payload, priority) {
		return new Promise(function (resolve) {
			myBuffers.push({ payload: payload, priority: priority, created: Date.now(), rs: resolve })
			myFlush()
		})
	}

	return this
}
