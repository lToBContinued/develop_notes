# Pinia 选项式

## 创建仓库

在 ./store/index.ts 文件中创建仓库

```ts
import { defineStore } from 'pinia'
import { Names } from './store-name.ts'

export const useTestStore = defineStore(Names.TEST, {
  state: () => {
    return { current: 1, name: '小满' }
  },
  getters: {},
  actions: {},
})
```

1. state：仓库中的状态（数据）
2. getters：相当于 computed，用于修饰一些值
3. actions：类似于 methods，可以做一些同步和异步的操作，提交 state

可以再声明一个枚举类型的文件来枚举仓库名字

./store/store-name.ts

```ts
export const enum Names {
  TEST = 'TEST',
}
```

## state

### state 的值允许修改

```vue
<template>
  <div>pinia：{{ Test.current }}=={{ Test.name }}</div>
  <button @click="change">change</button>
</template>

<script setup lang="ts">
import { useTestStore } from './stores'

const Test = useTestStore()

const change = () => {
  Test.current++
}
</script>
```

> vuex 中的状态值不能直接修改，必须通过 mutation 来修改 state，但是在 pinia 中可以直接更改

### 批量修改 state

通过 $patch 可以批量修改仓库中的 state

#### $patch({}) 接收对象的形式

```vue
<template>
  <div>pinia：{{ Test.current }}=={{ Test.name }}</div>
  <button @click="change">change</button>
</template>

<script setup lang="ts">
import { useTestStore } from './stores'

const Test = useTestStore()

const change = () => {
  Test.$patch({
    current: 888,
    name: '娃娃',
  })
}
</script>
```

#### $patch(() => {}) 接收函数的形式

> 好处：可以在函数中处理一些逻辑

```vue
<template>
  <div>pinia：{{ Test.current }}=={{ Test.name }}</div>
  <button @click="change">change</button>
</template>

<script setup lang="ts">
import { useTestStore } from './stores'

const Test = useTestStore()

const change = () => {
  Test.$patch((state) => {
    if (state.current >= 10) return
    state.current++
  })
}
</script>
```

#### 通过 $state 修改

通过 $state 修改是将仓库中所有的 state 全部覆盖

```vue
<template>
  <div>pinia：{{ Test.current }}=={{ Test.name }}</div>
  <button @click="change">change</button>
</template>

<script setup lang="ts">
import { useTestStore } from './stores'

const Test = useTestStore()

const change = () => {
  Test.$state = {
    current: 2000,
    name: '小满娃娃',
  }
}
</script>
```

### 借助 action 修改

在 stores/index.ts 的 action 中定义修改 state 的函数，通过 this 来访问到 state 中的数据

> 注意：action 中的函数不能写成箭头函数，箭头函数中没有 this

```ts
import { defineStore } from 'pinia'
import { Names } from './store-name.ts'

export const useTestStore = defineStore(Names.TEST, {
  state: () => {
    return { current: 1, name: '小满' }
  },
  getters: {},
  actions: {
    setCurrent() {
      this.current = 999
    },
  },
})
```

在 App.vue 中调用仓库中的方法修改 state

```vue
<template>
  <div>pinia：{{ Test.current }}=={{ Test.name }}</div>
  <button @click="change">change</button>
</template>

<script setup lang="ts">
import { useTestStore } from './stores'

const Test = useTestStore()

const change = () => {
  Test.setCurrent()
}
</script>
```

action 中的函数可以传参：

stores/index.ts

```ts
import { defineStore } from 'pinia'
import { Names } from './store-name.ts'

export const useTestStore = defineStore(Names.TEST, {
  state: () => {
    return { current: 1, name: '小满' }
  },
  getters: {},
  actions: {
    // 接收参数
    setCurrent(num: number) {
      this.current = num
    },
  },
})
```

App.vue

```vue
<template>
  <div>pinia：{{ Test.current }}=={{ Test.name }}</div>
  <button @click="change">change</button>
</template>

<script setup lang="ts">
import { useTestStore } from './stores'

const Test = useTestStore()

const change = () => {
  // 在调用时传参
  Test.setCurrent(567)
}
</script>
```

## actions

actions 中支持同步和异步代码

```ts
import { defineStore } from 'pinia'
import { Names } from './store-name.ts'

type User = {
  name: string
  age: number
}
const result: User = {
  name: '飞机',
  age: 999,
}
const Login = (): Promise<User> => {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve({
        name: '飞机',
        age: 999,
      })
    }, 2000)
  })
}

export const useTestStore = defineStore(Names.TEST, {
  state: () => {
    return {
      current: 1,
      name: '小飞机',
      user: <User>{},
    }
  },
  actions: {
    async setUser() {
      const res = await Login() // 模拟异步登录功能
      this.user = res
    }
  },
})
```

```vue
<template>
  <div>
    <p>action-user：{{ Test.user }}</p>
    <hr />
    <p>action-name：{{ Test.name }}</p>
    <hr />
  </div>
  <button @click="change">change</button>
</template>

<script setup lang="ts">
import { useTestStore } from './stores'

const Test = useTestStore()

const change = () => {
  Test.setUser()
}
</script>
```

actions 中的函数可以互相调用

```ts
import { defineStore } from 'pinia'
import { Names } from './store-name.ts'

type User = {
  name: string
  age: number
}
const result: User = {
  name: '飞机',
  age: 999,
}
const Login = (): Promise<User> => {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve({
        name: '飞机',
        age: 999,
      })
    }, 2000)
  })
}
export const useTestStore = defineStore(Names.TEST, {
  state: () => {
    return {
      current: 1,
      name: '小飞机',
      user: <User>{},
    }
  },
  actions: {
    async setUser() {
      const res = await Login()
      this.user = res
      this.setName('大飞机') // actions 中的函数可以互相调用
    },
    setName(name: string) {
      this.name = name
    },
  },
})
```

```vue
<template>
  <div>
    <p>action-user：{{ Test.user }}</p>
    <hr />
    <p>action-name：{{ Test.name }}</p>
    <hr />
    <p>getters：{{ Test.newName }}</p>
    <hr />
  </div>
  <button @click="change">change</button>
</template>

<script setup lang="ts">
import { useTestStore } from './stores'

const Test = useTestStore()

const change = () => {
  Test.setUser()
}
</script>
```

## getters

getters 的主要作用类似于 computed 数据修饰并且有缓存

```ts
import { defineStore } from 'pinia'
import { Names } from './store-name.ts'

type User = {
  name: string
  age: number
}
const result: User = {
  name: '飞机',
  age: 999,
}
const Login = (): Promise<User> => {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve({
        name: '飞机',
        age: 999,
      })
    }, 2000)
  })
}
export const useTestStore = defineStore(Names.TEST, {
  state: () => {
    return {
      current: 1,
      name: '小飞机',
      user: <User>{},
    }
  },
  // getters 中的数据可以对 state 中的数据进行修饰，并且可以互相调用
  getters: {
    newName(): string {
      return `$-${this.name}-${this.getUserAge}`
    },
    getUserAge(): number {
      return this.user.age
    },
  },
  actions: {
    async setUser() {
      const res = await Login()
      this.user = res
      this.setName('大飞机')
    },
    setName(name: string) {
      this.name = name
    },
  },
})
```

```vue
<template>
  <div>
    <p>action-user：{{ Test.user }}</p>
    <hr />
    <p>action-name：{{ Test.name }}</p>
    <hr />
    <p>getters：{{ Test.newName }}</p>
    <hr />
  </div>
  <button @click="change">change</button>
</template>

<script setup lang="ts">
import { useTestStore } from './stores'

const Test = useTestStore()

const change = () => {
  Test.setUser()
}
</script>

<style scoped></style>
```

## pinia 中的Api

### $reset

作用：重置 store 中的 state 的所有值重置到他的初始状态

```ts
import { defineStore } from 'pinia'
import { Names } from './store-name.ts'

type User = {
  age: number
  name: string
}

export const useTestStore = defineStore(Names.TEST, {
  state: () => {
    return {
      user: <User>{
        name: '小飞机',
        age: 18,
      },
    }
  },
  getters: {
    newName(): string {
      return `$-${this.user['name']}-${this.getUserAge}`
    },
    getUserAge(): number {
      return this.user['age']
    },
  },
  actions: {
    setUser() {
      setTimeout(() => {
        Object.assign(this.user, {
          name: '大飞机',
          age: 20,
        })
      }, 500)
    },
  },
})
```

```vue
<template>
  <div>
    <p>名字：{{ Test.user['name'] }}，年龄：{{ Test.user['age'] }}</p>
    <hr />
  </div>
  <button @click="change">change</button>
  <button @click="reset">reset</button>
</template>

<script setup lang="ts">
import { useTestStore } from './stores'

const Test = useTestStore()

const change = () => {
  Test.setUser()
}
const reset = () => {
  Test.$reset() // 使用 $reset 重置所有状态
}
</script>
```

点击 change 前：

[![pEVHwqS.png](https://s21.ax1x.com/2025/01/30/pEVHwqS.png)](https://imgse.com/i/pEVHwqS)

点击 change 后：

[![pEVHBVg.png](https://s21.ax1x.com/2025/01/30/pEVHBVg.png)](https://imgse.com/i/pEVHBVg)

点击 reset 后：

[![pEVHwqS.png](https://s21.ax1x.com/2025/01/30/pEVHwqS.png)](https://imgse.com/i/pEVHwqS)

### $subscribe

作用：用于监听 state 的变化

Store.$subscribe((args, state) => {})

**args**：这个参数是一个对象，它包含了订阅的一些元信息，比如storeId（当前store的ID）和type（变化类型，例如direct或patchObject）。args参数让你能够知道是哪个store触发了这个订阅回调，以及变化是如何发生的。

**state**：这个参数是对当前store状态的引用。它让你能够访问到store的最新状态。

```vue
<template>
  <div>
    <p>信息-{{ Test.userInfo }}</p>
    <hr />
    <p>服装：{{ Test.clothes }}</p>
    <hr />
  </div>
  <button @click="change">change</button>
  <button @click="reset">reset</button>
</template>

<script setup lang="ts">
import { useTestStore } from './stores'

const Test = useTestStore()
Test.$subscribe((args, state) => {
  console.log(args)
  console.log(state)
})

const change = () => {
  Test.setUser()
}
const reset = () => {
  Test.$reset() // 使用 $reset 重置所有状态
}
</script>
```

[![pEVHRMV.png](https://s21.ax1x.com/2025/01/30/pEVHRMV.png)](https://imgse.com/i/pEVHRMV)

### $onAction

作用：用来监听 action 和它们的结果

Test.$onAction((args) => {}, \[true/false])

第一个参数：

**srgs.name**：action 名称
**srgs.store**：store 实例
**srgs.args**：传递给 action 的参数数组
**srgs.after**：在 action 返回或解决后的钩子
**srgs.onError**：action 抛出或拒绝的钩子、

第二个参数（可选，默认为 false）：

**true/false**：默认情况下，action 订阅器会被绑定到添加它们的组件上(如果 store 在组件的 setup() 内)。这意味着，当该组件被卸载时，它们将被自动删除。如果你想在组件卸载后依旧保留它们，请将 true 作为第二个参数传递给 action 订阅器，以便将其从当前组件中分离

```vue
<template>
  <div>
    <p>信息-{{ Test.userInfo }}</p>
    <hr />
    <p>服装：{{ Test.clothes }}</p>
    <hr />
  </div>
  <button @click="change">change</button>
  <button @click="reset">reset</button>
</template>

<script setup lang="ts">
import { useTestStore } from './stores'

const Test = useTestStore()

Test.$onAction((args) => {
  console.log(args)
})

const change = () => {
  Test.setUser()
}
const reset = () => {
  Test.$reset() // 使用 $reset 重置所有状态
}
</script>
```
