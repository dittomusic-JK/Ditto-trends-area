<template>
  <!-- The splits UI is the ported ditto-services component set (1:1). -->
  <RoyaltySplitsPage :release-data="splitsRelease" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import RoyaltySplitsPage from '../../components/royalty-splits/RoyaltySplitsPage.vue'
import type { Release as SplitsRelease } from '../../components/royalty-splits/types'
import type { ReleaseDetail } from '../../data/releaseDetailMockData'

const props = defineProps<{ release: ReleaseDetail }>()

// Map the trends release detail onto the services-project Release shape.
const splitsRelease = computed<SplitsRelease>(() => ({
  id: props.release.id,
  title: props.release.title,
  artwork: props.release.artwork,
  accountHolder: 'Goldenboy Entertainment (me)',
  tracks: props.release.tracks.map(t => {
    const seed = props.release.splits.find(s => s.trackId === t.id)
    const splits = (seed?.collaborators ?? []).map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      share: c.share,
      status: c.status,
      activeSince: c.activeSince,
      hasAccount: c.status !== 'unclaimed',
    }))
    return {
      trackId: t.id,
      trackNumber: t.number,
      trackName: t.title,
      splits,
      userShare: Math.max(0, 100 - splits.reduce((sum, s) => sum + s.share, 0)),
    }
  }),
}))
</script>
