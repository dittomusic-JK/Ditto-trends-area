<template>
  <!-- Same splits engine as music releases; a video is a single "track". -->
  <RoyaltySplitsPage :release-data="splitsRelease" item-label="Video" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import RoyaltySplitsPage from '../../components/royalty-splits/RoyaltySplitsPage.vue'
import type { Release as SplitsRelease } from '../../components/royalty-splits/types'
import type { VideoDetail } from '../../data/videoDetailMockData'

const props = defineProps<{ video: VideoDetail }>()

const splitsRelease = computed<SplitsRelease>(() => {
  const splits = props.video.splits.map(c => ({
    id: c.id,
    name: c.name,
    email: c.email,
    share: c.share,
    status: c.status,
    activeSince: c.activeSince,
    hasAccount: c.status !== 'unclaimed',
  }))
  return {
    id: props.video.id,
    title: props.video.title,
    artwork: props.video.artwork,
    accountHolder: 'Goldenboy Entertainment (me)',
    tracks: [{
      trackId: props.video.id,
      trackNumber: 1,
      trackName: props.video.title,
      splits,
      userShare: Math.max(0, 100 - splits.reduce((sum, s) => sum + s.share, 0)),
    }],
  }
})
</script>
