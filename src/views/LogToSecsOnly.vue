<template>
  <div class="h-screen w-screen flex overflow-hidden bg-gray-100">
    <!-- Input Textarea (Left) -->
    <div
      class="bg-white border-r border-gray-300 flex flex-col"
      :style="{ width: leftWidth + 'px' }"
    >
      <div class="p-3 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-700">
        Input
      </div>
      <textarea
        v-model="inputText"
        class="flex-1 p-4 resize-none outline-none font-mono text-sm leading-relaxed"
        placeholder="Enter your input here..."
      ></textarea>
    </div>

    <!-- Splitter -->
    <div
      ref="splitter"
      class="w-1 bg-gray-300 cursor-col-resize hover:bg-blue-400 transition-colors duration-150 relative group"
      @mousedown="startDrag"
    >
      <!-- Visual indicator -->
      <div
        class="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-1 bg-gray-400 group-hover:bg-blue-500 transition-colors"
      ></div>
    </div>

    <!-- Output Textarea (Right) -->
    <div class="flex-1 bg-white flex flex-col">
      <div class="p-3 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-700">
        Output
      </div>
      <textarea
        v-model="outputText"
        class="flex-1 p-4 resize-none outline-none font-mono text-sm leading-relaxed bg-gray-50"
        placeholder="Output will appear here..."
        readonly
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'

  const inputText = ref('')
  const outputText = ref('')
  const leftWidth = ref(400) // Initial width of left panel
  const isDragging = ref(false)
  const splitter = ref<HTMLElement>()

  const startDrag = (e: MouseEvent) => {
    isDragging.value = true
    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', stopDrag)
    e.preventDefault()
  }

  const handleDrag = (e: MouseEvent) => {
    if (!isDragging.value) return

    const containerWidth = window.innerWidth
    const newLeftWidth = e.clientX

    // Set minimum and maximum widths (20% to 80% of screen width)
    const minWidth = containerWidth * 0.2
    const maxWidth = containerWidth * 0.8

    if (newLeftWidth >= minWidth && newLeftWidth <= maxWidth) {
      leftWidth.value = newLeftWidth
    }
  }

  const stopDrag = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', stopDrag)
  }

  // Handle window resize
  const handleResize = () => {
    const containerWidth = window.innerWidth
    const maxWidth = containerWidth * 0.8
    const minWidth = containerWidth * 0.2

    if (leftWidth.value > maxWidth) {
      leftWidth.value = maxWidth
    } else if (leftWidth.value < minWidth) {
      leftWidth.value = minWidth
    }
  }

  const processInput = () => {
    // Example processing: Convert input to uppercase
    outputText.value = filterUnwantedLines(inputText.value)
  }

  const filterUnwantedLines = (input: string) => {
    // Define all keywords to filter out
    const filterKeywords = [
      'system byte',
      'preparing to send',
      'received seperate request',
      'tcp disconnected',
      'starting passive mode',
      'waiting for connection',
      'attempting to connect',
      'fail to connect',
      'attempting next connect',
      'tcp engine enabled',
      'tcp not connected',
      'socket accepted from',
      'tcp port connected',
      'hsms selected',
      'sending control message'
    ];

    const lines = input.split('\n');
    const filteredLines = lines.filter(line => {
      const lowerLine = line.toLowerCase();
      // Return true if the line doesn't contain any of the filter keywords
      return !filterKeywords.some(keyword => lowerLine.includes(keyword));
    });

    return filteredLines.join('\n');
  }

  // Watch for changes in inputText and process automatically
  watch(inputText, () => {
    processInput()
  })

  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', stopDrag)
  })
</script>

<style scoped></style>
