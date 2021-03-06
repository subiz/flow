const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
	mode: 'production',
	entry: {
		app: ['./index.js'],
	},
	output: {
		library: 'beta',
		libraryTarget: 'umd',
		globalObject: "typeof self !== 'undefined' ? self : this",
		path: path.resolve(__dirname, 'dist'),
		filename: 'flow.js',
	},
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				test: /\.js($|\?)/i,
			}),
		],
	},
}
