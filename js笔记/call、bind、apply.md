# call、bind、apply

在 js 中，函数的 this 关键字的行为取决于函数是如何被调用的，也就是指向函数的调用者，call、bind、apply 的主要作用是改变函数的 this 指向

## call

call() 方法会以给定的 this 值和逐个提供的参数调用该函数。

### 参数

call(thisArg, arg1, arg2, /\*…,*/ argN)

1. **thisArg**：第一个参数 thisArg 是要改变的 this 指向
2. **arg1, arg2, /\*…,*/ argN(可选)**：后面的参数是要传给原函数的参数

```js
let o = {
  clothes: '衬衫'
}
function fn(a, b, c) {
  console.log(this.clothes, a, b, c)
}
fn.apply(o, [1, 2, 3]) // 衬衫 1 2 3
```

> call 函数的本质就是将其调用者挂载到传入的对象上，并立即执行该函数

使用了 call() 方法的函数相当于下面的形式：

```js
const o = {
  clothes: '衬衫',
  fn: function (price) {
    console.log(`${this.clothes} 的价格是 ${price} 元`)
  }
}
o.fn(100) // 衬衫 的价格是 100 元
```

### call 函数的实现

```js
const o = {
  clothes: '衬衫'
}
function fn(arg1, arg2, arg3, arg4) {
  console.log(`绑定了this：${this.clothes}`)
  console.log('传入的参数：', arg1, ',', arg2, ',', arg3, ',', arg4)
  return '这个函数有返回值'
}
// call 函数的实现
// myCall 是一个函数，在使用的时候，通过其他的函数使用“.”操作符，来调用myCall函数
// 因此需要将 myCall 函数挂载到函数的原型 Function.prototype 上
/**
 * @description myCall 函数的实现
 * @param {object} obj 要绑定的对象
 * @return {any} 返回调用者的返回值
 */
Function.prototype.myCall = function (obj, ...args) {
  // 5. 使用 globalThis（包含全局的 this 值）代替 window，兼容非浏览器环境
  // 在浏览器中，全局对象是 window
  // 在 Node.js 中，全局对象是 global
  // 在 Web Worker 中，全局对象是 self
  obj = obj || globalThis
  // call 函数的本质就是将其调用者挂载到传入的对象上，并立即执行该函数
  // 1、因此需要先将其调用者挂载到传入的对象上
  const fnKey = Symbol('fn') // 使用 Symbol 避免属性冲突
  obj[fnKey] = this
  // 2、立即执行该函数，使用 es6 中的剩余参数给挂载的函数传参
  let res = obj[fnKey](...args) // 使用 res 接收调用者的返回值
  // 3、执行完后，将其调用者从传入的对象上删除
  delete obj[fnKey]
  // 4、返回调用者的返回值
  return res
}
console.log(fn.myCall(null, 'a', 100, { sku: 1001 }, [1, 2, 3]))
/**
 * 绑定了this：衬衫
 * 传入的参数： a , 100 , { sku: 1001 } , [ 1, 2, 3 ]
 * 这个函数有返回值
 */
```

**注**：call 函数在 es3 中就存在了，那时候是没有剩余参数的，因此需要使用 eval 函数来执行

```js
const o = {
  clothes: '衬衫'
}
function fn(arg1, arg2, arg3, arg4) {
  console.log(`绑定了this：${this.clothes}`)
  console.log('传入的参数：', arg1, ',', arg2, ',', arg3, ',', arg4)
  return '这个函数有返回值'
}
// call 函数的实现
// myCall 是一个函数，在使用的时候，通过其他的函数使用“.”操作符，来调用myCall函数
// 因此需要将 myCall 函数挂载到函数的原型 Function.prototype 上
/**
 * @description myCall 函数的实现
 * @param {object} obj 要绑定的对象
 * @return {any} 返回调用者的返回值
 */
Function.prototype.myCall = function (obj) {
  // 5. 使用 globalThis（包含全局的 this 值）代替 window，兼容非浏览器环境
  // 在浏览器中，全局对象是 window
  // 在 Node.js 中，全局对象是 global
  // 在 Web Worker 中，全局对象是 self
  obj = obj || globalThis
  // call 函数的本质就是将其调用者挂载到传入的对象上，并立即执行该函数
  // 1、因此需要先将其调用者挂载到传入的对象上
  const fnKey = Symbol('fn') // 使用 Symbol 避免属性冲突
  obj[fnKey] = this
  // 2、立即执行该函数，使用剩余参数给挂载的函数传参
  // call 函数在 es3 中就存在了，那时候是没有剩余参数的，因此需要使用 eval 函数来执行
  // eval() 函数会将传入的字符串当做 JavaScript 代码进行执行。
  const newArgs = []
  for (let i = 1; i < arguments.length; i++) {
    // arguments 是一个对应于传递给函数的参数的类数组对象。
    newArgs.push('arguments[' + i + ']')
  }
  let res = eval('obj[fnKey](' + newArgs + ')') // 使用 res 接收调用者的返回值
  // 3、执行完后，将其调用者从传入的对象上删除
  delete obj[fnKey]
  // 4、返回调用者的返回值
  return res
}
console.log(fn.myCall(o, 'a', 100, { sku: 1001 }, [1, 2, 3]))
/**
 * 绑定了this：衬衫
 * 传入的参数： a , 100 , { sku: 1001 } , [ 1, 2, 3 ]
 * 这个函数有返回值
 */
```

## apply

apply() 方法会以给定的 this 值和作为数组（或类数组对象）提供的 arguments 调用该函数。

### 参数

apply(thisArg, argsArray)

1. **thisArg**：第一个参数 thisArg 是要改变的 this 指向
2. **argsArray(可选)**：一个类数组对象，用于指定调用 func 时的参数，或者如果不需要向函数提供参数，则为 null 或 undefined。

### apply 函数的实现

```js
const o = {
  clothes: '衬衫'
}
function fn(arg1, arg2, arg3, arg4) {
  console.log(`绑定了this：${this.clothes}`)
  console.log('传入的参数：', arg1, ',', arg2, ',', arg3, ',', arg4)
  return '这个函数有返回值'
}
// bind 函数的实现
// myBind 是一个函数，在使用的时候，通过其他的函数使用“.”操作符，来调用 myBind 函数
// 因此需要将 myBind 函数挂载到函数的原型 Function.prototype 上
/**
 * @description myBind 函数的实现
 * @param {object} obj 要绑定的对象
 * @param {array} arrArgs 传入的参数
 * @return {any} 返回调用者的返回值
 */
Function.prototype.myBind = function (obj, arrArgs) {
  // 5. 使用 globalThis（包含全局的 this 值）代替 window，兼容非浏览器环境
  // 在浏览器中，全局对象是 window
  // 在 Node.js 中，全局对象是 global
  // 在 Web Worker 中，全局对象是 self
  obj = obj || globalThis
  // call 函数的本质就是将其调用者挂载到传入的对象上，并立即执行该函数
  // 1、因此需要先将其调用者挂载到传入的对象上
  const fnKey = Symbol('fn') // 使用 Symbol 避免属性冲突
  obj[fnKey] = this
  let res // 用于存储调用者的返回值
  // 2. 立即执行该函数
  if (!arrArgs) {
    // 2.1 没有传参的情况
    res = obj[fnKey]()
  } else {
    // 2.2 传参的情况
    res = obj[fnKey](...arrArgs)
  }
  // 3、执行完后，将其调用者从传入的对象上删除
  delete obj[fnKey]
  // 4、返回调用者的返回值
  return res
}
console.log(fn.myBind(o, ['a', 100, { sku: 1001 }, [1, 2, 3]]))
/**
 * 绑定了this：衬衫
 * 传入的参数： a , 100 , { sku: 1001 } , [ 1, 2, 3 ]
 * 这个函数有返回值
 */
```

## bind

bind 函数的作用是**创建一个新的函数**，并将该函数内部的 this 值绑定到指定的对象，还可以在新函数中预置一些参数。

### 参数

bind(thisArg, arg1, arg2, /\* …, */ argN)

1. **thisArg**：第一个参数 thisArg 是要改变的 this 指向
2. **arg1, arg2, /\*…,*/ argN(可选)**：后面的参数是要传给原函数的参数

```js
let o = {
  clothes: '衬衫'
}
function fn(a, b) {
  console.log(this.clothes, a, b)
}
// bind 函数返回的是一个函数，因此需要调用才能执行
fn.bind(o, 1, 2)() // 衬衫 1 2
fn.bind(o)(1, 2) // 衬衫 1 2
fn.bind(o, 1)(2) // 衬衫 1 2
```

### bind 函数的实现

```js
let o = {
  clothes: '衬衫'
}
function fn(a, b, c) {
  console.log(this.clothes, a, b, c)
  return '函数的返回值'
}

/**
 * @description myBind 函数的实现
 * @param {object} obj 要绑定的对象
 * @returns {function} 返回一个函数
 */
Function.prototype.myBind = function (obj) {
  // 1. 保存this
  // 因为 myBind 函数返回的函数中的 this 是指向 window（global） 的，所以需要先保存 this
  let that = this || globalThis
  // 2. 保存参数
  // 2.1 保存第一个括号内的参数
  // 将传入的参数保存到数组中
  let args1 = Array.prototype.slice.call(arguments, 1) // 截取从第二个参数开始的所有参数
  let args2
  // 3. 返回一个函数
  return function () {
    // 2.2 保存第二个括号内的参数
    args2 = Array.prototype.slice.call(arguments)
    // 合并两个括号传进来的参数
    let res = that.apply(obj, args1.concat(args2)) // 或者
    // that.apply(obj, [...args1, ...args2]) // 或者
    // that.apply(obj, args1.push.apply(args1, args2) && args1)
    // 4. 返回调用者的返回值
    return res
  }
}

console.log(fn.myBind(o, 1, 3)(2))
/**
 * 衬衫 1 3 2
 * 函数的返回值
 */
```
