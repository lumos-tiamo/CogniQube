<template>
  <div class="main-layout">
    <el-container>
      <el-aside width="200px">
        <div class="logo">
          <h2>CogniQube</h2>
        </div>
        <el-menu
          :default-active="activeMenu"
          router
          class="sidebar-menu"
        >
          <el-menu-item
            v-for="route in menuRoutes"
            :key="route.path"
            :index="'/' + route.path"
          >
            <el-icon>
              <component :is="route.meta?.icon" />
            </el-icon>
            <span>{{ route.meta?.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header>
          <div class="header-content">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="header-actions">
              <el-button :icon="theme === 'light' ? 'Moon' : 'Sunny'" circle @click="toggleTheme" />
            </div>
          </div>
        </el-header>

        <el-main>
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/config'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const menuRoutes = computed(() => {
  return router.options.routes[0].children || []
})

const activeMenu = computed(() => route.path)

const currentTitle = computed(() => {
  return route.meta?.title as string || ''
})

const theme = computed(() => configStore.theme)

const toggleTheme = () => {
  configStore.toggleTheme()
  document.documentElement.classList.toggle('dark')
}
</script>

<style scoped>
.main-layout {
  width: 100%;
  height: 100vh;
}

.el-container {
  height: 100%;
}

.el-aside {
  background: #001529;
  color: #fff;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-menu {
  border: none;
  background: #001529;
}

.el-header {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-main {
  background: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
