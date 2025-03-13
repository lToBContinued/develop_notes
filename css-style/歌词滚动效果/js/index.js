// 数据逻辑 ========================================================
/**
 * @description 解析歌词字符串
 * @return {Array[Object]} 歌词数组
 * @example
 * [
 *   {
 *     time: '1.06',
 *     words: '我的心是不夜城',
 *   }
 * ]
 */
function parseLrc() {
  const result = [] // 结果数组
  // 分割每一行歌词
  lrc.split('\n').forEach((item) => {
    // 分割时间部分和歌词部分
    const parts = item.split(']')
    const timeStr = parts[0].substring(1) // 分割时间部分
    const obj = {
      time: parseTime(timeStr),
      words: parts[1],
    }
    result.push(obj)
  })
  return result
}

/**
 * @description 将时间字符串转换为数字
 * @param {String} timeStr 时间字符串
 * @return {Number} 时间数字
 * @example
 * parseTime('00:01.42') // 1.42
 * parseTime('01:01:42') // 61.42
 */
function parseTime(timeStr) {
  const parts = timeStr.split(':')
  return +parts[0] * 60 + +parts[1]
}

// 处理后的歌词数据
const lrcData = parseLrc()
// 获取需要的dom
const doms = {
  audio: document.querySelector('audio'),
  ul: document.querySelector('.container ul'),
  container: document.querySelector('.container'),
}

/**
 * @description 计算出在当前播放器播放到第几秒的情况下，lrcData数组中，应该高亮显示的歌词的下标
 * @return {Number} 歌词下标，如果没有任何一句歌词需要显示，则得到-1
 */
function findIndex() {
  // 播放器当前时间
  const curTime = doms.audio.currentTime
  const curPart = lrcData.find((item) => {
    return item.time > curTime
  })
  const curIndex = lrcData.indexOf(curPart) - 1
  return curIndex === Number(-2) ? lrcData.length - 1 : curIndex
}

// 界面逻辑 ========================================================
/**
 * @description 创建歌词列表元素
 */
function createLrcElements() {
  // 在有大量需要修改的dom时，尽量使用文档片段
  // 文档片段不会在页面中显示，将零散的dom整合到文档片段中，再用文档片段统一插入到dom中，可以提高性能
  const frag = document.createDocumentFragment() // 文档片段
  lrcData.forEach((item) => {
    const li = document.createElement('li')
    li.textContent = item.words
    frag.appendChild(li)
  })
  doms.ul.appendChild(frag)
}

createLrcElements()

const containerHeight = doms.container.clientHeight // 容器高度
const liHeight = doms.ul.children[0].clientHeight // 歌词高度
const maxOffset = doms.ul.clientHeight - containerHeight // 最大偏移量

/**
 * @description 设置ul元素的偏移量
 */
function setOffset() {
  const index = findIndex() // 获得当前歌词下标
  const h1 = liHeight * index + liHeight / 2
  let offset = h1 - containerHeight / 2
  if (offset < 0) {
    offset = 0
  }
  if (offset > maxOffset) {
    offset = maxOffset
  }
  doms.ul.style.transform = `translateY(-${offset}px)`
  let li = doms.ul.querySelector('.active')
  if (li) {
    li.classList.remove('active')
  }
  li = doms.ul.children[index]
  if (li) {
    li.classList.add('active')
  }
}
setOffset()

// 事件逻辑 ========================================================
doms.audio.addEventListener('timeupdate', setOffset)
