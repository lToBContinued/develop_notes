/**
 * @describe 元素平滑上升自定义指令
 * @params {distance} Number 元素上升的距离
 * @params {duration} Number 动画持续时间
 * @example
 *    <div v-slide-in="{distance: 100, duration: 300}"></div>
 *    <div v-slide-in="{distance: 100, duration: 300}"></div>
 */
let DISTANCE = 100
let DURATION = 300
// 创建一个弱引用的Map对象，用于存储元素和动画之间的映射关系，在不需要时，可以自动释放内存。
const map = new WeakMap()

// 创建观察器
const ob = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      // 该元素与视口相交
      // 播放动画
      const animation = map.get(entry.target)
      if (animation) {
        animation.play()
        // 动画播放完后移除监听器，避免再次触发动画
        ob.unobserve(entry.target)
      }
    }
  }
})

// 判断元素是否在视口之下
const isBelowViewport = (el) => {
  const rect = el.getBoundingClientRect()
  return rect.top - DISTANCE > window.innerHeight
}

export const vSlideIn = {
  install(app) {
    app.directive('slide-in', {
      mounted(el, binding) {
        binding.value ? (DISTANCE = binding.value.distance) : DISTANCE
        binding.value ? (DURATION = binding.value.duration) : DURATION
        // 如果进入页面时，元素不在视口之下，则不播放动画
        if (!isBelowViewport(el)) {
          return
        }
        const animation = el.animate(
          [
            {
              transform: `translateY(${DISTANCE}px)`,
              // opacity: 0,
            },
            {
              transform: `translateY(0)`,
              opacity: 1,
            },
          ],
          {
            duration: DURATION,
            easing: 'ease-in-out',
            fill: 'forwards',
          },
        )
        animation.pause()
        ob.observe(el) // 对元素进行观察
        map.set(el, animation) // 将元素和动画对应起来
      },
      // 元素卸载后取消观察
      unmounted(el) {
        ob.unobserve(el)
      },
    })
  },
}
