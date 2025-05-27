# webSocket

## 什么是 webSocket

**WebSocket** 是一种基于 TCP 的应用层协议，旨在解决传统 HTTP 协议在实时通信场景下的局限性。它提供了客户端与服务器之间的全双工^[1]^持久连接^[2]^，允许双方在任意时刻主动发送和接收数据，无需客户端频繁发起请求。其设计目标是在单个 TCP 连接上实现高效的实时通信，降低网络延迟和资源消耗。

[1] 全双工：客户端和服务器可同时发送和接收数据，无需等待对方响应，类似于实时聊天中的 “双向对话”。

[2] 持久连接：TCP 连接在握手后持续保持，避免传统 HTTP 短连接的 “三次握手 + 四次挥手” 开销，适合高频通信场景。

举个栗子：

1. 传统 **HTTP** 通信的方式：

想象你是一个餐厅服务员，顾客（浏览器）点餐（发送 HTTP 请求）后：

​	1. 单向请求：顾客必须主动开口点餐，服务员不会主动问 “你要不要再点些什么？”

​	2. 一问一答：顾客问 “我的牛排好了吗？”，服务员回答后对话就结束了，服务员不会主动更新状态。

​	3. 频繁请求：如果顾客想知道牛排进度，必须每隔 5 分钟问一次（轮询），浪费双方时间。

这就是传统 HTTP 的问题：**只能由客户端主动发起请求，服务器无法主动推送消息**。

2. **webSocket** 的通信方式：

webSocket 相当于给顾客和服务员都配备了对讲机：

​	1. 双向通信：顾客和服务员可以随时通过对讲机交流，不需要顾客每次都招手。
	2. 长连接：对讲机一直保持开启状态（连接不中断），服务员可以主动说：“您的牛排好了！”
​	3. 实时更新：顾客不需要每隔 5 分钟问一次，服务员做好菜就直接通知。

对应到技术场景：

- 客户端（浏览器、小程序）和服务器通过 webSocket 建立连接后：
  - 客户端可以随时发消息给服务器。
  - 服务器也能随时推送消息给客户端。
  - 连接会保持活跃，直到其中一方主动关闭。

我们平时用到的微信、QQ、股票、体育比赛、游戏、多人办公这些场景都用到了 webSocket。

## webSocket 入门

https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback

 ### 安装 webSocket

```bash
pnpm add ws @types/ws
```

### 创建一个最简单的 ws 服务

1. 引入 ws

```js
const ws = require('ws')
```

2. 使用 ws 中的 WebSocketServer 构造函数创建一个服务器实例

```js
const ws = require('ws')

const wss = new ws.WebSocketServer({ port: 8080 })

// 或者直接在 ws 中结构赋值出 WebSocketServer 类
// const { WebSocketServer } = require('ws')
// const wss = new WebSocketServer({ port: 8080 })
```

3. 与客户端建立连接

服务端：

监听 wss 的 connection 事件，这个事件在客户端成功建立 WebSocket 连接时被触发。它的处理函数接收两个参数

```js
const ws = require('ws')

const wss = new ws.WebSocketServer({ port: 8080 })

wss.on('connection', (ws, req) => {
  ws.send('ws服务端连接成功！')
})
```

(ws, req)=>{}

- **ws**：客户端的 WebSocket 实例
- **req**：req是客户端发送过来的 HTTP GET 请求，里面包含 query 参数和一些其他的信息。

客户端：

创建一个 WebSocket 实例，并传入一个需要连接的 url，这是 WebSocket 服务器将响应的 url，并监听 ws 的 open 事件，这个事件在客户端与服务器之间的 WebSocket 连接**成功建立时**触发

```js
<template>
  <div style="padding: 10px"></div>
</template>

<script setup>
import { onMounted } from 'vue'
let ws = null

onMounted(() => {
  initWs()
})

const initWs = () => {
  ws = new WebSocket('ws://localhost:8080')
  // 使用 addEventListener 也可以
  ws.onopen = () => {
    console.log('onopen-连接建立成功')
  }
}
</script>
```

如果我们可以在网络选项卡-接套字中接收到来自服务端的消息，说明连接成功了！

[![pEvhyTK.png](https://s21.ax1x.com/2025/05/18/pEvhyTK.png)](https://imgse.com/i/pEvhyTK)

### 发送与接收消息

