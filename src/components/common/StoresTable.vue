<template>
  <div class="stores-table">
    <h3 class="stores-table__title">Stores</h3>

    <table class="stores-table__table">
      <thead class="stores-table__thead">
        <tr class="stores-table__header-row">
          <th class="stores-table__header-cell stores-table__header-cell--platform">Platform</th>
          <th class="stores-table__header-cell stores-table__header-cell--proportion">Proportion</th>
          <th class="stores-table__header-cell stores-table__header-cell--streams">Streams</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="store in stores"
          :key="store.id"
          @click="handleClick(store.icon)"
          :class="[
            'stores-table__row',
            { 'stores-table__row--selected': selectedStore === store.icon }
          ]"
        >
          <td class="stores-table__cell stores-table__cell--name">
            <div class="stores-table__store-info">
              <StoreIcon :store="store.icon" />
              <span :class="['stores-table__store-name', { 'stores-table__store-name--selected': selectedStore === store.icon }]">{{ store.name }}</span>
            </div>
          </td>
          <td class="stores-table__cell stores-table__cell--proportion">
            <span class="stores-table__proportion-value">{{ store.proportion }}%</span>
          </td>
          <td class="stores-table__cell stores-table__cell--streams">
            <div class="stores-table__streams-info">
              <span class="stores-table__proportion-mobile">{{ store.proportion }}%</span>
              <span class="stores-table__streams-value">{{ formatStreams(store.streams) }}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Store } from '../../types'
import StoreIcon from './StoreIcon.vue'

// Format streams to abbreviated form on mobile
const formatStreams = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toLocaleString()
}

const props = defineProps<{
  stores: Store[]
  selectedStore: string | null
}>()

const emit = defineEmits<{
  (e: 'select', store: string | null): void
}>()

// Toggle selection - click again to deselect
const handleClick = (storeIcon: string) => {
  if (props.selectedStore === storeIcon) {
    emit('select', null) // Deselect, return to all stores
  } else {
    emit('select', storeIcon) // Select this store
  }
}
</script>

<style lang="scss" scoped>
.stores-table {
  &__title {
    font-family: $font-poppins;
    font-weight: 700;
    font-size: 1.125rem; // text-lg
    color: var(--blue);
    margin-bottom: 0.75rem;

    @include sm {
      font-size: 1.25rem; // text-xl
      margin-bottom: 1rem;
    }
  }

  &__table {
    width: 100%;
  }

  &__thead {
    display: none;

    @include sm {
      display: table-header-group;
    }
  }

  &__header-row {
    font-size: 0.75rem;
    color: var(--ditto-grey);
  }

  &__header-cell {
    font-weight: 400;
    padding-bottom: 0.75rem;

    &--platform {
      text-align: left;
      padding-left: 1rem;
    }

    &--proportion {
      text-align: center;
    }

    &--streams {
      text-align: right;
      padding-right: 1rem;
    }
  }

  &__row {
    border-top: 1px solid rgba(210, 210, 227, 0.5);
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:hover:not(&--selected) {
      background-color: var(--lighter-grey);
    }

    &--selected {
      background-color: rgba(95, 31, 255, 0.05);
    }
  }

  &__cell {
    &--name {
      padding: 0.75rem 0.5rem;

      @include sm {
        padding: 1rem 0.5rem 1rem 1rem;
      }
    }

    &--proportion {
      text-align: center;
      padding: 0.75rem 0;
      display: none;

      @include sm {
        display: table-cell;
        padding: 1rem 0;
      }
    }

    &--streams {
      text-align: right;
      padding: 0.75rem 0.5rem 0.75rem 0;

      @include sm {
        padding: 1rem 1rem 1rem 0;
      }
    }
  }

  &__store-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    @include sm {
      gap: 0.75rem;
    }
  }

  &__store-name {
    font-size: 0.875rem;
    color: var(--blue);

    &--selected {
      color: var(--brand-primary);
      font-weight: 500;
    }
  }

  &__proportion-value {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--brand-primary);
  }

  &__streams-info {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  &__proportion-mobile {
    font-size: 0.75rem;
    color: var(--brand-primary);
    font-weight: 500;

    @include sm {
      display: none;
    }
  }

  &__streams-value {
    font-size: 0.75rem;
    color: var(--ditto-grey);

    @include sm {
      font-size: 0.875rem;
      color: var(--blue);
    }
  }
}
</style>
