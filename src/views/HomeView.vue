<template>
  <div class="relative flex flex-col gap-14px">
    <div class="flex">
      <SlideSelect v-model="selectedValue" :options="options" />
    </div>
    <NInfiniteScroll style="height: calc(100vh - 120px)" :distance="10" @load="handleLoad">
      <div class="grid grid-cols-4 gap-6 pb-40px">
        <BlockCard v-for="n in 24" :key="n" />
      </div>
    </NInfiniteScroll>
  </div>
</template>

<script setup lang="ts">
import { NInfiniteScroll } from 'naive-ui'

import BlockCard from '@/components/BlockCard/BlockCard.vue'
import SlideSelect from '@/components/SlideSelect/SlideSelect.vue'
// import CodeEditorDemo from './CodeEditorDemo.vue'

const selectedValue = ref('option1')
const options = [
  { label: '全部', value: 'option1' },
  { label: '最多点赞', value: 'option2' },
  { label: '最多收藏', value: 'option3' },
]

// 滚动到底部时触发
const handleLoad = () => {
  console.log('load')
}
</script>

<style scoped></style>
