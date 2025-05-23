<template>
  <div class="relative h-screen">
    <div class="grid grid-cols-4 gap-4">
      <BlockCard v-for="n in 8" :key="n" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BlockCard from '@/components/BlockCard/BlockCard.vue'
// import CodeEditorDemo from './CodeEditorDemo.vue'
</script>

<style scoped></style>
