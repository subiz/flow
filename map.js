var co = require('./common.js')

module.exports = function (collections, limit, func) {
	if (typeof limit !== 'number' && !func) {
		func = limit
		limit = 1
	}

	// prepare input map
	var ins = {} // inputs
	co.map(collections, function (i, k) {
		ins[k] = i
	})

	if (limit <= 0) limit = 1 // normalize limit
	if (Object.keys(ins).length === 0) return Promise.resolve([])
	if (Object.keys(ins).length < limit) limit = Object.keys(ins).length

	var outs = {} // outputs
	return new Promise(function (resolve) {
		let total = Object.keys(ins).length

		var doJob = function () {
			var keys = Object.keys(ins)
			if (keys.length === 0) return

			var key = keys.pop()
			var value = ins[key]
			delete ins[key]

			var pro = func(value, key)
			// func return result instead of a promise
			// we treat the out put as a promise
			if (!pro || !pro.then) pro = Promise.resolve(pro)

			pro.then(function (ret) {
				outs[key] = ret
				if (Object.keys(outs).length === total) return resolve(co.map(outs))
				doJob()
			})
		}

		for (var i = 0; i < limit; i++) setTimeout(doJob, 1)
	})
}
