<template>
  <div class="max-w-xl mx-auto text-center py-16 lg:py-24 px-4">
    <img v-if="icon" :src="icon" alt="" class="w-16 h-16 mx-auto mb-5" />
    <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl lg:text-3xl text-ditto-text mb-2">{{ title }}</h2>
    <p class="text-sm text-ditto-subtext leading-relaxed mb-6">{{ message }}</p>
    <button
      v-if="ctaLabel"
      @click="$emit('cta')"
      class="px-6 py-2.5 bg-ditto-purple btn-pop-purple text-white text-sm font-medium rounded-full hover:opacity-95 transition-all"
    >
      {{ ctaLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
// New-user demo: friendly onboarding placeholder shown in place of a page's
// data-driven content. Icons come from the brand suite (/img/suite).
defineProps<{
  title: string
  message: string
  ctaLabel?: string
  icon?: string
}>()

defineEmits<{ (e: 'cta'): void }>()
</script>
