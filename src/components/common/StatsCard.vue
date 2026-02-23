<template>
  <div class="stats-card">
    <div class="stats-card__row">
      <!-- Icon -->
      <div class="stats-card__icon-wrapper">
        <img
          v-if="stat.iconType === 'broadcast'"
          src="/img/totalstreams.svg"
          alt="Total Streams"
          class="stats-card__icon"
        />
        <img
          v-else-if="stat.iconType === 'clock'"
          src="/img/dailyaverage.svg"
          alt="Daily Average"
          class="stats-card__icon"
        />
        <img
          v-else-if="stat.iconType === 'store' && stat.storeIcon"
          :src="getStoreIconSrc(stat.storeIcon)"
          :alt="stat.storeName || 'Store'"
          class="stats-card__icon stats-card__icon--store"
        />
      </div>

      <!-- Content -->
      <div class="stats-card__content">
        <p class="stats-card__title">{{ stat.title }}</p>
        <div class="stats-card__value-row">
          <span class="stats-card__value">{{ stat.value }}</span>
          <span
            v-if="stat.change"
            class="stats-card__change"
          >
            +{{ stat.change }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StatsCard as StatsCardType } from '../../types'

defineProps<{
  stat: StatsCardType
}>()

const storeIconMap: Record<string, string> = {
  'spotify': '/img/spotify-icon.svg',
  'apple-music': '/img/apple-music-icon.svg',
  'deezer': '/img/deezer-icon.svg',
  'youtube': '/img/youtube-icon.svg',
  'amazon-music': '/img/amazonmusic-icon.svg',
  'soundcloud': '/img/soundcloud_icon.svg',
  'tidal': '/img/tidal-icon.svg',
  'boomplay': '/img/boomplay-icon.svg',
  'tiktok': '/img/tiktok-icon.svg',
  'instagram': '/img/instagram-icon.svg',
}

const getStoreIconSrc = (iconName: string): string => {
  return storeIconMap[iconName] || ''
}
</script>

<style lang="scss" scoped>
.stats-card {
  flex: 1;
  padding: 1rem 1.5rem;
  border: 1px solid var(--brand-border);
  border-radius: 0.75rem;
  background-color: white;

  &__row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__icon-wrapper {
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    width: 2rem;
    height: auto;

    &--store {
      height: 2rem;
      border-radius: 0.25rem;
    }
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-size: 0.75rem;
    line-height: 1rem;
    color: var(--ditto-grey);
    margin-bottom: 0.125rem;
  }

  &__value-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__value {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 600;
    color: var(--blue);
  }

  &__change {
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 500;
    padding: 0.125rem 0.375rem;
    border-radius: 9999px;
    background-color: rgba(0, 231, 133, 0.2);
    color: var(--success);
  }
}
</style>
