<template>
  <div>
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="filters-backdrop"
        @click="$emit('close')"
      ></div>
    </Transition>

    <!-- Panel -->
    <Transition name="slide">
      <div
        v-if="isOpen"
        class="filters-panel"
      >
        <!-- Header -->
        <div class="filters-header">
          <h2 class="filters-header__title">Filter</h2>
          <div class="filters-header__actions">
            <button
              @click="clearAll"
              class="filters-header__clear-btn"
            >
              CLEAR ALL
            </button>
            <button @click="$emit('close')" class="filters-header__close-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Filter Sections -->
        <div class="filters-body">
          <!-- Data Type (mobile only) -->
          <div class="filter-section filter-section--mobile-only">
            <button
              @click="toggleSection('dataType')"
              class="filter-section__toggle filter-section__toggle--mobile"
            >
              <span class="filter-section__label">Data Type</span>
              <div class="filter-section__toggle-right">
                <span class="filter-section__selected-value">{{ selectedDataTypeLabel }}</span>
                <svg
                  :class="['filter-section__chevron', expandedSection === 'dataType' ? 'filter-section__chevron--expanded' : '']"
                  viewBox="0 0 20 20" fill="none"
                >
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </button>
            <div v-if="expandedSection === 'dataType'" class="filter-section__content filter-section__content--mobile">
              <button
                v-for="(label, type) in dataTypeOptions"
                :key="type"
                @click="selectDataType(type as TrendsType)"
                class="filter-option"
              >
                <div class="filter-option__left">
                  <span :class="[
                    'filter-option__radio',
                    selectedDataType === type ? 'filter-option__radio--selected' : ''
                  ]">
                    <svg v-if="selectedDataType === type" class="filter-option__check-icon" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span :class="['filter-option__name', selectedDataType === type ? 'filter-option__name--selected' : '']">{{ label }}</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Label -->
          <div class="filter-section">
            <button
              @click="toggleSection('label')"
              class="filter-section__toggle"
            >
              <span class="filter-section__label">Label</span>
              <svg
                :class="['filter-section__chevron', expandedSection === 'label' ? 'filter-section__chevron--expanded' : '']"
                viewBox="0 0 20 20" fill="none"
              >
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-if="expandedSection === 'label'" class="filter-section__content">
              <button
                v-for="label in filterOptions.labels"
                :key="label.id"
                @click="toggleFilter('label', label.id, label.name)"
                class="filter-option"
              >
                <div class="filter-option__left">
                  <span :class="[
                    'filter-option__radio',
                    isSelected('label', label.id) ? 'filter-option__radio--selected' : ''
                  ]">
                    <svg v-if="isSelected('label', label.id)" class="filter-option__check-icon" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span :class="['filter-option__name', isSelected('label', label.id) ? 'filter-option__name--selected' : '']">{{ label.name }}</span>
                </div>
                <span class="filter-option__count">[{{ label.count }}]</span>
              </button>
            </div>
          </div>

          <!-- Artists -->
          <div class="filter-section">
            <button
              @click="toggleSection('artist')"
              class="filter-section__toggle"
            >
              <span class="filter-section__label">Artists</span>
              <svg
                :class="['filter-section__chevron', expandedSection === 'artist' ? 'filter-section__chevron--expanded' : '']"
                viewBox="0 0 20 20" fill="none"
              >
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-if="expandedSection === 'artist'" class="filter-section__content">
              <button
                v-for="artist in filterOptions.artists"
                :key="artist.id"
                @click="toggleFilter('artist', artist.id, artist.name)"
                class="filter-option"
              >
                <div class="filter-option__left">
                  <span :class="[
                    'filter-option__radio',
                    isSelected('artist', artist.id) ? 'filter-option__radio--selected' : ''
                  ]">
                    <svg v-if="isSelected('artist', artist.id)" class="filter-option__check-icon" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span :class="['filter-option__name', isSelected('artist', artist.id) ? 'filter-option__name--selected' : '']">{{ artist.name }}</span>
                </div>
                <span class="filter-option__count">[{{ artist.count }}]</span>
              </button>
            </div>
          </div>

          <!-- Release -->
          <div class="filter-section">
            <button
              @click="toggleSection('release')"
              class="filter-section__toggle"
            >
              <span class="filter-section__label">Release</span>
              <svg
                :class="['filter-section__chevron', expandedSection === 'release' ? 'filter-section__chevron--expanded' : '']"
                viewBox="0 0 20 20" fill="none"
              >
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-if="expandedSection === 'release'" class="filter-section__content">
              <button
                v-for="release in filterOptions.releases"
                :key="release.id"
                @click="toggleFilter('release', release.id, release.name)"
                class="filter-option"
              >
                <div class="filter-option__left">
                  <span :class="[
                    'filter-option__radio',
                    isSelected('release', release.id) ? 'filter-option__radio--selected' : ''
                  ]">
                    <svg v-if="isSelected('release', release.id)" class="filter-option__check-icon" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span :class="['filter-option__name', isSelected('release', release.id) ? 'filter-option__name--selected' : '']">{{ release.name }}</span>
                </div>
                <span class="filter-option__count">[{{ release.count }}]</span>
              </button>
            </div>
          </div>

          <!-- Track -->
          <div class="filter-section">
            <button
              @click="toggleSection('track')"
              class="filter-section__toggle"
            >
              <span class="filter-section__label">Track</span>
              <svg
                :class="['filter-section__chevron', expandedSection === 'track' ? 'filter-section__chevron--expanded' : '']"
                viewBox="0 0 20 20" fill="none"
              >
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-if="expandedSection === 'track'" class="filter-section__content">
              <button
                v-for="track in filterOptions.tracks"
                :key="track.id"
                @click="toggleFilter('track', track.id, track.name)"
                class="filter-option"
              >
                <div class="filter-option__left">
                  <span :class="[
                    'filter-option__radio',
                    isSelected('track', track.id) ? 'filter-option__radio--selected' : ''
                  ]">
                    <svg v-if="isSelected('track', track.id)" class="filter-option__check-icon" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span :class="['filter-option__name', isSelected('track', track.id) ? 'filter-option__name--selected' : '']">{{ track.name }}</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Country -->
          <div class="filter-section">
            <button
              @click="toggleSection('country')"
              class="filter-section__toggle"
            >
              <span class="filter-section__label">Country</span>
              <svg
                :class="['filter-section__chevron', expandedSection === 'country' ? 'filter-section__chevron--expanded' : '']"
                viewBox="0 0 20 20" fill="none"
              >
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-if="expandedSection === 'country'" class="filter-section__content">
              <button
                v-for="country in filterOptions.countries"
                :key="country.id"
                @click="toggleFilter('country', country.id, country.name)"
                class="filter-option"
              >
                <div class="filter-option__left">
                  <span :class="[
                    'filter-option__radio',
                    isSelected('country', country.id) ? 'filter-option__radio--selected' : ''
                  ]">
                    <svg v-if="isSelected('country', country.id)" class="filter-option__check-icon" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span :class="['filter-option__name', isSelected('country', country.id) ? 'filter-option__name--selected' : '']">{{ country.name }}</span>
                </div>
                <span class="filter-option__count">[{{ country.count }}]</span>
              </button>
            </div>
          </div>

          <!-- Store -->
          <div class="filter-section">
            <button
              @click="toggleSection('store')"
              class="filter-section__toggle"
            >
              <span class="filter-section__label">Store</span>
              <svg
                :class="['filter-section__chevron', expandedSection === 'store' ? 'filter-section__chevron--expanded' : '']"
                viewBox="0 0 20 20" fill="none"
              >
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-if="expandedSection === 'store'" class="filter-section__content">
              <button
                v-for="store in filterOptions.stores"
                :key="store.id"
                @click="toggleFilter('store', store.id, store.name)"
                class="filter-option"
              >
                <div class="filter-option__left">
                  <span :class="[
                    'filter-option__radio',
                    isSelected('store', store.id) ? 'filter-option__radio--selected' : ''
                  ]">
                    <svg v-if="isSelected('store', store.id)" class="filter-option__check-icon" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span :class="['filter-option__name', isSelected('store', store.id) ? 'filter-option__name--selected' : '']">{{ store.name }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="filters-footer">
          <button
            @click="applyFilters"
            class="filters-footer__apply-btn"
          >
            <span>Apply ({{ selectedCount }})</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Filter, TrendsType } from '../../types'

const props = defineProps<{
  isOpen: boolean
  currentFilters: Filter[]
  currentDataType?: TrendsType
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'apply', filters: Filter[]): void
  (e: 'update:dataType', type: TrendsType): void
}>()

// Filter options (mock data)
const filterOptions = {
  labels: [
    { id: 'l1', name: 'Kaiga Records', count: 45 },
    { id: 'l2', name: 'Independent', count: 23 },
  ],
  artists: [
    { id: 'a1', name: 'Chris Kaiga', count: 48 },
    { id: 'a2', name: 'Bensoul', count: 12 },
    { id: 'a3', name: 'Nviiri the Storyteller', count: 18 },
    { id: 'a4', name: 'Bien', count: 20 },
    { id: 'a5', name: 'Savara', count: 10 },
    { id: 'a6', name: 'Chimano', count: 14 },
    { id: 'a7', name: 'Nyashinski', count: 9 },
    { id: 'a8', name: 'Sauti Sol', count: 16 },
  ],
  releases: [
    { id: 'r1', name: 'Adventures of Chris Kaiga', count: 8 },
    { id: 'r2', name: 'Zimenice', count: 1 },
    { id: 'r3', name: 'Chain Chain', count: 1 },
    { id: 'r4', name: 'Niko on', count: 1 },
    { id: 'r5', name: 'Kameshika Signal', count: 1 },
    { id: 'r6', name: 'Mwazzara', count: 1 },
  ],
  tracks: [
    { id: 't1', name: 'I Want', count: 48214 },
    { id: 't2', name: 'Zimenice', count: 16374 },
    { id: 't3', name: 'Kwa Ceiling', count: 10794 },
    { id: 't4', name: 'Chain Chain', count: 9205 },
    { id: 't5', name: 'Niko on', count: 8400 },
    { id: 't6', name: 'Kameshika Signal', count: 6112 },
  ],
  countries: [
    { id: 'c1', name: 'Kenya', count: 62 },
    { id: 'c2', name: 'United Kingdom', count: 12 },
    { id: 'c3', name: 'United States', count: 8 },
    { id: 'c4', name: 'Nigeria', count: 6 },
    { id: 'c5', name: 'Tanzania', count: 4 },
    { id: 'c6', name: 'Uganda', count: 3 },
  ],
  stores: [
    { id: 's1', name: 'Spotify' },
    { id: 's2', name: 'Apple Music' },
    { id: 's3', name: 'YouTube Music' },
    { id: 's4', name: 'Amazon Music' },
    { id: 's5', name: 'Tidal' },
    { id: 's6', name: 'SoundCloud' },
    { id: 's7', name: 'Deezer' },
    { id: 's8', name: 'Boomplay' },
  ]
}

const expandedSection = ref<string | null>(null)

// Data type options for mobile
const dataTypeOptions: Record<TrendsType, string> = {
  streaming: 'Streaming',
  download: 'Download',
  fingerprint: 'Fingerprint',
  content: 'Content Production',
  preorder: 'Pre-order'
}

const selectedDataType = ref<TrendsType>(props.currentDataType || 'streaming')
const selectedDataTypeLabel = computed(() => dataTypeOptions[selectedDataType.value] || 'Streaming')

const selectDataType = (type: TrendsType) => {
  selectedDataType.value = type
  emit('update:dataType', type)
}

// Watch for external changes to currentDataType
watch(() => props.currentDataType, (newType) => {
  if (newType) selectedDataType.value = newType
})

// Local copy of selected filters
const selectedFilters = ref<Filter[]>([...props.currentFilters])

// Watch for external changes to currentFilters (e.g., when removing via FilterChip)
watch(() => props.currentFilters, (newFilters) => {
  selectedFilters.value = [...newFilters]
}, { deep: true })

const toggleSection = (section: string) => {
  expandedSection.value = expandedSection.value === section ? null : section
}

const isSelected = (type: string, id: string): boolean => {
  return selectedFilters.value.some(f => f.type === type && f.id === id)
}

const toggleFilter = (type: string, id: string, name: string) => {
  const existingIndex = selectedFilters.value.findIndex(f => f.type === type && f.id === id)
  if (existingIndex >= 0) {
    selectedFilters.value.splice(existingIndex, 1)
  } else {
    selectedFilters.value.push({
      id,
      type: type as Filter['type'],
      label: type.charAt(0).toUpperCase() + type.slice(1),
      value: name
    })
  }
}

const selectedCount = computed(() => selectedFilters.value.length)

const clearAll = () => {
  selectedFilters.value = []
}

const applyFilters = () => {
  emit('apply', [...selectedFilters.value])
  emit('close')
}
</script>

<style lang="scss" scoped>
// -----------------------------
// Transitions (preserved)
// -----------------------------
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

// -----------------------------
// Backdrop
// -----------------------------
.filters-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 40;
}

// -----------------------------
// Panel
// -----------------------------
.filters-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  background: white;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  z-index: 50;
  display: flex;
  flex-direction: column;

  @include sm {
    width: 24rem; // 384px, equivalent to w-96
  }
}

// -----------------------------
// Header
// -----------------------------
.filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid var(--brand-border);

  @include sm {
    padding: 1.25rem 1.5rem;
  }

  &__title {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
    color: var(--blue);
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__clear-btn {
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: var(--blue);
    text-decoration: underline;

    &:hover {
      color: var(--brand-primary);
    }
  }

  &__close-btn {
    color: var(--ditto-grey);

    &:hover {
      color: var(--blue);
    }
  }
}

// -----------------------------
// Body (scrollable area)
// -----------------------------
.filters-body {
  flex: 1;
  overflow-y: auto;
}

// -----------------------------
// Filter Section
// -----------------------------
.filter-section {
  border-bottom: 1px solid rgba(210, 210, 227, 0.5);

  &--mobile-only {
    @include sm {
      display: none;
    }
  }

  &__toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1rem;
    transition: background-color 0.15s ease;

    @include sm {
      padding: 1rem 1.5rem;
    }

    &:hover {
      background-color: rgba(249, 249, 255, 0.5);
    }

    &--mobile {
      padding: 1rem;

      // Override sm padding — mobile-only section never shows at sm+
    }
  }

  &__toggle-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__label {
    font-weight: 600;
    color: var(--blue);
  }

  &__selected-value {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: var(--brand-primary);
  }

  &__chevron {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--ditto-grey);
    transition: transform 0.15s ease;

    &--expanded {
      transform: rotate(180deg);
    }
  }

  &__content {
    padding: 0 1rem 1rem;

    @include sm {
      padding: 0 1.5rem 1rem;
    }

    &--mobile {
      padding: 0 1rem 1rem;
    }
  }
}

// -----------------------------
// Filter Option (radio row)
// -----------------------------
.filter-option {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  text-align: left;
  transition: color 0.15s ease;

  &:hover {
    color: var(--brand-primary);
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__radio {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 9999px;
    border: 2px solid var(--brand-border);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.15s ease, background-color 0.15s ease;

    &--selected {
      border-color: var(--brand-primary);
      background-color: var(--brand-primary);
    }
  }

  &__check-icon {
    width: 0.75rem;
    height: 0.75rem;
    color: white;
  }

  &__name {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: var(--blue);

    &--selected {
      color: var(--brand-primary);
      font-weight: 500;
    }
  }

  &__count {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: var(--ditto-grey);
  }
}

// -----------------------------
// Footer
// -----------------------------
.filters-footer {
  padding: 1rem;
  border-top: 1px solid var(--brand-border);
  background: white;

  @include sm {
    padding: 1rem 1.5rem;
  }

  &__apply-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
    background-color: var(--blue);
    color: white;
    border-radius: 9999px;
    font-weight: 500;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: rgba(16, 31, 60, 0.9);
    }
  }
}
</style>
