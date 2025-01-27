# call、bind、apply

在 js 中，函数的 this 关键字的行为取决于函数是如何被调用的，也就是指向函数的调用者，call、bind、apply 的主要作用是改变函数的 this 指向

## call

call() 方法会以给定的 this 值和逐个提供的参数调用该函数。

### 参数

call(thisArg, arg1, arg2, /\*…,*/ argN)

1. 第一个参数 thisArg 是要改变的 this 指向
2. 后面的参数是要传给原函数的参数

```js
const o = {
  clothes: '衬衫'
}
function fn(price) {
  console.log(`${ this.clothes } 的价钱是 ${ price } 元`)
}
fn.call(o, 100) // 衬衫 的价钱是 100 元
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
  // 5. 如果传入的对象是 null 或者 undefined，那么将其指向 window
  obj = obj || window
  // call 函数的本质就是将其调用者挂载到传入的对象上，并立即执行该函数
  // 1、因此需要先将其调用者挂载到传入的对象上
  obj.fn = this
  // 2、立即执行该函数，使用剩余参数给挂载的函数传参
  // call 函数在 es3 中就存在了，那时候是没有剩余参数的，因此需要使用 eval 函数来执行
  // eval() 函数会将传入的字符串当做 JavaScript 代码进行执行。
  let res = obj.fn(...args) // 使用 res 接收调用者的返回值
  // 3、执行完后，将其调用者从传入的对象上删除
  delete obj.fn
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
  // 5. 如果传入的对象是 null 或者 undefined，那么将其指向 window
  obj = obj || window
  // call 函数的本质就是将其调用者挂载到传入的对象上，并立即执行该函数
  // 1、因此需要先将其调用者挂载到传入的对象上
  obj.fn = this
  // 2、立即执行该函数，使用剩余参数给挂载的函数传参
  // call 函数在 es3 中就存在了，那时候是没有剩余参数的，因此需要使用 eval 函数来执行
  // eval() 函数会将传入的字符串当做 JavaScript 代码进行执行。
  const newArgs = []
  for (let i = 1; i < arguments.length; i++) {
    // arguments 是一个对应于传递给函数的参数的类数组对象。
    newArgs.push('arguments[' + i + ']')
  }
  let res = eval('obj.fn(' + newArgs + ')') // 使用 res 接收调用者的返回值
  // 3、执行完后，将其调用者从传入的对象上删除
  delete obj.fn
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
