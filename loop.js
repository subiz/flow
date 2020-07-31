// loop keep calling promise sequenctially until the promise resolve a false value
module.exports = function loop (promise) {
	var out = promise()
	if (!out || !out.then) {
		var saveout = out
		out = {
			then: function (f) {
				f(saveout)
			},
		}
	}
	return out.then(function (cont) {
		if (!cont) return Promise.resolve()
		return loop(promise)
	})
}
