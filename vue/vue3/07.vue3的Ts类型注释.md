# vue3 组合式 API 与 Ts 类型标注

## 为组件的 props 标注类型

### 通过泛型参数来定义 props 的类型

```vue
<script setup lang="ts">
const props = defineProps<{
	title: string // 没有“?”表示这个值不是必须传的
	total?: number // 有“?”表示这个值是必须传的，相当于 required: true
	userList: string[]
}>()
</script>
```

也可以将 props 的类型移入一个单独的接口中：

```vue
<script setup lang="ts">
interface propsType {
	title: string
	total?: number
	userList: string[]
}

const props = defineProps<propsType>()
</script>
```

> 基于类型声明的方式声明 props 时，如果需要默认值，需要使用 withDefaults 编译器宏

```vue
<script setup lang="ts">
interface propsType {
	title: string
	total: number
	userList: string[]
}

const props = withDefaults(defineProps<propsType>(), {
	title: '默认标题',
	usrerList: () => ['用户1', '用户2'],
})
</script>
```

### 使用 ts 工具类型

用于在用运行时 props 声明时给一个 prop 标注更复杂的类型定义。

```vue
<script setup lang="ts">
const props = defineProps({
	title: {
		type: String,
		default: '默认标题',
		required: true,
	},
	userList: {
		type: Array as PropType<string[]>, // 使用ts工具类型
		default: () => [],
		required: true,
	},
})
</script>
```

## 为组件的 emits 标注类型

在 \<script setup> 中，emit 函数的类型标注也可以通过运行时声明或是类型声明进行：

```vue

<script setup lang="ts">
  // 运行时
  const emit = defineEmits(['change', 'update'])

  // 基于选项
  const emit = defineEmits({
    change: (id: number) => {
      // 返回 `true` 或 `false`
      // 表明验证通过或失败
    },
    update: (value: string) => {
      // 返回 `true` 或 `false`
      // 表明验证通过或失败
    },
  })

  // 基于类型
  const emit = defineEmits<{
    (e: 'change', id: number): void
    (e: 'update', value: string): void
  }>()

  // 3.3+: 可选的、更简洁的语法
  const emit = defineEmits<{
    change: [id: number]
    update: [value: string]
  }>()
</script>
```

## 为 ref() 标注类型

### 使用 Ref 这个类型

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')
const userList: Ref<string[]> = ref([])

year.value = 2020 // 成功，不会报错！
userList.value = ['张三', '李四'] // 成功，不会报错！
</script>
```

### 在调用 ref() 时传入一个泛型参数

```vue
<script setup lang="ts">
import { ref } from 'vue'

// 得到的类型：Ref<string | number>
const year = ref<string | number>('2020')
// 得到的类型：Ref<string[]>
const userList = ref<string[]>([])

year.value = 2020 // 成功！
userList.value = ['张三', '李四'] // 成功，不会报错！
</script>
```

## 为 reactive() 标注类型

要显式地标注一个 reactive 变量的类型，可以使用接口

```vue
<script setup lang="ts">
import { reactive } from 'vue'

interface BookType {
	name: string
	author: string
	price: number
}

const book: BookType = reactive({
	name: '西游记',
	author: '吴承恩',
	price: 100,
})
</script>
```

> 不推荐使用 reactive() 的泛型参数，因为处理了深层次 ref 解包的返回值与泛型参数的类型不同。

## 为 computed() 标注类型

可以通过泛型参数显式指定类型

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(2)

const double = computed<number>(() => {
	// 若返回值不是 number 类型则会报错
	return count.value * 2
})
console.log(double.value) // 4
</script>
```

## 为事件处理函数标注类型

> 在处理原生 DOM 事件时，应该为我们传递给事件处理函数的参数正确地标注类型。没有类型标注时，这个 event 参数会隐式地标注为 any 类型。这也会在 tsconfig.json 中配置了 "strict": true 或 "noImplicitAny": true 时报出一个 TS 错误。因此，建议显式地为事件处理函数的参数标注类型。此外，在访问 event 上的属性时可能需要使用类型断言。

```vue
<template>
	<input type="text" @change="handleChange" />
</template>

<script setup lang="ts">
function handleChange(e: Event) {
	console.log((event.target as HTMLInputElement).value)
}
</script>
```

## 为 provide / inject 标注类型

> provide 和 inject 通常会在不同的组件中运行。要正确地为注入的值标记类型，Vue 提供了一个 InjectionKey 接口，它是一个继承自 Symbol 的泛型类型，可以用来在提供者和消费者之间同步注入值的类型。**建议将注入 key 的类型放在一个单独的文件中，这样它就可以被多个组件导入。**

1. 将 InjectionKey 定义的数据类型放到 keys/index.ts 下维护

```ts
// keys/index.ts
import { InjectionKey, Ref } from 'vue'
// 限制了 provide 导出的数据必须是 ref 且 string 类型
export const nameKey: InjectionKey<Ref<string>> = Symbol()
// 限制了 provide 导出的数据必须是 number
export const idKey: InjectionKey<Ref<number>> = Symbol()
// 限制了 provide 导出的数据必须是函数且参数为 number 和 string
export const getUserinfoKey: InjectionKey<(userId: number, username: string) => void> = Symbol()
```

2. 在 A.vue 文件中调用 provide 导出数据，第一个参数则是我们上面定义好的数据类型，第二个参数是对应数据类型的值

```vue
<template>
	<div class="home">
		<B></B>
	</div>
</template>

<script setup lang="ts">
import B from '@/component/B.vue'
import { idKey, getUserinfoKey, nameKey } from '@/keys/index.ts'
import { provide, ref } from 'vue'

const id = ref(1)
const name = ref('张三')
const getUserinfo = (userId: number, username: string) => {
	id.value = userId
	name.value = username
}

provide(nameKey, name)
provide(idKey, id)
provide(getUserinfoKey, getUserinfo)
</script>
```

3. 在 B.vue 文件中导入数据

```vue
<template>
	<div>id: {{ id }} --- name: {{ name }}</div>
	<button @click="handelChange">修改信息</button>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { idKey, getUserinfoKey, nameKey } from '@/keys/index.ts'

const id = inject(idKey)
const name = inject(nameKey)
const getUserinfo = inject(getUserinfoKey)

const handelChange = () => {
	getUserinfo(10001, '李四')
}
</script>
```

## 为模板引用标注类型

> 注意为了严格的类型安全，有必要在访问 el.value 时使用可选链或类型守卫。这是因为直到组件被挂载前，这个 ref 的值都是初始的 null，并且在由于 v-if 的行为将引用的元素卸载时也可以被设置为 null。

```vue
<template>
	<div ref="div">我是dom</div>
	<input ref="input" @change="showValue" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const div = ref<HTMLDivElement>() // 普通dom声明
const input = ref<HTMLInputElement>() // 普通dom声明

onMounted(() => {
	console.log(div.value?.innerText) // 我是dom
})

const showValue = () => {
	console.log(input.value?.value)
}
</script>
```

## 为组件模板引用标注类型

为了获取导入组件的实例类型，我们需要先通过 typeof 获取其类型，然后使用 TypeScript 的内置 InstanceType 工具提取其实例类型：

```vue
<template>
	<children-comp ref="childrenRef"></children-comp>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChildrenComp from '@/component/children-comp.vue'

const childrenRef = ref<InstanceType<typeof ChildrenComp>>() // 组件声明
</script>
```

如果组件的具体类型无法获得，或者你并不关心组件的具体类型，那么可以使用 ComponentPublicInstance。**这只会包含所有组件都共享的属性**，比如 $el。

```vue
<template>
	<children-comp ref="childrenRef"></children-comp>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, ref } from 'vue'
import ChildrenComp from '@/component/children-comp.vue'

const childrenRef = ref<ComponentPublicInstance>() // 通用的组件声明
</script>
```
