# \$attrs、$listeners

> **$attrs：**包含了父作用域中`不包含在props中的属性`，这些属性可以在组件内部使用，也可以通过 v-bind="$attrs"传递给子组件使用。
>
> **$listeners：**包含了父作用域中的(不含.sync 修饰器的)v-on 事件监听器，这些监听器可以在组件内部使用，也可以通过 v-on="$listeners"传递给子组件使用。

## $attrs 的使用

**父组件内：**

```vue

<script>
  import hintButton from '@/views/test/components/hintButton.vue'

  export default {
    name: 'testIndex',
    components: {
      hintButton,
    },
  }
</script>

<template>
  <div>
    <!--给子组件传递多个属性-->
    <hint-button
      class="btn"
      status="primary"
      size="mini"
      style="height: 100px"
      content="一个可爱的按钮"
      nickname="一个按钮的昵称"
      age="18"
    ></hint-button>
  </div>
</template>
```

**子组件内：**

```vue

<script>
  export default {
    name: 'hintButton',
    props: ['age'], // 使用props接收一个
    mounted() {
      // $attrs 接收父组件传递过来的除class、style和子组件props中所接受的之外的所有属性值
      console.log(this.$attrs)
      console.log(this.age)
    },
  }
</script>

<template>
  <div>
    <vxe-button v-bind="$attrs"></vxe-button>
  </div>
</template>
```

运行结果：

![](https://raw.githubusercontent.com/lToBContinued/FileWarehouse/main/Vue/vue001.png)

## $listener 的使用

**父组件中：**

```vue

<script>
  import hintButton from '@/views/test/components/hintButton.vue'

  export default {
    name: 'testIndex',
    components: {
      hintButton,
    },
    methods: {
      // 按钮的点击事件
      handler() {
        alert('点击了按钮')
      },
    },
  }
</script>

<template>
  <div>
    <!--给子组件传递多个属性-->
    <hint-button
      class="btn"
      status="primary"
      size="mini"
      style="height: 100px"
      content="一个可爱的按钮"
      @click="handler"
    ></hint-button>
  </div>
</template>
```

**子组件中：**

```vue

<script>
  export default {
    name: 'hintButton',
  }
</script>

<template>
  <div>
    <!--使用$listener接收父组件传递过来的所有事件-->
    <vxe-button v-bind="$attrs" v-on="$listeners"></vxe-button>
  </div>
</template>
```

运行结果：

![](https://raw.githubusercontent.com/lToBContinued/FileWarehouse/main/Vue/vue002.png)

# .sync 修饰符

## 子组件修改父组件中的变量值

### 不使用sync

vue中父组件是使用v-bind(缩写为:)给子组件传入参数，然后子组件通过prop属性接收该参数。此时我们可以给子组件传入一个函数，子组件通过调用传入的函数来改变父组件中参数的值。

**父组件中：**

```vue

<script>
  import child from '@/views/test/components/child.vue'

  export default {
    name: 'testIndex',
    data() {
      return {
        numParent: '222',
      }
    },
    components: {
      child,
    },
  }
</script>

<template>
  <div>
    <!--子组件通过触发父组件中的事件来修改父组件的变量值-->
    <child :num="numParent" @setNum="(res) => (numParent = res)"></child>
    {{ numParent }}
  </div>
</template>
```

**子组件中：**

```vue

<script>
  export default {
    name: 'childIndex',
    methods: {
      setNum() {
        // 传统的事件绑定，子组件通过 $emit 通知父组件，触发父组件中的事件修改父组件中的数据
        this.$emit('setNum', 666)
      },
    },
  }
</script>

<template>
  <div>
    <vxe-button @click="setNum">点击改变数字</vxe-button>
  </div>
</template>
```

### 使用sync

上述方法较复杂，使用sync可简化写法

**父组件中：**

```vue

<script>
  import child from '@/views/test/components/child.vue'

  export default {
    name: 'testIndex',
    data() {
      return {
        numParent: '222',
      }
    },
    components: {
      child,
    },
  }
</script>

<template>
  <div>
    <!--父组件给子组件传入一个 setNum 函数 -->
    <child :num.sync="numParent"></child>
    {{ numParent }}
  </div>
</template>
```

**子组件中：**

```vue

<script>
  export default {
    name: 'childIndex',
    methods: {
      setNum() {
        // 子组件通过调用这个函数来实现修改父组件的状态
        this.$emit('update:num', 666)
      },
    },
  }
</script>

<template>
  <div>
    <vxe-button @click="setNum">点击改变数字</vxe-button>
  </div>
</template>
```

> 上述两种方式都可以将numParent的值由222变为666，其中父组件中绑定的参数后面加了一个`.sync`，子组件中的事件名称被换成了update:num，如下：
> **update：**固定部分，vue约定俗成的，注意必须添加update：的前缀才能正确触发事件
> **num：**是要修改的参数的名称，是我们手动配置的，与传入的参数名字对应起来

## 实现父子组件双向绑定

**父组件中：**

```vue

<script>
  import child from '@/views/test/components/child.vue'

  export default {
    name: 'testIndex',
    data() {
      return {
        numParent: '222',
      }
    },
    components: {
      child,
    },
  }
</script>

<template>
  <div>
    <child :num.sync="numParent"></child>
    父组件：{{ numParent }}
  </div>
</template>
```

**子组件中：**

```vue

<script>
  export default {
    name: 'childIndex',
    props: ['num'],
    methods: {
      setNum() {
        // 子组件通过调用这个函数来实现修改父组件的状态
        this.$emit('update:num', 666)
      },
    },
  }
</script>

<template>
  <div>
    <vxe-button @click="setNum">点击改变数字</vxe-button>
    <br />
    子组件：{{ num }}
  </div>
</template>
```

点击按钮前：![](https://raw.githubusercontent.com/lToBContinued/FileWarehouse/main/Vue/vue003.png)

点击按钮后：![](https://raw.githubusercontent.com/lToBContinued/FileWarehouse/main/Vue/vue004.png)

# 异步组件

## 顶层 await 技术

> 在 JavaScript 中，await 关键字传统上只能在 async 函数内部使用，这意味着你只能在这些函数的范围内使用它。这在你想在模块顶层（任何函数之外）编写异步代码时会带来挑战。你需要将你的代码包裹在一个 async 函数中，或者使用像立即调用异步函数 (IIAF) 这样的变通方法。
> 顶层 await 消除了这种限制，让你可以在 ES 模块代码的顶层直接使用 await 关键字。这样一来，无需人为地将异步代码包裹在 async 函数中，简化了异步代码执行。

以下是一个例子：

```js
// 旧方法（在顶层 `await` 之前）
(async () => {
    const data = await fetchData()
    console.log(data)
})()
 
// 新方法（使用顶层 `await`）
const data = await fetchData()
console.log(data)
```

**顶层 await 技术改善了模块交互：**

在顶层 await 出现之前，管理模块之间的异步依赖关系可能很麻烦。需要异步导入数据的模块必须仔细地使用 promise 或其他 async 函数来协调执行。现在，有了顶层 await，你可以在一个模块中无缝地加载异步数据，并在另一个模块中使用它。例如：

```js
// dataModule.js
export const data = await fetchData();
 
// app.js
import { data } from './dataModule.js';
 
console.log(data);
```

## 封装异步组件

> 异步组件的作用可以参考 element-plus 中的骨架屏，在数据没请求回来时，显示骨架屏，拿到请求数据后展示数据

sync.vue 用于展示数据

```vue
<template>
  <div class="sync">
    <div class="sync-content">
      <div><img :src="data.url" alt="" width="100" /></div>
      <div class="sync-pop">
        <div>{{ data.name }}</div>
        <div>&nbsp;{{ data.age }}岁</div>
      </div>
    </div>
    <hr />
    <div>
      <p>
        {{ data.desc }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { axios } from '@/http/axios.ts'

interface Data {
  data: {
    name: string
    age: number
    url: string
    desc: string
  }
}
// 在 es7 之后可以直接使用顶层 await 技术，它下面所有的代码都会变成异步的
const { data } = await axios.get<Data>('./data.json')
</script>

<style scoped lang="scss">
.sync {
  width: 600px;
  background-color: #efefef;
  padding: 10px 30px;
}

.sync-content {
  display: flex;
  align-items: center;
}

.sync-pop {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

img {
  border-radius: 50%;
}

.desc {
  height: fit-content;
}
</style>

```

vu-skeleton.vue 骨架屏组件，骨架屏组件仅作为请求数据没加载出来时候的占位展示

```vue
<template>
  <div class="sk">
    <div class="sk-2">
      <div></div>
      <div></div>
    </div>
    <hr />
    <div class="sk-3"></div>
    <div class="sk-3"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.sk {
  width: 600px;
  background-color: #f8f8f8;
  padding: 10px 30px;
}

.sk-2 {
  display: flex;
  align-items: center;

  div:nth-child(1) {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #ccc;
  }

  div:nth-child(2) {
    width: 100px;
    height: 20px;
    background-color: #ccc;
    margin-left: 10px;
  }
}

.sk-3 {
  width: 100%;
  height: 20px;
  margin-bottom: 10px;
  background-color: #ccc;
}
</style>

```

home.vue 页面组件

1. 由于 sync.vue 是一个异步组件，所以引入异步组件的时候需要使用 defineAsyncComponent 函数去做引入，defineAsyncComponent 函数有两种书写风格，详见下面代码
2. 想要展示异步组件必须使用 \<Suspense>\</Suspense>，Suspense 组件有两个插槽，第一个插槽是默认插槽，放的是要展示的组件，第二个插槽是 fallback，在异步代码还没完成时展示它

```vue
<template>
  <Suspense>
    <template #default>
      <sync-vue></sync-vue>
    </template>
    <template #fallback>
      <vu-skeleton></vu-skeleton>
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import VuSkeleton from '@/components/vu-skeleton.vue'

// 第一种书写风格：传一个回调函数，通过回调函数使用import函数模式引入组件
const SyncVue = defineAsyncComponent(() => import('@/components/vu-sync.vue'))
// 第二种书写风格：传入一个对象的方式，用的比较少
// const SyncVue = defineAsyncComponent({})
</script>

<style scoped lang="scss"></style>
```

# Teleport 传送组件

## 什么是 Teleport 组件

teleport 是一个内置组件，我们都知道 HTML 是由层级关系的，Vue3 中的组件也是有层级关系的。假如在父组件中引用了一个子组件，那么渲染成页面后这个子组件 HTML 也是必然被父组件 HTML 包含的。但是如果把子组件放置到了 teleport 组件中，那么我们就可以指定该子组件渲染到父组件之外的其它 DOM 节点下，比如 body 或者其它的 DOM 等等。这就有点类似与“传送”了。

## 场景

例：封装一个弹窗组件

```vue
<template>
  <div class="dialog">这是一个弹窗</div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.dialog {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 300px;
  background-color: #ccc;
}
</style>
```

在使用它的父组件 App.vue 中：

```vue
<template>
  <div class="container">
    父组件
    <vu-dialog></vu-dialog>
  </div>
</template>

<script setup lang="ts">
import VuDialog from '@/components/vu-dialog.vue'
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 50vh;
  background-color: lightblue;
}
</style>
```

现在的弹窗组件是被父组件 container 容器包裹的状态，我们注意到在弹窗组件的样式中，有一个 position: absolute; 的样式，在 App.vue 中的 container 的样式中，没有再写 position 的样式，此时的弹窗组件是相对于整个窗口定位的：

[![pEk0Ukn.png](https://s21.ax1x.com/2025/01/19/pEk0Ukn.png)](https://imgse.com/i/pEk0Ukn)

但是如果在 container 的样式中添加 position: relative; 后，弹窗就会变成相对于父容器定位。

[![pEk0rXF.png](https://s21.ax1x.com/2025/01/19/pEk0rXF.png)](https://imgse.com/i/pEk0rXF)

但我们通常不想要这样，而是想让弹窗相对于窗口定位，此时需要用到 **Teleport** 组件，它可以将其插槽内容渲染到 DOM 中的另一个位置。

## 组件的属性

Teleport 组件有三个属性：to，disabled，defer

1. to：必填项。指定目标容器，可以是选择器或实际元素。
2. disabled：选填。默认为false，当值为 `true` 时，内容将保留在其原始位置，而不是移动到目标容器中。可以动态更改。
3. defer：选填。默认为false，当值为 `true` 时，Teleport 将推迟，直到应用的其他部分挂载后再解析其目标。(3.5+)

将弹窗组件放到 Teleport 组件中，并设置 to 属性为 body，即将弹窗组件挂载到 body 容器上

```vue
<template>
  <div class="container">
    父组件
    <Teleport to="body">
      <vu-dialog></vu-dialog>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import VuDialog from '@/components/vu-dialog.vue'
</script>

<style scoped lang="scss">
.container {
  position: relative;
  width: 100%;
  height: 50vh;
  background-color: lightblue;
}
</style>
```

[![pEk0BlT.png](https://s21.ax1x.com/2025/01/19/pEk0BlT.png)](https://imgse.com/i/pEk0BlT)