<template>
  <NConfigProvider :theme="darkTheme" :theme-overrides="themeOverrides">
    <ViewBackground>
      <div class="h-full w-full pr-20px box-border text-white">
        <AppSidebar />
        <div class="pl-286px h-full">
          <AppHeader />
          <RouterView />
        </div>
      </div>
    </ViewBackground>
  </NConfigProvider>
</template>

<script setup lang="ts">
import AppSidebar from './components/AppSidebar.vue'
import ViewBackground from './components/ViewBackground.vue'
import AppHeader from './components/AppHeader.vue'
import { NConfigProvider, darkTheme, type GlobalThemeOverrides } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#FFFFFF',
    primaryColorHover: '#737373',
    primaryColorPressed: '#FFFFFF',
  },
  Button: {
    textColorHover: '#FFFFFF',
  },
}
</script>

<style lang="sass" scoped></style>
