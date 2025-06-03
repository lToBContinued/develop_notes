# declare 关键字

## 简介

declare 关键字用来告诉编译器，某个类型是存在的，可以在当前文件中使用。

它的主要作用，就是让当前文件可以使用其他文件声明的类型。举例来说，自己的脚本使用外部库定义的函数，编译器会因为不知道外部函数的类型定义而报错，这时就可以在自己的脚本里面使用`declare`关键字，告诉编译器外部函数的类型。这样的话，编译单个脚本就不会因为使用了外部类型而报错。

declare 关键字可以描述以下类型：

- 变量（const、let、var 命令声明）
- type 或者 interface 命令声明的类型
- class
- enum
- 函数（function）
- 模块（module）
- 命名空间（namespace）

declare 关键字的重要特点是，它只是通知编译器某个类型是存在的，不用给出具体实现。比如，只描述函的类型，不给出函数的实现，如果不使用`declare`，这是做不到的。

declare 只能用来描述已经存在的变量和数据结构，不能用来声明新的变量和数据结构。另外，所有 declare语句都不会出现在编译后的文件里面。

## declare variable

declare 关键字可以给出外部变量的类型描述。

```typescript
x = 1 // 错误：找不到名称x。
```

上面示例中，变量`x`是其他脚本定义的，当前脚本不知道它的类型，编译器就会报错。

这时使用 declare 命令给出它的类型，就不会报错了。

```typescript
declare let x: number
x = 1
```

> 和
>
> ```typescript
> let x: number
> x = 1
> ```
>
> 的区别是什么？

```typescript
declare let x: number
x = 1

// 编译后的 js 文件
x = 1;
```

```typescript
let x: number
x = 1

// 编译后的 js 文件
var x;
x = 1;
```

-----

如果 declare 关键字没有给出变量的具体类型，那么变量类型就是`any`。

```typescript
declare let x
x = 1
```

上面示例中，变量`x`的类型为`any`。

-----

注意，declare 关键字只用来给出类型描述，是纯的类型代码，不允许设置变量的初始值，即不能涉及值。

```typescript
declare let x: number = 10 // 错误：不允许在环境上下文中使用初始化表达式。
```

## declare function

declare 关键字可以给出外部函数的类型描述。

例：

```typescript
declare function sayHello(name: string): void

sayHello('张三')
```

上面示例中，declare 命令给出了`sayHello()`的类型描述，因此可以直接使用它。

> 注意：这种单独的函数类型声明语句，只能用于`declare`命令后面。一方面，TypeScript 不支持单独的函数类型声明语句；另一方面，declare 关键字后面也不能带有函数的具体实现。

## declare class

declare 给出 class 的描述描述写法如下。

```typescript
declare class C {
  constructor(name: string)
  eat: () => void
  sleep: () => void
}
```

下面是一个复杂一点的例子。

```typescript
declare class C {
  // 静态成员
  public static s0(): string

  private static s1(): string

  // 属性
  public a: number
  private b: number

  // 构造函数
  constructor(arg: number)

  // 方法
  m(x: number, y: number): number

  // 存取器
  get c(): number
  set c(value: number)

  // 索引签名
  [index: string]: any
}
```

同样的，declare 后面不能给出 Class 的具体实现或初始值。

## declare module，declare namespace

如果想把变量、函数、类组织在一起，可以将 declare 与 module 或 namespace 一起使用。

```typescript
declare namespace AnimalLib {
  class Animal {
    constructor(name: string)
    eat: { (): void }
    sleep: () => void
  }

  type Animals = 'Fish' | 'Dog'
}
```

-----

declare namespace 里面，加不加 export 关键字都可以。

```typescript
declare namespace Foo {
  export let a: number
}
```

-----

下面的例子是当前脚本使用了`myLib`这个外部库，它有方法`makeGreeting()`和属性`numberOfGreetings`。

```typescript
declare namespace myLib {
  function makeGreeting(s: string): string
  let numberOfGreetings: number
}

let result = myLib.makeGreeting('你好')
console.log(`欢迎词${result}`)
let count = myLib.numberOfGreetings
```

-----

declare 关键字的另一个用途，是为外部模块添加属性和方法时，给出新增部分的类型描述。

```typescript
import { Foo as Bar } from 'moduleA'

declare module 'moduleA' {
  interface Bar extends Foo {
    custom: {
      prop1: string
    }
  }
}
```

上面示例中，从模块`moduleA`导入了`Foo`接口，将其重命名为`Bar`，并用 declare 关键字为`Bar`增加一个属性`custom`。

-----

下面是另一个例子。一个项目有多个模块，可以在一个模型中，对另一个模块的接口进行类型扩展。

```typescript
// a.ts
export interface A {
  x: number
}
```

```typescript
// b.ts
import { A } from './a'

declare module 'a' {
  interface A {
    y: number
  }
}

const a: A = {
  x: 1,
  y: 2,
}
```

上面示例中，脚本`a.ts`定义了一个接口`A`，脚本`b.ts`为这个接口添加了属性`y`。`declare module './a' {}`表示对`a.ts`里面的模块，进行类型声明，而同名 interface 会自动合并，所以等同于扩展类型。