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

## 属性装饰器

ts 中属性饰器的旧语法和新语法差异比较大，我们首先来讨论旧语法中的内容：

在 ts 新版语法中，想要使用旧语法的装饰器需要在执行编译命令时，指定使用实验性装饰器选项和编译成的目标语法

```bash
tsc --target ES6 --experimentalDecorators -w ./index.ts
```

### 基本语法

```typescript
function Demo(target: object, propertyKey: string | symbol): void {
  console.log(target, propertyKey)
}

class Person {
  @Demo name: string
  age: number
  static school: string

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}
```

参数说明：

- target：对于**静态属性**来说值是**类**，对于**实例属性**来说值是**类的原型对象**
- propertyKey：属性名

[![pVpPMM4.png](https://s21.ax1x.com/2025/05/27/pVpPMM4.png)](https://imgse.com/i/pVpPMM4)

### 关于属性遮蔽

如下代码中：当构造器中的 this.age = age 试图在实例上赋值时，实际上是调用了原型上 age 属性的 set 方法。

```typescript
class Person {
  name: string
  age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

let value = 130
Object.defineProperty(Person.prototype, 'age', {
  get() {
    return value
  },
  set(val) {
    value = val
  }
})

const p1 = new Person('张三', 18)

console.log(p1)
```

[![pVpP7F0.png](https://s21.ax1x.com/2025/05/27/pVpP7F0.png)](https://imgse.com/i/pVpP7F0)

### 应用举例

> 需求：定义一个 State 属性装饰器，来监视属性的修改。

```typescript
function State(target: object, propertyKey: string | symbol) {
  let key = `__${propertyKey}`
  Object.defineProperty(target, propertyKey, {
    get() {
      return this[key]
    },
    set(newValue) {
      console.log(`${propertyKey}的最新值为：${newValue}`)
      this[key] = newValue
    },
    enumerable: true,
    configurable: true
  })
}

class Person {
  name: string
  @State age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }

  speak() {
    console.log('你好呀！')
  }
}

const p1 = new Person('张三', 18)
const p2 = new Person('李四', 20)

p1.age = 30
p2.age = 40

console.log(p1)
console.log(p2)
```
## 方法装饰器

### 基本语法

```typescript
function Demo(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
  console.log('target', target)
  console.log('propertyKey', propertyKey)
  console.log('descriptor', descriptor)
}

class Person {
  constructor(
    public name: string,
    public age: number,
  ) {}

  @Demo
  speak() {
    console.log(`你好，我是${this.name}，我的年龄：${this.age}`)
  }

  static isAdult(age: number) {
    return age >= 18
  }
}

```

参数说明：

- target：被装饰的方法所在的：（对于类的静态方法）类的构造函数，或者（对于类的实例方法）类的原型。
- propertyKey：所装饰方法的方法名，类型为`string|symbol`。
- descriptor：所装饰方法的描述对象。

[![pVpuUr6.png](https://s21.ax1x.com/2025/05/28/pVpuUr6.png)](https://imgse.com/i/pVpuUr6)

### 应用举例

> 需求：
>
> 1. 定义一个 Logger 方法装饰器，用于在方法执行前和执行后，均追加一些额外的逻辑。
> 2. 定义一个 Validate 方法装饰器，用于验证数据。

```typescript
function Logger(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
  // 存储原始方法
  const original = descriptor.value
  // 替换原始方法
  descriptor.value = function (...agrs: any[]) {
    console.log(`${propertyKey}开始执行......`)
    const result = original.call(this, ...agrs)
    console.log(`${propertyKey}执行完毕......`)
    return result
  }
}

function Validate(maxAge: number) {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value
    descriptor.value = function (...args: any[]) {
      // 自定义验证逻辑
      if (args[0] > maxAge) {
        throw new Error('年龄不能超过120岁')
      } else {
        return original.apply(this, args)
      }
    }
  }
}

class Person {
  constructor(
    public name: string,
    public age: number,
  ) {}

  @Logger speak(str: string) {
    console.log(`你好，我是${this.name}，我的年龄：${this.age}，${str}`)
  }

  @Validate(120)
  static isAdult(age: number) {
    return age >= 18
  }
}

const p1 = new Person('张三', 18)
p1.speak('hello')
console.log(Person.isAdult(120))
```

[![pVpQwZV.png](https://s21.ax1x.com/2025/05/28/pVpQwZV.png)](https://imgse.com/i/pVpQwZV)

## 存取器装饰器

### 基本语法

存取器装饰器用来装饰类的存取器（accessor）。所谓“存取器”指的是某个属性的取值器（getter）和存值器（setter）。

存取器装饰器的类型定义，与方法装饰器一致。

```typescript
function Demo(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
  console.log('target：', target)
  console.log('propertyKey：', propertyKey)
  console.log('descriptor：', descriptor)
}

class Person {
  @Demo
  get address() {
    return '北京宏福科技园'
  }

  @Demo
  static get Country() {
    return '中国'
  }
}
```

参数说明：

- target：
  1. 对于实例访问器来说值是【所属类的原型对象】。
  2. 对于静态访问器来说值是【所属类】。
- propertyKey：访问器名称。
- descriptor：描述对象。

[![pVpQ6z9.png](https://s21.ax1x.com/2025/05/28/pVpQ6z9.png)](https://imgse.com/i/pVpQ6z9)

### 应用举例

> 需求：创建一个 RangeValidate 装饰器，用来规定输入的温度的范围

```typescript
function RangeValidate(min: number, max: number) {
  return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    // 保存原始的setter
    const originalSetter = descriptor.set
    // 重写setter
    descriptor.set = function (value: number) {
      if (value < min || value > max) {
        throw new Error(`${String(propertyKey)}的值应该在 ${min} 到 ${max} 之间!`)
      } else {
        // 如果值在范围内，且原始 setter 方法存在，则调用原始 setter 方法
        return originalSetter?.call(this, value)
      }
    }
  }
}

class Weather {
  private _temp: number

  constructor(temp: number) {
    this._temp = temp
  }

  @RangeValidate(-50, 50)
  set temp(value) {
    console.log('setter触发')
    this._temp = value
  }

  get temp() {
    console.log('getter触发')
    return this._temp
  }
}

const w1 = new Weather(28)
w1.temp = 25
console.log(w1.temp)
w1.temp = 100
console.log(w1.temp)
```

[![pVplMl9.png](https://s21.ax1x.com/2025/05/28/pVplMl9.png)](https://imgse.com/i/pVplMl9)

## 参数装饰器

### 基本语法

```typescript
function Demo(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  console.log('target：', target)
  console.log('propertyKey：', propertyKey)
  console.log('parameterIndex：', parameterIndex)
}

class Person {
  constructor(public name: string) {}

  speak(@Demo message1: any, message2: any) {
    console.log(`${this.name}想说：${message1},${message2}`)
  }

  static sayAddress(country: string, @Demo city: any) {
    console.log(`我在${country}${city}`)
  }
}
```

参数说明：

- target：
  1. 如果修饰的是【实例方法】的参数，target 是类的 【原型对象】。
  2. 如果修饰的是【静态方法】的参数，target 是【类】。
- propertyKey：类所在的方法的名称。
- parameterIndex：参数在函数参数列表中的索引，从 0 开始。

[![pVp1l9g.png](https://s21.ax1x.com/2025/05/28/pVp1l9g.png)](https://imgse.com/i/pVp1l9g)