<template>
  <div class="page-header">
    <h1 class="page-header__title">
      Analytics & Trends <span>📈</span>
    </h1>

    <div class="page-header__actions">
      <!-- Date Range Picker -->
      <DateRangePicker
        :model-value="dateRange"
        @update:model-value="$emit('update:dateRange', $event)"
      />

      <!-- Type Dropdown - hidden on mobile, shown in filters instead -->
      <div class="type-dropdown">
        <button
          @click="showTypeDropdown = !showTypeDropdown"
          class="type-dropdown__trigger"
        >
          <span class="type-dropdown__label">Type:</span>
          <span class="type-dropdown__value">{{ typeLabels[trendsType] }}</span>
          <IconChevronDown class="type-dropdown__icon" />
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="showTypeDropdown"
          class="type-dropdown__menu"
        >
          <button
            v-for="(label, type) in typeLabels"
            :key="type"
            @click="selectType(type as TrendsType)"
            :class="[
              'type-dropdown__option',
              { 'type-dropdown__option--active': trendsType === type }
            ]"
          >
            {{ label }}
          </button>
        </div>
      </div>

      <!-- Filters Button -->
      <button
        @click="$emit('openFilters')"
        class="filters-button"
      >
        <IconFilter class="filters-button__icon" />
        <span class="filters-button__text">Filters</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconFilter, IconChevronDown } from '../icons'
import DateRangePicker from '../common/DateRangePicker.vue'
import type { DateRange, TrendsType } from '../../types'

defineProps<{
  dateRange: DateRange
  trendsType: TrendsType
  showStreamsDropdown?: boolean
}>()

const emit = defineEmits<{
  (e: 'openFilters'): void
  (e: 'update:dateRange', value: DateRange): void
  (e: 'update:trendsType', value: TrendsType): void
}>()

const showTypeDropdown = ref(false)

const typeLabels: Record<TrendsType, string> = {
  streaming: 'Streaming',
  download: 'Download',
  fingerprint: 'Fingerprint',
  content: 'Content Production',
  preorder: 'Pre-order'
}

const selectType = (type: TrendsType) => {
  emit('update:trendsType', type)
  showTypeDropdown.value = false
}
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 100%;

  @include sm {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  &__title {
    font-family: $font-poppins;
    font-weight: 700;
    font-size: 1.25rem;
    letter-spacing: -0.025em;
    color: var(--blue);
    text-align: center;

    @include sm {
      font-size: 1.875rem;
      text-align: left;
    }

    @include lg {
      font-size: 42px;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;

    @include sm {
      gap: 0.75rem;
      width: auto;
    }
  }
}

.type-dropdown {
  position: relative;
  display: none;

  @include sm {
    display: block;
  }

  &__trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    height: 2.5rem;
    border: 1px solid var(--brand-border);
    border-radius: 0.5rem;
    font-size: 0.875rem;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: var(--lighter-grey);
    }
  }

  &__label {
    color: var(--ditto-grey);
  }

  &__value {
    font-weight: 500;
    color: var(--blue);
  }

  &__icon {
    width: 1rem;
    height: 1rem;
    color: var(--ditto-grey);
  }

  &__menu {
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 0.25rem;
    width: 12rem;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--brand-border);
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    z-index: 50;
  }

  &__option {
    width: 100%;
    padding: 0.5rem 1rem;
    text-align: left;
    font-size: 0.875rem;
    color: var(--blue);
    transition: background-color 0.15s ease;

    &:hover {
      background-color: var(--lighter-grey);
    }

    &--active {
      background-color: var(--lighter-grey);
      color: var(--brand-primary);
      font-weight: 500;
    }
  }
}

.filters-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--brand-border);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: var(--blue);
  flex-shrink: 0;
  transition: background-color 0.15s ease;

  @include sm {
    padding: 0.5rem 1rem;
  }

  &:hover {
    background-color: var(--lighter-grey);
  }

  &__icon {
    width: 1rem;
    height: 1rem;
  }

  &__text {
    display: none;

    @include sm {
      display: inline;
    }
  }
}
</style>
