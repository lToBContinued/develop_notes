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
