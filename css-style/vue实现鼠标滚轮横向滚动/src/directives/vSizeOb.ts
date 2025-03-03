import type { App, DirectiveBinding } from 'vue'

export default function (app: App): void {
  app.directive('size-ob', {
    mounted: (el: HTMLElement, binding: DirectiveBinding): void => {
      const callback = binding.value
      const ob: ResizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]): void => {
        const { width, height }: { width: number; height: number } = entries[0].contentRect
        callback({ width, height })
      })
      ob.observe(el)
      el._resizeObserver = ob
    },
    unmounted: (el: HTMLElement): void => {
      el._resizeObserver?.unobserve(el)
      delete el._resizeObserver
    },
  })
}
