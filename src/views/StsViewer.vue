<template>
  <SplitView
    input-title="Input"
    output-title="Output"
    input-placeholder="Enter your input data here..."
    output-placeholder="Output text will appear here..."
    :show-copy-button="true"
    :show-export-button="true"
    :process-function="convertStsToText"
  />
</template>

<script setup lang="ts">
  import SplitView from '../components/SplitView.vue'
  import { convertStsToText } from '../utils/processors'
</script>
<style scoped></style>
