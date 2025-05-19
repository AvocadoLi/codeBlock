<template>
  <div class="absolute left-20px top-50% transform-translate-y-[-50%] h-98vh z-100">
    <div class="flex justify-center mb-10px">
      <img class="w-150px rounded-2xl" :src="logo" />
    </div>

    <div
      class="h-80vh"
      :class="[
        isCollapsed ? 'w-15' : 'w-60',
        ' backdrop-blur-7 rounded-xl shadow-xl border border-solid border-white/20',
      ]"
    >
      <div class="flex flex-col h-full text-white py-5">
        <!-- <div class="flex items-center justify-between px-5 mb-7">
          <h3 v-if="!isCollapsed" class="text-lg font-semibold m-0 whitespace-nowrap">菜单</h3>
          <button
            class="bg-transparent border-none text-white cursor-pointer w-6 h-6 flex items-center justify-center text-base hover:bg-white/10 rounded"
            @click="toggleSidebar"
          >
            <span v-if="isCollapsed">→</span>
            <span v-else>←</span>
          </button>
        </div> -->

        <div v-if="!isCollapsed" class="flex flex-col gap-2.5 px-5">
          <div
            v-for="(item, index) in menuItems"
            :key="index"
            class="flex items-center p-2 rounded-md cursor-pointer hover:bg-white/10 transition-all duration-300"
          >
            <span class="mr-2.5 text-lg">{{ item.icon }}</span>
            <span class="text-sm whitespace-nowrap block w-full overflow-hidden">{{
              item.text
            }}</span>
          </div>
        </div>

        <div v-else class="flex flex-col items-center gap-5">
          <div
            v-for="(item, index) in menuItems"
            :key="index"
            class="text-lg p-2 cursor-pointer rounded hover:bg-white/10"
          >
            {{ item.icon }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import logo from '@/assets/image/logo.png'

const isCollapsed = ref(false)

const menuItems = [
  { icon: '🏠', text: '首页' },
  { icon: '📊', text: '数据分析' },
  { icon: '⚙️', text: '设置' },
  { icon: '📁', text: '文件管理' },
  { icon: '👤', text: '用户中心' },
]

// const toggleSidebar = () => {
//   isCollapsed.value = !isCollapsed.value
// }
</script>

<style lang="sass" scoped>
// 可以添加一些无法用UnoCSS表达的自定义样式
</style>
