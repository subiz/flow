var loop = require('./loop.js')
// item: {payload, priority}

// idle => executing

module.exports = function (maxBatch, maxDelay, handler) {
	var myBuffers = []
	var myDrainRs = []
	var myState = 'idle'

	var myExecute = function (buffers) {
		var payloads = buffers.map(function (i) {
			return i.payloads
		})
		var resolves = buffers.map(function (i) {
			return i.rs
		})

		var pro = handler(payloads)
		// func return result instead of a promise
		// we treat the out put as a promise
		if (!pro.then) {
			var outs = pro
			pro = {
				then: function (f) {
					return f(outs)
				},
			}
		}

		return new Promise(function (resolve) {
			pro.then(function (outs) {
				resolves.map(rs, function (i) {
					rs(outs[i])
				})
				resolve()
			})
		})
	}

	var myFlush = function () {
		if (myState === 'executing') return
		myState = 'executing'

		loop(function () {
			if (myBuffers.length >= maxBatch) return false
			var buffers = myBuffers.splice(0, maxBatch)
			return myExecute(buffers)
		}).then(function () {
			if (myBuffers.length === 0) return myIdle()
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

			// have to execute the buffers now regardless of there is only few item
			var buffers = myBuffers
			myBuffers = []
			myExecute(buffers).then(function () {
				myState = 'idle'
				myFlush()
			})
		})
	}

	var myIdle = function () {
		myState = 'idle'
		myDrainRs.map(function (rs) {
			rs()
		})
		myDrainRs = []
	}

	this.push = function (payload, priority) {
		var rs
		var promise = new Promise(function (resolve) {
			resolve = rs
		})

		myBuffers.push({ payload: payload, priority: priority, created: Date.now(), rs: rs })
		myFlush()

		return promise
	}

	this.drain = function () {
		return new Promise(function (rs) {
			if (myBuffers.length === 0) return rs()
			myDrainRs.push(rs)
		})
	}

	return this
}
