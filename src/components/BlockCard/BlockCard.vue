<template>
  <!-- <TiltEffect :max-tilt="4"> -->
  <div
    class="backdrop-blur-7 rounded-xl border border-solid border-white/20 relative overflow-hidden h-[300px]"
  >
    <div class="flex items-center justify-between px-4 pt-4">
      <!-- <img class="bg-gray-500 w-26px h-26px rounded-full" src="" alt="" /> -->
      <div class="flex items-center">
        <div class="i-logos:vue"></div>
        <p class="ml-2 flex-1 cursor-pointer hover:decoration-underline">Axios 二次封装</p>
      </div>
      <div>
        <div class="i-ant-design:like-outlined"></div>
        <div class="i-ant-design:star-outlined"></div>
      </div>
    </div>
    <div class="h-[300px] w-full relative overflow-hidden">
      <CodeEditor
        class="absolute right-[-50px] top-60px rounded-xl"
        v-model="code"
        language="javascript"
        :font-size="12"
        readonly
      />
    </div>
  </div>
  <!-- </TiltEffect> -->
</template>

<script setup lang="ts">
import CodeEditor from '../CodeEditor/CodeEditor.vue'

const code = ref(`
function example() {
  console.log('Hello, World!')
}`)
</script>

<style scoped></style>
