<template>
  <div class="h-full w-full flex overflow-hidden bg-gray-100">
    <!-- Input Textarea (Left) -->
    <div
      class="bg-white border-r border-gray-300 flex flex-col"
      :style="{ width: leftWidth + 'px' }"
    >
      <div class="p-3 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-700">
        {{ inputTitle }}
      </div>
      <textarea
        v-model="inputText"
        class="flex-1 p-4 resize-none outline-none font-mono text-sm leading-relaxed"
        :placeholder="inputPlaceholder"
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
      <div
        class="p-3 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-700"
        :class="(showCopyButton || showExportButton) ? 'flex items-center justify-between' : ''"
      >
        <span>{{ outputTitle }}</span>
        <div
          v-if="showCopyButton || showExportButton"
          class="flex gap-2"
        >
          <button
            v-if="showCopyButton"
            @click="copyToClipboard"
            :disabled="!outputText.trim()"
            class="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            :title="copyStatus || 'Copy to clipboard'"
          >
            <svg
              class="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              ></path>
            </svg>
            {{ copyButtonText }}
          </button>
          <button
            v-if="showExportButton"
            @click="exportToFile"
            :disabled="!outputText.trim()"
            class="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            :title="exportStatus || 'Export to file'"
          >
            <svg
              class="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              ></path>
            </svg>
            {{ exportButtonText }}
          </button>
        </div>
      </div>
      <textarea
        v-model="outputText"
        class="flex-1 p-4 resize-none outline-none font-mono text-sm leading-relaxed bg-gray-50"
        :placeholder="outputPlaceholder"
        readonly
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'

  interface Props {
    inputTitle?: string
    outputTitle?: string
    inputPlaceholder?: string
    outputPlaceholder?: string
    showCopyButton?: boolean
    showExportButton?: boolean
    processFunction: (input: string) => string
  }

  const props = withDefaults(defineProps<Props>(), {
    inputTitle: 'Input',
    outputTitle: 'Output',
    inputPlaceholder: 'Enter your input here...',
    outputPlaceholder: 'Output will appear here...',
    showCopyButton: false,
    showExportButton: false
  })

  const inputText = ref('')
  const outputText = ref('')
  const leftWidth = ref(400) // Initial width of left panel
  const isDragging = ref(false)
  const splitter = ref<HTMLElement>()

  // Copy functionality
  const copyStatus = ref('')
  const copyButtonText = ref('Copy')

  // Export functionality
  const exportStatus = ref('')
  const exportButtonText = ref('Export')

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

  // Copy to clipboard functionality
  const copyToClipboard = async () => {
    if (!outputText.value.trim()) return

    try {
      await navigator.clipboard.writeText(outputText.value)
      copyButtonText.value = 'Copied!'
      copyStatus.value = 'Text copied to clipboard'

      // Reset button text after 2 seconds
      setTimeout(() => {
        copyButtonText.value = 'Copy'
        copyStatus.value = ''
      }, 2000)
    } catch {
      copyButtonText.value = 'Failed'
      copyStatus.value = 'Failed to copy to clipboard'

      // Reset button text after 2 seconds
      setTimeout(() => {
        copyButtonText.value = 'Copy'
        copyStatus.value = ''
      }, 2000)
    }
  }

  // Export to file functionality
  const exportToFile = () => {
    if (!outputText.value.trim()) return

    try {
      // Create a blob with the output text
      const blob = new Blob([outputText.value], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)

      // Create a temporary anchor element for download
      const a = document.createElement('a')
      a.href = url
      a.download = `output-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`
      document.body.appendChild(a)
      a.click()

      // Cleanup
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Provide user feedback
      exportButtonText.value = 'Exported!'
      exportStatus.value = 'File exported successfully'

      // Reset button text after 2 seconds
      setTimeout(() => {
        exportButtonText.value = 'Export'
        exportStatus.value = ''
      }, 2000)
    } catch {
      exportButtonText.value = 'Failed'
      exportStatus.value = 'Failed to export file'

      // Reset button text after 2 seconds
      setTimeout(() => {
        exportButtonText.value = 'Export'
        exportStatus.value = ''
      }, 2000)
    }
  }

  // Process input using the provided function
  const processInput = () => {
    outputText.value = props.processFunction(inputText.value)
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

  // Expose inputText and outputText for external access if needed
  defineExpose({
    inputText,
    outputText
  })
</script>
