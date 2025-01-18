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
