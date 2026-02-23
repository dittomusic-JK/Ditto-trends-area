<template>
  <div class="playlists">
    <!-- Desktop Table Header -->
    <div class="playlists__header">
      <div></div>
      <div>Details</div>
      <div class="playlists__header-center">Streams</div>
      <div class="playlists__header-center">Followers</div>
      <div class="playlists__header-center">Curator</div>
      <div class="playlists__header-center">Skip Rate</div>
    </div>

    <!-- Table Rows -->
    <div v-for="playlist in localPlaylists" :key="playlist.id" class="playlists__row-wrapper">
      <!-- Desktop Row -->
      <div
        @click="toggleExpand(playlist.id)"
        :class="[
          'playlists__desktop-row',
          playlist.tracks && playlist.tracks.length > 0 ? 'playlists__desktop-row--clickable' : '',
          playlist.isExpanded ? 'playlists__desktop-row--expanded' : 'playlists__desktop-row--collapsed'
        ]"
      >
        <div class="playlists__rank">{{ playlist.rank }}</div>
        <div class="playlists__details">
          <img :src="playlist.artwork" :alt="playlist.name" class="playlists__artwork" />
          <div class="playlists__name-group">
            <img src="/img/spotify-icon.svg" alt="Spotify" class="playlists__spotify-icon" />
            <div>
              <p class="playlists__name">{{ playlist.name }}</p>
              <p class="playlists__track-count">{{ playlist.trackCount }} Tracks</p>
            </div>
          </div>
        </div>
        <div class="playlists__streams">{{ playlist.streams.toLocaleString() }}</div>
        <div class="playlists__followers">{{ playlist.followers ? playlist.followers.toLocaleString() : '-' }}</div>
        <div class="playlists__curator">{{ playlist.curator }}</div>
        <div class="playlists__skip-rate">
          <span>{{ playlist.skipRate }}%</span>
          <template v-if="playlist.tracks && playlist.tracks.length > 0">
            <IconChevronUp v-if="playlist.isExpanded" class="playlists__chevron" />
            <IconChevronDown v-else class="playlists__chevron" />
          </template>
        </div>
      </div>

      <!-- Mobile Row -->
      <div
        @click="toggleExpand(playlist.id)"
        :class="[
          'playlists__mobile-row',
          playlist.tracks && playlist.tracks.length > 0 ? 'playlists__mobile-row--clickable' : '',
          playlist.isExpanded ? 'playlists__mobile-row--expanded' : 'playlists__mobile-row--collapsed'
        ]"
      >
        <!-- Rank -->
        <span class="playlists__mobile-rank">{{ playlist.rank }}</span>

        <!-- Artwork -->
        <img :src="playlist.artwork" :alt="playlist.name" class="playlists__mobile-artwork" />

        <!-- Info -->
        <div class="playlists__mobile-info">
          <div class="playlists__mobile-name-row">
            <img src="/img/spotify-icon.svg" alt="Spotify" class="playlists__mobile-spotify-icon" />
            <p class="playlists__mobile-name">{{ playlist.name }}</p>
          </div>
          <p class="playlists__mobile-track-count">{{ playlist.trackCount }} Tracks</p>
        </div>

        <!-- Streams + Chevron -->
        <div class="playlists__mobile-streams">
          <span class="playlists__mobile-streams-value">{{ formatShort(playlist.streams) }}</span>
          <template v-if="playlist.tracks && playlist.tracks.length > 0">
            <IconChevronUp v-if="playlist.isExpanded" class="playlists__chevron" />
            <IconChevronDown v-else class="playlists__chevron" />
          </template>
        </div>
      </div>

      <!-- Expanded Tracks Section - Desktop -->
      <div
        v-if="playlist.isExpanded && playlist.tracks && playlist.tracks.length > 0"
        class="playlists__expanded-desktop"
      >
        <div class="playlists__tracks-header">
          <div>Name</div>
          <div class="playlists__tracks-header-center">Artist</div>
          <div class="playlists__tracks-header-center">Streams</div>
          <div class="playlists__tracks-header-center">Add Date</div>
          <div class="playlists__tracks-header-center">Skip Rate</div>
        </div>
        <div
          v-for="track in playlist.tracks"
          :key="track.id"
          class="playlists__track-row"
        >
          <div class="playlists__track-name">{{ track.name }}</div>
          <div class="playlists__track-artist">{{ track.artist }}</div>
          <div class="playlists__track-streams">{{ track.streams.toLocaleString() }}</div>
          <div class="playlists__track-date">
            <div class="playlists__track-date-text">{{ track.addDate }}</div>
            <div v-if="track.streamsSince" class="playlists__track-streams-since">streams since: {{ track.streamsSince.toLocaleString() }}</div>
          </div>
          <div class="playlists__track-skip-rate">{{ track.skipRate }}%</div>
        </div>
      </div>

      <!-- Expanded Tracks Section - Mobile -->
      <div
        v-if="playlist.isExpanded && playlist.tracks && playlist.tracks.length > 0"
        class="playlists__expanded-mobile"
      >
        <div
          v-for="track in playlist.tracks"
          :key="track.id"
          class="playlists__mobile-track-row"
        >
          <div class="playlists__mobile-track-info">
            <p class="playlists__mobile-track-name">{{ track.name }}</p>
            <p class="playlists__mobile-track-artist">{{ track.artist }}</p>
          </div>
          <div class="playlists__mobile-track-stats">
            <p class="playlists__mobile-track-streams">{{ formatShort(track.streams) }}</p>
            <p class="playlists__mobile-track-skip">{{ track.skipRate }}% skip</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Playlist } from '../types'
import { IconChevronDown, IconChevronUp } from '../components/icons'

const props = defineProps<{
  playlists: Playlist[]
}>()

const localPlaylists = ref<Playlist[]>([])

watch(() => props.playlists, (newVal) => {
  localPlaylists.value = newVal.map(p => ({ ...p, isExpanded: false }))
}, { immediate: true })

const formatShort = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return num.toLocaleString()
}

const toggleExpand = (id: string) => {
  const playlist = localPlaylists.value.find(p => p.id === id)
  if (playlist && playlist.tracks && playlist.tracks.length > 0) {
    playlist.isExpanded = !playlist.isExpanded
  }
}
</script>

<style lang="scss" scoped>
$expanded-bg: #f8f8fc;

.playlists {
  // Desktop Table Header
  &__header {
    display: none;
    font-size: 0.75rem;
    color: var(--ditto-grey);

    @include lg {
      display: grid;
      grid-template-columns: 40px 1fr 100px 100px 140px 80px;
      gap: 1rem;
      padding: 0.75rem 1rem;
    }
  }

  &__header-center {
    text-align: center;
  }

  // Row wrapper
  &__row-wrapper {
    margin-bottom: 0.25rem;
  }

  // Desktop Row
  &__desktop-row {
    display: none;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    transition: background-color 0.15s ease;

    @include lg {
      display: grid;
      grid-template-columns: 40px 1fr 100px 100px 140px 80px;
    }

    &--clickable {
      cursor: pointer;
    }

    &--expanded {
      background-color: $expanded-bg;
    }

    &--collapsed {
      border-radius: 1rem;

      &:hover {
        background-color: var(--lighter-grey);
      }
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

  &__name-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__spotify-icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }

  &__name {
    font-size: 1rem;
    font-weight: 500;
    color: var(--blue);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 220px;
  }

  &__track-count {
    font-size: 0.75rem;
    color: var(--brand-primary);
  }

  &__streams {
    text-align: center;
    font-size: 1rem;
    font-weight: 500;
    color: var(--blue);
  }

  &__followers {
    text-align: center;
    font-size: 1rem;
    color: var(--blue);
  }

  &__curator {
    text-align: center;
    font-size: 0.875rem;
    color: var(--ditto-grey);
  }

  &__skip-rate {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    font-size: 1rem;
    color: var(--blue);
  }

  &__chevron {
    width: 1rem;
    height: 1rem;
    color: var(--ditto-grey);
  }

  // Mobile Row
  &__mobile-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0.5rem;
    transition: background-color 0.15s ease;

    @include lg {
      display: none;
    }

    &--clickable {
      cursor: pointer;
    }

    &--expanded {
      background-color: $expanded-bg;
      border-radius: 0.75rem 0.75rem 0 0;
    }

    &--collapsed {
      border-radius: 0.75rem;

      &:hover {
        background-color: var(--lighter-grey);
      }
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

  &__mobile-name-row {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  &__mobile-spotify-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  &__mobile-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--blue);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__mobile-track-count {
    font-size: 0.75rem;
    color: var(--brand-primary);
    margin-top: 0.125rem;
  }

  &__mobile-streams {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    flex-shrink: 0;
  }

  &__mobile-streams-value {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--blue);
  }

  // Expanded Tracks - Desktop
  &__expanded-desktop {
    display: none;
    background-color: $expanded-bg;
    padding: 0 2rem 1rem;
    margin-top: -0.25rem;

    @include lg {
      display: block;
    }
  }

  &__tracks-header {
    display: grid;
    grid-template-columns: 1fr 140px 100px 160px 80px;
    gap: 1rem;
    padding: 0.625rem 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--brand-primary);
    background-color: rgba(95, 31, 255, 0.1);
    border-radius: 0.5rem;
    margin-bottom: 0.25rem;
  }

  &__tracks-header-center {
    text-align: center;
  }

  &__track-row {
    display: grid;
    grid-template-columns: 1fr 140px 100px 160px 80px;
    gap: 1rem;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    border-bottom: 1px solid rgba(210, 210, 227, 0.3);

    &:last-child {
      border-bottom: 0;
    }
  }

  &__track-name {
    color: var(--blue);
    font-weight: 500;
  }

  &__track-artist {
    text-align: center;
    color: var(--ditto-grey);
  }

  &__track-streams {
    text-align: center;
    color: var(--blue);
    font-weight: 500;
  }

  &__track-date {
    text-align: center;
  }

  &__track-date-text {
    color: var(--blue);
  }

  &__track-streams-since {
    font-size: 0.75rem;
    color: var(--brand-primary);
  }

  &__track-skip-rate {
    text-align: center;
    color: var(--blue);
  }

  // Expanded Tracks - Mobile
  &__expanded-mobile {
    background-color: $expanded-bg;
    border-radius: 0 0 0.75rem 0.75rem;
    padding: 0 0.75rem 0.75rem;

    @include lg {
      display: none;
    }
  }

  &__mobile-track-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0;
    border-bottom: 1px solid rgba(210, 210, 227, 0.3);

    &:last-child {
      border-bottom: 0;
    }
  }

  &__mobile-track-info {
    min-width: 0;
    flex: 1;
  }

  &__mobile-track-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--blue);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__mobile-track-artist {
    font-size: 0.75rem;
    color: var(--ditto-grey);
  }

  &__mobile-track-stats {
    text-align: right;
    flex-shrink: 0;
    padding-left: 0.75rem;
  }

  &__mobile-track-streams {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--blue);
  }

  &__mobile-track-skip {
    font-size: 0.75rem;
    color: var(--ditto-grey);
  }
}
</style>
