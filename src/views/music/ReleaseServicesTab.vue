<template>
  <!-- The services UI is the ported ditto-services component set (1:1). -->
  <ServicesTab plan="Pro" />
</template>

<script setup lang="ts">
import ServicesTab from '../../components/release-services/ServicesTab.vue'
import type { ReleaseDetail } from '../../data/releaseDetailMockData'

defineProps<{ release: ReleaseDetail }>()
</script>
