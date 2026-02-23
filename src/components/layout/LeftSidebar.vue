<template>
  <aside class="sidebar">
    <!-- Mobile: Horizontal scrollable tabs -->
    <nav class="sidebar-nav scrollbar-hide">
      <button
        v-for="item in sidebarItems"
        :key="item.id"
        @click="$emit('navigate', item.id)"
        :class="[
          'sidebar-item',
          activeView === item.id
            ? 'sidebar-item--active'
            : 'sidebar-item--default'
        ]"
      >
        <component :is="item.icon" class="sidebar-item__icon" />
        <span class="sidebar-item__label">{{ item.label }}</span>
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import type { ViewType } from '../../types'
import { IconMetrics, IconReleases, IconTracks, IconPlaylists, IconAudience, IconSource } from '../icons'
import { markRaw } from 'vue'

defineProps<{
  activeView: ViewType
}>()

defineEmits<{
  (e: 'navigate', view: ViewType): void
}>()

const sidebarItems = [
  { id: 'metrics' as ViewType, label: 'Metrics', icon: markRaw(IconMetrics) },
  { id: 'releases' as ViewType, label: 'Releases', icon: markRaw(IconReleases) },
  { id: 'tracks' as ViewType, label: 'Tracks', icon: markRaw(IconTracks) },
  { id: 'playlists' as ViewType, label: 'Playlists', icon: markRaw(IconPlaylists) },
  { id: 'audience' as ViewType, label: 'Audience', icon: markRaw(IconAudience) },
  { id: 'source' as ViewType, label: 'Source', icon: markRaw(IconSource) },
]
</script>

<style lang="scss" scoped>
.sidebar {
  width: 100%;
  flex-shrink: 0;

  @include lg {
    width: 180px;
  }
}

.sidebar-nav {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 12px;
  margin-left: -16px;
  margin-right: -16px;
  padding-left: 16px;
  padding-right: 16px;

  @include lg {
    flex-direction: column;
    gap: 4px;
    overflow-x: visible;
    padding-top: 16px;
    padding-bottom: 0;
    margin-left: 0;
    margin-right: 0;
    padding-left: 0;
    padding-right: 0;
  }
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 9999px;
  text-align: left;
  transition: color 0.15s ease, background-color 0.15s ease;
  white-space: nowrap;
  flex-shrink: 0;
  border: none;
  cursor: pointer;
  font-family: inherit;

  @include lg {
    gap: 12px;
    padding: 12px 16px;
    border-radius: 8px;
  }

  &--active {
    background-color: var(--brand-primary);
    color: #ffffff;

    @include lg {
      background-color: var(--lighter-grey);
      color: var(--brand-primary);
    }
  }

  &--default {
    color: var(--blue);
    background-color: var(--lighter-grey);

    @include lg {
      background-color: transparent;
    }

    &:hover {
      background-color: rgba(249, 249, 255, 0.8);
    }
  }
}

.sidebar-item__icon {
  width: 16px;
  height: 16px;

  @include lg {
    width: 20px;
    height: 20px;
  }
}

.sidebar-item__label {
  font-size: 12px;
  font-weight: 500;

  @include lg {
    font-size: 14px;
  }
}
</style>
