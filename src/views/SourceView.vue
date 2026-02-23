<template>
  <div>
    <!-- Desktop Table Header -->
    <div class="table-header">
      <div></div>
      <div>Source</div>
      <div class="text-center">Streams</div>
      <div class="text-center">Proportion</div>
    </div>

    <!-- Table Rows -->
    <div v-for="(source, index) in data.sources" :key="source.id" class="table-row-wrapper">
      <!-- Desktop Row -->
      <div class="desktop-row">
        <div class="rank-number">{{ index + 1 }}</div>
        <div class="source-info">
          <div
            class="source-icon-wrapper"
            :style="{ backgroundColor: sourceColors[index] + '15' }"
          >
            <component
              :is="getSourceIcon(source.icon)"
              class="source-icon"
              :style="{ color: sourceColors[index] }"
            />
          </div>
          <p class="source-name">{{ source.name }}</p>
        </div>
        <div class="streams-value">{{ source.streams.toLocaleString() }}</div>
        <div class="proportion-value">{{ source.proportion }}%</div>
      </div>

      <!-- Mobile Row -->
      <div class="mobile-row">
        <!-- Rank -->
        <span class="mobile-rank">{{ index + 1 }}</span>

        <!-- Icon -->
        <div
          class="source-icon-wrapper"
          :style="{ backgroundColor: sourceColors[index] + '15' }"
        >
          <component
            :is="getSourceIcon(source.icon)"
            class="source-icon source-icon--small"
            :style="{ color: sourceColors[index] }"
          />
        </div>

        <!-- Info -->
        <div class="mobile-info">
          <p class="mobile-source-name">{{ source.name }}</p>
          <p class="mobile-proportion">{{ source.proportion }}%</p>
        </div>

        <!-- Streams -->
        <span class="mobile-streams">{{ formatShort(source.streams) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import type { SourceViewData } from '../types'

defineProps<{
  data: SourceViewData
}>()

const formatShort = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return num.toLocaleString()
}

// Colors for each source
const sourceColors = ['#8640f4', '#F87171', '#34D399', '#FBBF24', '#60A5FA']

// Get icon component for source type
const getSourceIcon = (iconType: string) => {
  const icons: Record<string, any> = {
    radio: {
      render() {
        return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z' })
        ])
      }
    },
    playlist: {
      render() {
        return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' })
        ])
      }
    },
    library: {
      render() {
        return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z' })
        ])
      }
    },
    artist: {
      render() {
        return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
        ])
      }
    },
    search: {
      render() {
        return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })
        ])
      }
    }
  }
  return icons[iconType] || icons.playlist
}
</script>

<style lang="scss" scoped>
.text-center {
  text-align: center;
}

.table-header {
  display: none;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--ditto-grey);
  padding: 0.75rem 1rem;

  @include lg {
    display: grid;
    grid-template-columns: 40px 1fr 120px 100px;
    gap: 1rem;
  }
}

.table-row-wrapper {
  margin-bottom: 0.25rem;
}

.desktop-row {
  display: none;
  align-items: center;
  padding: 1rem;
  border-radius: 1rem;
  cursor: pointer;
  transition: background-color 0.15s ease;

  @include lg {
    display: grid;
    grid-template-columns: 40px 1fr 120px 100px;
    gap: 1rem;
  }

  &:hover {
    background-color: var(--lighter-grey);
  }
}

.rank-number {
  font-size: 1.125rem;
  line-height: 1.75rem;
  color: var(--blue);
}

.source-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.source-icon-wrapper {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.source-icon {
  width: 1.5rem;
  height: 1.5rem;

  &--small {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.source-name {
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 500;
  color: var(--blue);
}

.streams-value {
  text-align: center;
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 500;
  color: var(--blue);
}

.proportion-value {
  text-align: center;
  font-size: 1rem;
  line-height: 1.5rem;
  color: var(--blue);
}

.mobile-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.5rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background-color 0.15s ease;

  @include lg {
    display: none;
  }

  &:hover {
    background-color: var(--lighter-grey);
  }
}

.mobile-rank {
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 500;
  color: var(--ditto-grey);
  width: 1.5rem;
  text-align: center;
  flex-shrink: 0;
}

.mobile-info {
  flex: 1;
  min-width: 0;
}

.mobile-source-name {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: var(--blue);
}

.mobile-proportion {
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--ditto-grey);
  margin-top: 0.125rem;
}

.mobile-streams {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: var(--blue);
  flex-shrink: 0;
}
</style>
