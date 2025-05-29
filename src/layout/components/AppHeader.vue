<template>
  <div class="flex justify-end items-center h-80px pt-20px">
    <NButton class="!hover:text-white" size="large" type="primary" round>登录</NButton>
    <NTooltip trigger="hover">
      <template #trigger>
        <div class="flex items-center gap-20px cursor-pointer">
          <div>SENSEMS</div>
          <div class="bg-white rounded-full p-1px flex items-center justify-center">
            <NAvatar
              src="https://img2.baidu.com/it/u=762079775,866421285&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=800"
              round
              :size="40"
            />
          </div>
        </div>
      </template>
      个人中心
    </NTooltip>
  </div>
</template>

<script setup lang="ts">
import { NAvatar, NButton, NTooltip } from 'naive-ui'
</script>

<style scoped></style>
