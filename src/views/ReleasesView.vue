<template>
  <div class="releases">
    <!-- Desktop Table Header -->
    <div class="table-header">
      <div></div>
      <div>Details</div>
      <div class="text-center">Artist</div>
      <div class="text-center">Streams</div>
      <div class="text-center">Unique Listeners</div>
      <div class="text-center">Streams per listener</div>
    </div>

    <!-- Table Rows -->
    <div v-for="release in releases" :key="release.id" class="table-row">
      <!-- Desktop Row -->
      <div class="desktop-row">
        <div class="rank-number">{{ release.rank }}</div>
        <div class="release-details">
          <img :src="release.artwork" :alt="release.title" class="artwork" />
          <div>
            <p class="release-title">{{ release.title }}</p>
            <p class="track-count">{{ release.trackCount }} Tracks</p>
          </div>
        </div>
        <div class="artist-cell">
          <template v-if="release.artists && release.artists.length > 1">
            {{ release.artists.slice(0, 2).join(', ') }}
            <span v-if="release.artists.length > 2" class="artist-overflow">(+{{ release.artists.length - 2 }} more)</span>
          </template>
          <template v-else>{{ release.artist }}</template>
        </div>
        <div class="stat-cell stat-cell--primary">{{ release.streams.toLocaleString() }}</div>
        <div class="stat-cell">{{ release.uniqueListeners.toLocaleString() }}</div>
        <div class="stat-cell">{{ release.streamsPerListener }}</div>
      </div>

      <!-- Mobile Row -->
      <div class="mobile-row">
        <!-- Rank -->
        <span class="mobile-rank">{{ release.rank }}</span>

        <!-- Artwork -->
        <img :src="release.artwork" :alt="release.title" class="mobile-artwork" />

        <!-- Info -->
        <div class="mobile-info">
          <p class="mobile-title">{{ release.title }}</p>
          <p class="mobile-track-count">{{ release.trackCount }} Tracks</p>
        </div>

        <!-- Streams -->
        <span class="mobile-streams">{{ formatShort(release.streams) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Release } from '../types'

defineProps<{
  releases: Release[]
}>()

const formatShort = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return num.toLocaleString()
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
    grid-template-columns: 40px 1fr 140px 100px 120px 120px;
    gap: 1rem;
  }
}

.table-row {
  margin-bottom: 0.25rem;
}

.desktop-row {
  display: none;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  border-radius: 1rem;
  transition: background-color 150ms ease;
  cursor: pointer;

  @include lg {
    display: grid;
    grid-template-columns: 40px 1fr 140px 100px 120px 120px;
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

.release-details {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.artwork {
  width: 4rem;
  height: 4rem;
  border-radius: 0.5rem;
  object-fit: cover;
}

.release-title {
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 500;
  color: var(--blue);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 220px;
}

.track-count {
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--brand-primary);
}

.artist-cell {
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--ditto-grey);
}

.artist-overflow {
  color: var(--brand-primary);
}

.stat-cell {
  text-align: center;
  font-size: 1rem;
  line-height: 1.5rem;
  color: var(--blue);

  &--primary {
    font-weight: 500;
  }
}

.mobile-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.5rem;
  border-radius: 0.75rem;
  transition: background-color 150ms ease;
  cursor: pointer;

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

.mobile-artwork {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  object-fit: cover;
  flex-shrink: 0;
}

.mobile-info {
  flex: 1;
  min-width: 0;
}

.mobile-title {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: var(--blue);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-track-count {
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--brand-primary);
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
