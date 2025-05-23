<template>
  <div class="p-4">
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">选择语言：</label>
      <select
        v-model="currentLanguage"
        class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option v-for="lang in languages" :key="lang.name" :value="lang.name">
          {{ lang.label }}
        </option>
      </select>
    </div>

    <div class="h-[600px]">
      <CodeEditor v-model="code" :language="currentLanguage" readonly />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CodeEditor from '../components/CodeEditor/CodeEditor.vue'
import { languages } from '../components/CodeEditor/languages'

const currentLanguage = ref('javascript')
const code = ref(`// 在这里输入代码
function example() {
  console.log('Hello, World!')
}`)
</script>
