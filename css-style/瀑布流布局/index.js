import { getImageListApi } from './request.js'

const container = document.querySelector('.container') // 获取父容器
let imageList = [] // 图片地址列表
const IMG_WIDTH = 200 // 图片宽度
const SPACE_WIDTH = 10 // 图片间距

// 获取列的数量
const cal = () => {
  const container_width = container.clientWidth // 容器宽度
  const columns_num = Math.floor(container_width / IMG_WIDTH) // 列数
  // 容器宽度
  container.style.width = `${Math.floor((window.innerWidth * 0.8) / IMG_WIDTH) * IMG_WIDTH + (columns_num + 1) * SPACE_WIDTH}px`
  // 计算列的数量
  return columns_num
}
cal()

// 获取图片列表
const getImageList = async () => {
  // TODO:更换图片来源
  const res = await getImageListApi()
  imageList = res.data
  // 创建图片元素并加入到容器
  imageList.forEach((item) => {
    const img = document.createElement('img')
    img.src = item.img_url // 设置图片地址
    img.width = IMG_WIDTH // 设置图片宽度
    img.onload = setPositions // 每张图片加载好后，立刻设置位置
    container.appendChild(img)
  })
}
getImageList()

// 设置每张图片的位置
const setPositions = () => {
  // 获取列的数量
  const columns_num = cal()
  // 该数组的长度为列的数量，每个元素代表该列的高度
  const arr_height = new Array(columns_num)
  // 设置初始值，将数组的每一项填充为0
  arr_height.fill(0)
  for (let i = 0; i < container.children.length; i++) {
    const img = container.children[i]
    // 找到这几列中高度最小的值，作为当前图片的纵坐标
    const min_height = Math.min.apply(null, arr_height)
    img.style.top = min_height + SPACE_WIDTH + 'px'
    // 找到这个值在arr_height中的索引值，也就是使用的是第几列的高度，重新设置该列的高度
    const index = arr_height.indexOf(min_height)
    arr_height[index] += img.height + SPACE_WIDTH // 注意：要加上间距的值
    // 设置图片的横坐标
    img.style.left = index * IMG_WIDTH + SPACE_WIDTH * (index + 1) + 'px'
  }
  // 设置容器的最大高度
  container.style.height = Math.max.apply(null, arr_height) + 'px'
}

// 节流
let timer = null
window.onresize = () => {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    cal()
    setPositions()
  }, 500)
}
