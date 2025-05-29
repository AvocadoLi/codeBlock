<template>
  <div class="relative flex rounded-md bg-white p-1">
    <!-- 滑块背景 -->
    <div
      ref="slideRef"
      class="absolute transition-all duration-300 ease-in-out bg-gray-200 rounded"
      :style="{
        left: `${slidePosition}px`,
        width: `${slideWidth}px`,
        height: 'calc(100% - 8px)',
      }"
    >
      <!-- <div class="h-full w-full rounded bg-white shadow-sm" /> -->
    </div>

    <!-- 选项按钮 -->
    <div
      v-for="(option, index) in options"
      :key="index"
      ref="optionRefs"
      class="relative z-10 rounded-md px-3 py-1.5 text-sm transition-colors cursor-pointer text-18px"
      :class="[modelValue === option.value ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700']"
      @click="handleSelect(option.value)"
    >
      {{ option.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface Option {
  label: string
  value: string | number
}

const props = defineProps<{
  modelValue: string | number
  options: Option[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const slideRef = ref<HTMLElement | null>(null)
const optionRefs = ref<HTMLElement[]>([])
const slidePosition = ref(0)
const slideWidth = ref(0)

// 更新滑块位置和宽度
const updateSlidePosition = () => {
  const selectedIndex = props.options.findIndex((option) => option.value === props.modelValue)
  if (selectedIndex === -1 || !optionRefs.value[selectedIndex]) return

  const selectedElement = optionRefs.value[selectedIndex]
  slidePosition.value = selectedElement.offsetLeft
  slideWidth.value = selectedElement.offsetWidth
}

// 处理选项选择
const handleSelect = (value: string | number) => {
  emit('update:modelValue', value)
}

// 监听选中值变化
watch(
  () => props.modelValue,
  () => {
    updateSlidePosition()
  },
)

// 组件挂载后初始化滑块位置
onMounted(() => {
  updateSlidePosition()
})
</script>
