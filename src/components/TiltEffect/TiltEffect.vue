<template>
  <div
    ref="tiltRef"
    class="tilt-container"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div
      class="tilt-inner"
      :style="{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${currentScale}, ${currentScale}, ${currentScale})`,
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义props，允许自定义倾斜程度
const props = defineProps({
  maxTilt: {
    type: Number,
    default: 10,
  },
  hoverScale: {
    type: Number,
    default: 1.0,
  },
})

const tiltRef = ref<HTMLElement | null>(null)
const rotateX = ref(0)
const rotateY = ref(0)
const currentScale = ref(1)

const handleMouseMove = (event: MouseEvent) => {
  if (!tiltRef.value) return

  const element = tiltRef.value
  const rect = element.getBoundingClientRect()

  // 计算鼠标在元素内的相对位置（0-1）
  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height

  // 计算倾斜角度
  rotateX.value = (0.5 - y) * props.maxTilt * 2
  rotateY.value = (x - 0.5) * props.maxTilt * 2
  currentScale.value = props.hoverScale
}

const handleMouseLeave = () => {
  rotateX.value = 0
  rotateY.value = 0
  currentScale.value = 1
}
</script>

<style scoped>
.tilt-container {
  @apply relative w-full h-full cursor-pointer;
  perspective: 1000px;
}

.tilt-inner {
  @apply relative w-full h-full;
  transform-style: preserve-3d;
  transition: all 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99);
  will-change: transform;
}
</style>
