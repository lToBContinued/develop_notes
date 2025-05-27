# 装饰器

## 什么是装饰器

1. 装饰器本质是一种特殊的`函数`，他可以对：类、属性、方法、参数进行扩展，同时能让代码更简洁。
2. 装饰器自 2015 年在 ECMAScript-6 中被提出。
3. 截止目前，装饰器仍然是实验性特性，需要开发者手动调整配置，来开启装饰器支持。

在 ts 中，装饰器是实验性功能，需要在 tsconfig.json 中启用装饰器相关配置：

```json
{
  // ...其他配置
  "compilerOptions": {
    // ...其他配置
    "experimentalDecorators": true, // 实验性装饰器
  }
}
```

4. 装饰器有五种：
   - 类装饰器
   - 属性装饰器
   - 方法装饰器
   - 访问器装饰器
   - 参数装饰器

## 类装饰器

> 类装饰器是一个应用在`类声明`上的`函数`，可以为类添加额外的功能，或添加额外的处理。

### 基本语法

```typescript
function Demo(target: Function) {
  console.log(target) // 打印结果是 Person 这个类
}

@Demo
class Person {
  name: string
  age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}
```

Demo 函数会在 Person 类定义时执行

参数说明：

- target：被装饰的类，即：Person

### 应用举例

> 需求：定义一个装饰器，实现 `Person` 示例调用 `toString` 时返回 `JSON.stringify` 的执行结果。

```typescript
function CustomString(target: Function) {
  target.prototype.toString = function () {
    return JSON.stringify(this) // this 指向调用 toString 方法的实例
  }
  // 封闭其原型对象，禁止随意操作其原型对象
  Object.seal(target.prototype)
}

@CustomString
class Person {
  name: string
  age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

interface Person {
  x: number
}

const p1 = new Person('张三', 18)
Person.prototype.x = 111
console.log(p1.toString()) // {"name":"张三","age":18}
console.log(p1.x) // undefined

```

### 关于返回值

>类装饰器**有**返回值：若类装饰器返回一个新的类，那个类将**替换**掉被装饰的类。
>
>类装饰器**无**返回值：若类装饰器无返回值或返回 undefined，那装饰器的类**不会**被替换。

```typescript
function Demo(target: Function) {
  return class {
    test() {
      console.log(100)
      console.log(200)
      console.log(300)
    }
  }
}

@Demo
class Person {
  test() {
    console.log(100)
  }
}

const p1 = new Person()
p1.test() // 100 200 300
```

### 关于构造类型

在 TypeScript 中，Function 类型所表示的范围十分广泛，包括：普通函数、箭头函数、方法等等。但并非 Function 类型的函数都可以被 new 关键字实例化，例如箭头函数是不能被实例化的，那么 ts 中该如何声明一个构造类型呢？有以下两种方法：

1. 仅声明构造类型：

```typescript
/**
 * new： 表示该类型是可以用 new 操作符调用
 * ...args： 表示构造器可以接受【任意数量】的参数
 * any[]： 表示构造器可以接受【任意类型】的参数
 * {}： 表示返回类型是对象（非 null、非 undefined 的对象）
 */
type Constructor = new (...args: any[]) => {}

// 需求是 fn 是一个类
function test(fn: Constructor) {}

class Person {}

test(Person)
```

2. 声明构造类型 + 指定静态属性

```typescript
type Constructor = {
  new (...args: any[]): {} // 构造签名
  wife: string // 静态属性
}

function test(fn: Constructor) {}

class Person {
  static wife: string
}

test(Person)
```

### 替换被装饰的类

对于高级一些的装饰器，不仅仅是覆盖一个原型上的方法，还要有更多功能，例如添加新的方法和状态。

> 需求：设计一个 LogTime 装饰器，可以给实例添加一个属性，用于记录对象的创建时间，再添加一个方法用于读取创建时间。

```typescript
// 自定义类型 Class
type Constructor = new (...args: any[]) => {}

// Person 接口
interface Person {
  getTime(): string
}

function LogTime<T extends Constructor>(target: T) {
  return class extends target {
    createdTime: Date

    constructor(...args: any[]) {
      super(...args)
      this.createdTime = new Date()
    }

    getTime() {
      return `该对象的创建时间为: ${this.createdTime}`
    }
  }
}

@LogTime
class Person {
  constructor(
    public name: string,
    public age: number,
  ) {}

  speak() {
    console.log('你好')
  }
}

const p1 = new Person('张三', 18)
console.log(p1)
console.log(p1.getTime())
```

[![pVSjPWd.png](https://s21.ax1x.com/2025/05/27/pVSjPWd.png)](https://imgse.com/i/pVSjPWd)

## 装饰器工厂

装饰器工厂是一个返回装饰器函数的函数，可以为装饰器添加参数，可以更灵活地控制装饰器的行为。

> 需求：定义一个 LogInfo 类装饰器工厂，实现 Person 实例可以调用 introduce 方法，且 introduce 中输出内容的次数，由 LogInfo 接收的参数决定。

```typescript
interface Person {
  introduce(): void
}

function LogInfo(n: number) {
  return function (target: Function) {
    target.prototype.introduce = function () {
      for (let i = 0; i < n; i++) {
        console.log(`我是${this.name}, 我${this.age}岁了`)
      }
    }
  }
}

@LogInfo(3) // ===> LogInfo(5)(Person) 相当于把 LogInfo(5) 调用的返回值（这个返回值才是真正的装饰器）继续调用
class Person {
  constructor(
    public name: string,
    public age: number,
  ) {}

  speak() {
    console.log('你好')
  }
}

const p1 = new Person('张三', 18)
p1.introduce()
// 我是张三, 我18岁了
// 我是张三, 我18岁了
// 我是张三, 我18岁了
```

## 装饰器组合

### 执行顺序

装饰器可以组合使用，执行顺序为：先【由上到下】执行所有的装饰器工厂，依次获取到装饰器，然后再【由下到上】执行所有的装饰器。

```typescript
// 装饰器
function test1(target: Function) {
  console.log('test1')
}

// 装饰器工厂
function test2() {
  console.log('test2工厂')
  return function (target: Function) {
    console.log('test2')
  }
}

// 装饰器工厂
function test3() {
  console.log('test3工厂')
  return function (target: Function) {
    console.log('test3')
  }
}

// 装饰器
function test4(target: Function) {
  console.log('test4')
}

@test1
@test2()
@test3()
@test4
class Person {}

// test2工厂
// test3工厂
// test4
// test3
// test2
// test1
```

### 应用

```typescript
type Constructor = new (...args: any[]) => {}

interface Person {
  introduce(): void

  getTime(): string
}

// 装饰器
function CustomString(target: Function) {
  target.prototype.toString = function () {
    return JSON.stringify(this)
  }
  Object.seal(target.prototype)
}

// 装饰器工厂
function LogInfo(n: number) {
  return function (target: Function) {
    target.prototype.introduce = function () {
      for (let i = 0; i < n; i++) {
        console.log(`我是${this.name}, 我${this.age}岁了`)
      }
    }
  }
}

// 装饰器
function LogTime<T extends Constructor>(target: T) {
  return class extends target {
    createdTime: Date

    constructor(...args: any[]) {
      super(...args)
      this.createdTime = new Date()
    }

    getTime() {
      return `该对象的创建时间为: ${this.createdTime}`
    }
  }
}

@CustomString
@LogInfo(5)
@LogTime
class Person {
  constructor(
    public name: string,
    public age: number,
  ) {}

  speak() {
    console.log('你好')
  }
}

const p1 = new Person('张三', 18)
p1.speak()
console.log(p1.toString())
p1.introduce()
console.log(p1.getTime())

/*输出*/
// 你好
// {"name":"张三","age":18,"createdTime":"2025-05-27T08:00:17.414Z"}
// 我是张三, 我18岁了
// 我是张三, 我18岁了
// 我是张三, 我18岁了
// 我是张三, 我18岁了
// 我是张三, 我18岁了
// 该对象的创建时间为: Tue May 27 2025 16:00:29 GMT+0800 (中国标准时间)
```

