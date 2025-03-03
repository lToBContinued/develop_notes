<template>
  <div class="scroll-container">
    <x-scroll>
      <div class="card-list">
        <div class="card" v-for="(item, index) in 5" :key="index">{{ item }}</div>
      </div>
    </x-scroll>
  </div>
</template>

<script setup lang="ts">
import XScroll from '@/component/x-scroll.vue'
</script>

<style scoped lang="scss">
.card-list {
  display: flex;
}

.card {
  width: 800px;
  height: 300px;
  background: linear-gradient(to right, #adcbef, #fff);
  flex: 1 0 auto;
}
</style>
