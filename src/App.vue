<template>
  <div class="h-screen flex flex-col">
    <!-- Navigation Bar -->
    <nav class="bg-white border-b border-gray-200 px-4 py-2 flex items-center space-x-4 shadow-sm">
      <h1 class="text-lg font-semibold text-gray-800 mr-6">STS Toolkit</h1>
      <div class="flex space-x-2">
        <button
          @click="currentView = 'StsViewer'"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            currentView === 'StsViewer'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          STS Viewer
        </button>
        <button
          @click="currentView = 'LogToSecsOnly'"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            currentView === 'LogToSecsOnly'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          Log To Secs Only
        </button>
      </div>
    </nav>

    <!-- Main Content Area -->
    <div class="flex-1 overflow-hidden">
      <LogToSecsOnly v-if="currentView === 'LogToSecsOnly'" />
      <StsViewer v-if="currentView === 'StsViewer'" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import LogToSecsOnly from './views/LogToSecsOnly.vue'
  import StsViewer from './views/StsViewer.vue'

  const currentView = ref('StsViewer')
</script>

<style scoped></style>
