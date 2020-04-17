var co = require('./common.js')

module.exports = function (collections, limit, func) {
	// prepare input map
	var ins = {} // inputs
	co.map(collections, function (i, k) {
		ins[k] = i
	})

	// normalize limit
	if (limit <= 0) limit = 1
	if (Object.keys(ins).length < limit) limit = Object.keys(ins).length

	var outs = {} // outputs

	return new Promise(function (resolve) {
		var doJob = function () {
			var keys = Object.keys(ins)
			if (keys.length === 0) return

			var key = keys.pop()
			var value = ins[key]
			delete ins[key]

			var amITheLast = keys.length === 0

			var pro = func(value, key)

			// func return result instead of a promise
			// we treat the out put as a promise
			if (!pro.then) {
				var out = pro
				pro = {
					then: function (f) {
						return f(out)
					},
				}
			}

			pro.then(function (ret) {
				outs[key] = ret
				if (amITheLast) return resolve(co.map(outs))

				doJob()
			})
		}

		for (var i = 0; i < limit; i++) setTimeout(doJob, 1)
	})
}
