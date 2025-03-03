<template>
  <div v-size-ob="handleResize" class="scroll-container">
    <div class="v-scroll">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

declare global {
  interface HTMLElement {
    _resizeObserver?: ResizeObserver
  }
}

const s = reactive({
  width: 0,
  height: 0,
})

const handleResize = (size: { width: number; height: number }) => {
  console.log(size)
  s.width = size.width
  s.height = size.height
}
</script>

<style scoped lang="scss">
.scroll-container {
  width: 100%;
  height: 300px;
}

.v-scroll {
  width: calc(v-bind('s.height') * 1px);
  height: calc(v-bind('s.width') * 1px);
  position: relative;
  overflow: auto;
  transform: rotate(-90deg) translateX(-100%);
  transform-origin: 0 0;

  &::-webkit-scrollbar {
    display: none;
  }
}

.content {
  position: absolute;
  left: 100%;
  transform: rotate(90deg);
  transform-origin: 0 0;
}
</style>
