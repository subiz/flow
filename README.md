[![npm][npm]][npm-url]
[![deps][deps]][deps-url]
[![size][size]][size-url]

# @subiz/flow

Just a few simple functions to help you write asynchronous functions easier

* **sleep**, pauses the current execution flow for a specific milliseconds.
* **loop**, repeatly calls a function until it returns false.
* **map**, runs a function concurrently on every items of the given collection.
* **batch**, executes a function agains a stream of jobs (unbounded) in windowed fashion.

### Installing
```sh
npm i --save @subiz/flow
```

### Examples
#### Sleep
Sleep pauses the current execution flow
```js
var flow = require('@subiz/flow')

console.log('sleeping for 1 sec')
await flow.sleep(1000)
console.log('ok, I am up')
```

#### Loop
Loop is just like do/while, but it runs on both sync and async function
```js
var flow = require('@subiz/flow')

var n = 0
// call an async function 10 times
await flow.loop(async () => {
   	await flow.sleep(10)

   	n++
   	if (n === 10) return false
   	return true
})

console.log(n) // 10
```
*Caution:* The above code is just a super complicated version of
```js
for (var i = 0; i < 10; i++) await doSomethind()
```
The **loop** function only make sense when you have to write code that run on older browsers which do not support `async/await` (and you hate babel). Here is an example of asynchronous looping without `async/await`

```js
var n = 0
// call a async function 10 times
flow.loop(function() {
	return flow.sleep(10).then(function() {
		n++
		return n === 10
	})
}).then(function() {
	console.log(n) // 10
})
```
But again, please do not use this function when a simple for-loop will do.

#### Map
Map is like js `array.prototype.map` but run concurrently.
```js
var flow = require('@subiz/flow')

outs = await flow.map([1, 2, 3, 4], async i => {
   	await flow.sleep(1000)
   	return i * 2
}, 2)

// after 2 seconds
console.log(outs) // [2, 4, 6, 8]
```
On the example above, we have 4 items to process, each item need 1 second to process. With concurrency level of 2, it would only takes 2 seconds to finish.

#### Batch


### References
#### sleep(ms)
#### loop(func)

#### map(collections, func, concurrencyLevel)
#### batch(maxItemsPerBatch, delayMilliseconds, func)


[npm]: https://img.shields.io/npm/v/@subiz/flow.svg
[npm-url]: https://npmjs.com/package/@subiz/flow
[deps]: https://david-dm.org/@subiz/flow.svg
[deps-url]: https://david-dm.org/@subiz/flow
[size]: https://packagephobia.now.sh/badge?p=@subiz/flow
[size-url]: https://packagephobia.now.sh/result?p=@subiz/flow
