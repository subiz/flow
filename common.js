function map (collection, predicate) {
	if (!collection) return []
	if (!predicate) {
		predicate = function (a) {
			return a
		}
	}

	var out = []
	if (Array.isArray(collection)) {
		for (var i = 0; i < collection.length; i++) {
			out.push(predicate(collection[i], i))
		}
		return out
	}

	if (typeof collection === 'object') {
		var keys = Object.keys(collection)
		for (var i = 0; i < keys.length; i++) {
			var k = keys[i]
			out.push(predicate(collection[k], k))
		}
		return out
	}

	return out
}

module.exports = { map: map }
