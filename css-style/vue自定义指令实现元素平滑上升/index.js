/**
 * @describe 元素平滑上升自定义指令
 * @params {distance} Number 元素上升的距离
 * @params {duration} Number 动画持续时间
 * @example
 *    <div v-slide-in></div>
 *    <div v-slide-in="{distance: 100, duration: 300}"></div>
 */
let DISTANCE = 100
let DURATION = 300
// 创建一个弱引用的Map对象，用于存储元素和动画之间的映射关系，在不需要时，可以自动释放内存。
const map = new WeakMap()

// 创建交叉观察器，观察元素和视口有没有重叠
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
        // 如果用户给了参数，则使用用户的参数
        if (binding.value) {
          DISTANCE = binding.value.distance
          DURATION = binding.value.duration
        }
        // 如果进入页面时，元素不在视口之下，则不播放动画
        if (!isBelowViewport(el)) {
          return
        }
        // 创建一个元素的动画
        const animation = el.animate(
          [
            // ☀ 关键帧，可以在这里修改动画效果 ☀
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
        animation.pause() // 一开始先暂停动画，在进入视口时再播放
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
