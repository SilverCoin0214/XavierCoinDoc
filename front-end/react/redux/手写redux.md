```js
function createStore(reducer) {
	let state;  // 保存状态
	let listeners = []  // 用于存放所有回调

	function subscribe(callback) {
		listeners.push(callback)
	}

	function dispatch(action) {
		state = reducer(state, action)
		for (let i = 0; i < listeners.length; i++) {
			const listener = listeners[i]
			listener()
		}
	}

	function getState() {
		return state
	}

	const store = {
		subscribe,
		dispatch,
		getState
	}

	return store
}
```

```js
function combineReducer(reducerMap) {
	const reducerKey = Object.key(reducerMap)

	const reducer = (state = {}, action) => {
		const newState = {}

		for (let i = 0; i < reducerKey.length; i++) {
			const key = reducerKey[i]
			const currentReducer = reducerMap[key]
			const prevState = state[key]
			newState[key] = currentReducer(prevState, action)
		}

		return newState
	}

	return reducer
}
```