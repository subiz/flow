// sleep won't resolve after a given milliseconds
// e.g: await sleep(100)
module.exports = function sleep (ms) {
	return new Promise(function (res) {
		setTimeout(res, ms)
	})
}
