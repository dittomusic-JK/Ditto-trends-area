<template>
  <div class="filter-chip">
    <button
      @click="$emit('remove')"
      class="filter-chip__remove-btn"
    >
      <IconClose class="filter-chip__icon" />
    </button>
    <span class="filter-chip__text">
      <span class="filter-chip__label">{{ label }}: </span>
      <span class="filter-chip__value">{{ value }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { IconClose } from '../icons'

defineProps<{
  label: string
  value: string
}>()

defineEmits<{
  (e: 'remove'): void
}>()
</script>

<style lang="scss" scoped>
.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  background-color: var(--button-grey);
  border-radius: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;

  &__remove-btn {
    color: var(--blue);
    transition: color 0.15s ease-in-out;

    &:hover {
      color: var(--brand-primary);
    }
  }

  &__icon {
    width: 1rem;
    height: 1rem;
  }

  &__text {
    color: var(--blue);
  }

  &__label {
    font-weight: 400;
  }

  &__value {
    font-weight: 600;
  }
}
</style>
