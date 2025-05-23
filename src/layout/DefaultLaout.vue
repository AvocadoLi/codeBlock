<template>
  <ViewBackground>
    <div class="h-full w-full">
      <AppSidebar />
      <div class="pl-278px">
        <RouterView />
      </div>
    </div>
  </ViewBackground>
</template>

<script setup lang="ts">
import AppSidebar from './components/AppSidebar.vue'
import ViewBackground from './components/ViewBackground.vue'
</script>

<style lang="sass" scoped></style>
