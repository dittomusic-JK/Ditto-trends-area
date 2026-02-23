<template>
  <div class="tracks-view">
    <!-- Desktop Table Header -->
    <div class="tracks-view__header">
      <div></div>
      <div>Details</div>
      <div class="tracks-view__header-center">Artist</div>
      <div class="tracks-view__header-center">Streams</div>
      <div class="tracks-view__header-center">Unique Listeners</div>
      <div class="tracks-view__header-center">Streams per listener</div>
    </div>

    <!-- Table Rows -->
    <div v-for="track in tracks" :key="track.id" class="tracks-view__row-wrapper">
      <!-- Desktop Row -->
      <div class="tracks-view__desktop-row">
        <div class="tracks-view__rank">{{ track.rank }}</div>
        <div class="tracks-view__details">
          <img :src="track.artwork" :alt="track.title" class="tracks-view__artwork" />
          <div>
            <p class="tracks-view__title">{{ track.title }}</p>
            <p class="tracks-view__release">{{ track.releaseName }}</p>
          </div>
        </div>
        <div class="tracks-view__artist">
          <template v-if="track.artists && track.artists.length > 1">
            {{ track.artists.slice(0, 2).join(', ') }}
          </template>
          <template v-else>{{ track.artist }}</template>
        </div>
        <div class="tracks-view__stat tracks-view__stat--bold">{{ track.streams.toLocaleString() }}</div>
        <div class="tracks-view__stat">{{ track.uniqueListeners.toLocaleString() }}</div>
        <div class="tracks-view__stat">{{ track.streamsPerListener }}</div>
      </div>

      <!-- Mobile Row -->
      <div class="tracks-view__mobile-row">
        <!-- Rank -->
        <span class="tracks-view__mobile-rank">{{ track.rank }}</span>

        <!-- Artwork -->
        <img :src="track.artwork" :alt="track.title" class="tracks-view__mobile-artwork" />

        <!-- Info -->
        <div class="tracks-view__mobile-info">
          <p class="tracks-view__mobile-title">{{ track.title }}</p>
          <p class="tracks-view__mobile-artist">{{ track.artist }}</p>
        </div>

        <!-- Streams -->
        <span class="tracks-view__mobile-streams">{{ formatShort(track.streams) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Track } from '../types'

defineProps<{
  tracks: Track[]
}>()

const formatShort = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return num.toLocaleString()
}
</script>

<style lang="scss" scoped>
.tracks-view {
  &__header {
    display: none;
    font-size: 0.75rem;
    color: var(--ditto-grey);
    padding: 0.75rem 1rem;

    @include lg {
      display: grid;
      grid-template-columns: 40px 1fr 140px 100px 120px 120px;
      gap: 1rem;
    }
  }

  &__header-center {
    text-align: center;
  }

  &__row-wrapper {
    margin-bottom: 0.25rem;
  }

  &__desktop-row {
    display: none;
    align-items: center;
    padding: 1rem;
    gap: 1rem;
    border-radius: 1rem;
    transition: background-color 0.15s ease;
    cursor: pointer;

    &:hover {
      background-color: var(--lighter-grey);
    }

    @include lg {
      display: grid;
      grid-template-columns: 40px 1fr 140px 100px 120px 120px;
    }
  }

  &__rank {
    font-size: 1.125rem;
    color: var(--blue);
  }

  &__details {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__artwork {
    width: 4rem;
    height: 4rem;
    border-radius: 0.5rem;
    object-fit: cover;
  }

  &__title {
    font-size: 1rem;
    font-weight: 500;
    color: var(--blue);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 220px;
  }

  &__release {
    font-size: 0.75rem;
    color: var(--ditto-grey);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__artist {
    text-align: center;
    font-size: 0.875rem;
    color: var(--ditto-grey);
  }

  &__stat {
    text-align: center;
    font-size: 1rem;
    color: var(--blue);

    &--bold {
      font-weight: 500;
    }
  }

  // Mobile row
  &__mobile-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0.5rem;
    border-radius: 0.75rem;
    transition: background-color 0.15s ease;
    cursor: pointer;

    &:hover {
      background-color: var(--lighter-grey);
    }

    @include lg {
      display: none;
    }
  }

  &__mobile-rank {
    font-size: 1rem;
    font-weight: 500;
    color: var(--ditto-grey);
    width: 1.5rem;
    text-align: center;
    flex-shrink: 0;
  }

  &__mobile-artwork {
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__mobile-info {
    flex: 1;
    min-width: 0;
  }

  &__mobile-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--blue);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__mobile-artist {
    font-size: 0.75rem;
    color: var(--ditto-grey);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 0.125rem;
  }

  &__mobile-streams {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--blue);
    flex-shrink: 0;
  }
}
</style>
