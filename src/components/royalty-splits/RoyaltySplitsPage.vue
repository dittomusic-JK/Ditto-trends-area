<template>
  <div class="rsp">
    <!-- Page header -->
    <div class="rsp__header">
      <div>
        <h1 class="rsp__title">Royalty Splits</h1>
      </div>

      <!-- Legend -->
      <div class="rsp__legend">
        <div class="rsp__legend-item">
          <div class="rsp__dot rsp__dot--yours" />
          <span class="rsp__legend-label">Yours</span>
        </div>
        <div class="rsp__legend-item">
          <div class="rsp__dot rsp__dot--collab" />
          <span class="rsp__legend-label">Collaborators</span>
        </div>
        <div class="rsp__legend-item">
          <div class="rsp__dot rsp__dot--pending" />
          <span class="rsp__legend-label">Pending</span>
        </div>
      </div>
    </div>

    <!-- Release header with progress -->
    <ReleaseHeader
      :title="release.title"
      :artwork="release.artwork"
      :account-holder="release.accountHolder"
      user-type="subscription"
      :total-tracks="release.tracks.length"
      :tracks-with-splits="tracksWithSplits.length"
    />

    <!-- Empty state -->
    <div v-if="tracksWithSplits.length === 0" class="rsp__empty">
      <div class="rsp__empty-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="#6C5CE7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke="#6C5CE7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19 8V14M16 11H22" stroke="#6C5CE7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3 class="rsp__empty-title">No splits configured yet</h3>
      <p class="rsp__empty-desc">
        Add collaborators to share royalties from this release. Click "Add Split" on any track below to get started.
      </p>
    </div>

    <!-- Unified track list -->
    <TrackGroup
      :tracks="sortedTracks"
      :expanded-track-id="expandedTrackId"
      :release="release"
      :pending-changes="pendingChanges"
      :known-collaborators="knownCollaborators"
      :is-r-l-s="false"
      :save-requested="saveRequestCounter"
      @toggle="toggleTrack"
      @save="handleBatchSave"
      @resend-confirmation="handleResendConfirmation"
      @open-copy-modal="openCopyFromModal"
      @copy-to="openCopyToModal"
      @dirty-change="handleDirtyChange"
      @edit-email="openEditEmailModal"
    />

    <CopySplitsModal
      v-if="copyModal.show"
      :mode="copyModal.mode"
      :source-tracks="tracksWithSplits"
      :source-track-name="copyModal.sourceTrackName"
      :source-user-share="copyModal.sourceUserShare"
      :source-splits="copyModal.sourceSplits"
      :target-tracks="copyModal.targetTracks"
      :current-track-id="copyModal.currentTrackId"
      @close="copyModal.show = false"
      @confirm="handleCopyConfirm"
    />

    <FirstSplitModal
      v-if="showFirstSplitModal"
      :other-tracks-count="tracksWithoutSplits.length"
      :is-r-l-s="false"
      @close="showFirstSplitModal = false"
      @copy-to-all="handleCopyFromFirstSplit"
    />

    <EditEmailModal
      v-if="editEmailModal.show"
      :collaborator-name="editEmailModal.collaboratorName"
      :collaborator-email="editEmailModal.collaboratorEmail"
      :current-email="editEmailModal.currentEmail"
      :current-track-id="editEmailModal.currentTrackId"
      :tracks-with-collaborator="editEmailModal.tracksWithCollaborator"
      @close="editEmailModal.show = false"
      @confirm="handleEditEmailConfirm"
    />

    <UnsavedChangesModal
      v-if="showUnsavedChangesModal"
      @save="handleSaveAllAndLeave"
      @discard="handleDiscardAndLeave"
      @cancel="handleCancelUnsavedChanges"
    />

    <Toast
      :visible="toast.visible"
      :message="toast.message"
      :type="toast.type"
      @close="toast.visible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import type { Release, TrackSplit, Collaborator } from './types'
import ReleaseHeader from './ReleaseHeader.vue'
import TrackGroup from './TrackGroup.vue'
import CopySplitsModal from './CopySplitsModal.vue'
import FirstSplitModal from './FirstSplitModal.vue'
import EditEmailModal from './EditEmailModal.vue'
import UnsavedChangesModal from './UnsavedChangesModal.vue'
import Toast from '../ui/Toast.vue'

const props = defineProps<{
  releaseData: Release
}>()

const expandedTrackId = ref<string | null>(null)
const pendingChanges = reactive<Record<string, boolean>>({})
const dirtyForms = reactive<Record<string, boolean>>({})
const showFirstSplitModal = ref(false)
const saveRequestCounter = ref(0)

const hasShownFirstSplitModal = ref(false)
const lastSavedTrackId = ref<string | null>(null)
const showUnsavedChangesModal = ref(false)
const pendingTrackSwitch = ref<string | null>(null)

// Computed: check if there are any unsaved changes (only form data being typed, not edits)
const hasUnsavedChanges = computed(() =>
  Object.values(dirtyForms).some(isDirty => isDirty)
)

// Browser beforeunload handler
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (hasUnsavedChanges.value) {
    e.preventDefault()
    e.returnValue = ''
    return ''
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

// Toast state
const toast = reactive<{
  visible: boolean
  message: string
  type: 'success' | 'info' | 'warning'
}>({
  visible: false,
  message: '',
  type: 'success'
})

let toastTimeout: ReturnType<typeof setTimeout> | null = null

const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
  if (toastTimeout) clearTimeout(toastTimeout)
  toast.message = message
  toast.type = type
  toast.visible = true
  toastTimeout = setTimeout(() => {
    toast.visible = false
  }, 3000)
}

// Known collaborators (in real app, this would come from API based on user's history)
const knownCollaborators = [
  { name: 'Rema', email: 'rema@mavinrecords.com' },
  { name: 'Ruger', email: 'ruger@jonzing.com' },
  { name: 'Davido', email: 'davido@dmwrecords.com' },
  { name: 'Crayon', email: 'crayon@mavinrecords.com' },
  { name: 'JELEEL!', email: 'jeleel@10k.com' },
  { name: 'Rvssian', email: 'rvssian@headconcussion.co' },
  { name: 'Dess Dior', email: 'dessdior@gmail.com' },
  { name: 'Tion Wayne', email: 'tion@goldenboy.com' },
  { name: 'Kojo Funds', email: 'kojo@kojofunds.com' },
  { name: 'GA Productions', email: 'ga.beats@gmail.com' },
]

// Copy modal state
const copyModal = reactive<{
  show: boolean
  mode: 'select-source' | 'copy-to'
  sourceTrackId: string
  sourceTrackName: string
  sourceUserShare: number
  sourceSplits: Collaborator[]
  targetTracks: TrackSplit[]
  currentTrackId?: string
}>({
  show: false,
  mode: 'select-source',
  sourceTrackId: '',
  sourceTrackName: '',
  sourceUserShare: 100,
  sourceSplits: [],
  targetTracks: [],
  currentTrackId: undefined
})

// Edit email modal state
const editEmailModal = reactive<{
  show: boolean
  collaboratorName: string
  collaboratorEmail: string
  currentEmail: string
  currentTrackId: string
  tracksWithCollaborator: TrackSplit[]
}>({
  show: false,
  collaboratorName: '',
  collaboratorEmail: '',
  currentEmail: '',
  currentTrackId: '',
  tracksWithCollaborator: []
})

// Local working copy of the release, seeded from props (deep-cloned so edits
// stay local to this prototype view)
const release = reactive<Release>(JSON.parse(JSON.stringify(props.releaseData)))

// Track grouping computed properties
const tracksWithoutSplits = computed(() =>
  release.tracks.filter(t => t.splits.length === 0)
)

const tracksWithSplits = computed(() =>
  release.tracks.filter(t => t.splits.length > 0)
)

const sortedTracks = computed(() =>
  [...release.tracks].sort((a, b) => a.trackNumber - b.trackNumber)
)

// Handlers
const toggleTrack = (trackId: string) => {
  // If collapsing the current track, no unsaved check needed
  if (expandedTrackId.value === trackId) {
    expandedTrackId.value = null
    return
  }

  // If expanding a different track while current one has unsaved form data, show modal
  if (expandedTrackId.value && dirtyForms[expandedTrackId.value]) {
    pendingTrackSwitch.value = trackId
    showUnsavedChangesModal.value = true
    return
  }

  // No unsaved changes, switch directly
  expandedTrackId.value = trackId
}

// Batch save handler - applies all changes at once
const handleBatchSave = (trackId: string, changes: { added: Collaborator[], edited: Collaborator[], deleted: string[] }) => {
  const track = release.tracks.find(t => t.trackId === trackId)
  if (!track) return

  const totalChanges = changes.added.length + changes.edited.length + changes.deleted.length
  // Check if the entire release had any splits before this save (not just this track)
  const releaseHadSplitsBefore = release.tracks.some(t => t.splits.length > 0)

  // Process deletions first
  changes.deleted.forEach(splitId => {
    const splitIndex = track.splits.findIndex(s => s.id === splitId)
    if (splitIndex > -1) {
      track.splits.splice(splitIndex, 1)
    }
  })

  // Process edits
  changes.edited.forEach(editedSplit => {
    const split = track.splits.find(s => s.id === editedSplit.id)
    if (split) {
      // Store original share if this was an active split (for showing pending change indicator)
      if (split.status === 'active' && split.originalShare === undefined) {
        split.originalShare = split.share
      }

      split.name = editedSplit.name
      split.email = editedSplit.email
      split.share = editedSplit.share

      // When editing an active or rejected split, it becomes pending again (needs re-confirmation)
      if (split.status === 'active' || split.status === 'rejected') {
        split.status = 'pending'
      }
    }
  })

  // Process additions
  changes.added.forEach(newSplit => {
    // Check if collaborator has a Ditto account (simulated via knownCollaborators)
    const hasAccount = knownCollaborators.some(
      kc => kc.email.toLowerCase() === newSplit.email.toLowerCase()
    )

    track.splits.push({
      ...newSplit,
      id: `s${Date.now()}_${Math.random()}`,
      status: 'pending',
      hasAccount,
      activeSince: undefined
    })
  })

  // Recalculate user share (rejected splits don't reduce user share)
  track.userShare = Math.max(0, 100 - track.splits.filter(s => s.status !== 'rejected').reduce((sum, s) => sum + s.share, 0))

  // Clear the dirty form state since we just saved
  dirtyForms[trackId] = false
  lastSavedTrackId.value = trackId

  // If there was a pending track switch (from unsaved changes modal), do it now
  if (pendingTrackSwitch.value) {
    expandedTrackId.value = pendingTrackSwitch.value
    pendingTrackSwitch.value = null
  }

  // Check if this is the first split being saved on the release
  const isFirstSplit = !releaseHadSplitsBefore && track.splits.length > 0 && !hasShownFirstSplitModal.value

  // Show first split modal if this is the first one, otherwise show toast
  if (isFirstSplit) {
    hasShownFirstSplitModal.value = true
    showFirstSplitModal.value = true
  } else {
    // Show appropriate success message
    if (totalChanges === 1 && changes.added.length === 1) {
      showToast('Split added successfully')
    } else if (totalChanges === 1 && changes.edited.length === 1) {
      showToast('Split updated successfully')
    } else if (totalChanges === 1 && changes.deleted.length === 1) {
      showToast('Split removed successfully')
    } else {
      showToast(`${totalChanges} change${totalChanges > 1 ? 's' : ''} saved successfully`)
    }
  }
}

const handleResendConfirmation = (trackId: string, splitId: string) => {
  const track = release.tracks.find(t => t.trackId === trackId)
  const split = track?.splits.find(s => s.id === splitId)
  if (split) {
    if (split.status === 'unclaimed') {
      showToast(`Invitation resent to ${split.email}`, 'info')
    } else {
      showToast(`Confirmation email sent to ${split.email}`, 'info')
    }
  }
}

// Track when form has unsaved data being typed
const handleDirtyChange = (trackId: string, isDirty: boolean) => {
  dirtyForms[trackId] = isDirty
}

// Open copy from modal (unified flow with source selection inside modal)
const openCopyFromModal = (currentTrackId: string) => {
  copyModal.mode = 'select-source'
  copyModal.currentTrackId = currentTrackId
  copyModal.targetTracks = release.tracks
  copyModal.sourceTrackId = ''
  copyModal.sourceTrackName = ''
  copyModal.sourceUserShare = 100
  copyModal.sourceSplits = []
  copyModal.show = true
}

// Open copy to specific tracks modal (pre-selected source)
const openCopyToModal = (sourceTrackId: string) => {
  const sourceTrack = release.tracks.find(t => t.trackId === sourceTrackId)
  if (sourceTrack) {
    const otherTracks = release.tracks.filter(t => t.trackId !== sourceTrackId)
    copyModal.mode = 'copy-to'
    copyModal.sourceTrackId = sourceTrackId
    copyModal.sourceTrackName = sourceTrack.trackName
    copyModal.sourceUserShare = sourceTrack.userShare
    copyModal.sourceSplits = sourceTrack.splits
    copyModal.targetTracks = otherTracks
    copyModal.currentTrackId = undefined
    copyModal.show = true
  }
}

// Handle copy from first split modal
const handleCopyFromFirstSplit = () => {
  showFirstSplitModal.value = false
  if (lastSavedTrackId.value) {
    openCopyToModal(lastSavedTrackId.value)
  }
}

// Handle copy confirmation from modal
const handleCopyConfirm = (_mode: 'replace', selectedTrackIds: string[], sourceTrackId?: string) => {
  // Use sourceTrackId from modal if provided (select-source mode), otherwise use stored one
  const effectiveSourceId = sourceTrackId || copyModal.sourceTrackId
  const sourceTrack = release.tracks.find(t => t.trackId === effectiveSourceId)
  if (sourceTrack) {
    const selectedTracks = release.tracks.filter(t => selectedTrackIds.includes(t.trackId))
    applyCopyToTracks(sourceTrack, selectedTracks)
    showToast(`Splits copied to ${selectedTrackIds.length} track${selectedTrackIds.length > 1 ? 's' : ''}`)
  }
  copyModal.show = false
}

// Apply copy to multiple tracks (always replace mode)
const applyCopyToTracks = (sourceTrack: TrackSplit, targetTracks: TrackSplit[]) => {
  targetTracks.forEach(targetTrack => {
    const track = release.tracks.find(t => t.trackId === targetTrack.trackId)
    if (track) {
      // Replace all splits with copied ones
      const copiedSplits: Collaborator[] = sourceTrack.splits.map(s => ({
        id: `s${Date.now()}_${Math.random()}`,
        name: s.name,
        email: s.email,
        share: s.share,
        status: 'pending' as const
      }))
      track.splits = copiedSplits
      track.userShare = Math.max(0, 100 - track.splits.reduce((sum, s) => sum + s.share, 0))
      pendingChanges[track.trackId] = true
    }
  })
}

// Open edit email modal for a collaborator on a given track
const openEditEmailModal = (trackId: string, collaboratorEmail: string) => {
  // Find all tracks where this collaborator email appears
  const tracksWithCollaborator = release.tracks.filter(t =>
    t.splits.some(s => s.email.toLowerCase() === collaboratorEmail.toLowerCase())
  )

  // Get collaborator name from the originating track (fall back to first match)
  const sourceTrack = release.tracks.find(t => t.trackId === trackId) ?? tracksWithCollaborator[0]
  const sourceSplit = sourceTrack?.splits.find(
    s => s.email.toLowerCase() === collaboratorEmail.toLowerCase()
  )

  if (sourceSplit && tracksWithCollaborator.length > 0) {
    editEmailModal.collaboratorName = sourceSplit.name
    editEmailModal.collaboratorEmail = sourceSplit.email
    editEmailModal.currentEmail = sourceSplit.email
    editEmailModal.currentTrackId = sourceTrack?.trackId ?? trackId
    editEmailModal.tracksWithCollaborator = tracksWithCollaborator
    editEmailModal.show = true
  }
}

// Handle edit email confirmation.
// Always update the given track; update other tracks only if the user opted in.
const handleEditEmailConfirm = (newEmail: string, selectedTrackIds: string[]) => {
  const oldEmail = editEmailModal.currentEmail.toLowerCase()
  const newHasAccount = knownCollaborators.some(
    kc => kc.email.toLowerCase() === newEmail.toLowerCase()
  )
  let updatedCount = 0

  selectedTrackIds.forEach(trackId => {
    const track = release.tracks.find(t => t.trackId === trackId)
    if (track) {
      const split = track.splits.find(s => s.email.toLowerCase() === oldEmail)
      if (split) {
        split.email = newEmail
        split.hasAccount = newHasAccount
        // Subscription splits need re-confirmation after an email change
        if (split.status === 'active') {
          split.status = 'pending'
        }
        pendingChanges[trackId] = true
        updatedCount++
      }
    }
  })

  editEmailModal.show = false
  showToast(
    updatedCount > 1
      ? `Email updated across ${updatedCount} splits`
      : 'Collaborator email updated'
  )
}

// Save all changes and then leave (or switch tracks)
const handleSaveAllAndLeave = () => {
  showUnsavedChangesModal.value = false
  // Trigger SplitsEditor's save via the saveRequested counter.
  // The actual track switch happens in handleBatchSave after the save completes.
  saveRequestCounter.value++
}

// Discard all changes and leave (or switch tracks)
const handleDiscardAndLeave = () => {
  // Clear all pending changes
  Object.keys(pendingChanges).forEach(trackId => {
    pendingChanges[trackId] = false
  })
  // Clear dirty form states
  Object.keys(dirtyForms).forEach(trackId => {
    dirtyForms[trackId] = false
  })
  showUnsavedChangesModal.value = false

  // If we were switching tracks, do that now
  if (pendingTrackSwitch.value) {
    expandedTrackId.value = pendingTrackSwitch.value
    pendingTrackSwitch.value = null
  }
}

// Cancel unsaved changes modal (stay on current track)
const handleCancelUnsavedChanges = () => {
  showUnsavedChangesModal.value = false
  pendingTrackSwitch.value = null
}
</script>

<style lang="scss" scoped>
.rsp {
  // Width comes from the release detail layout — no local cap.
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  &__header {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    @include sm {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__title {
    // Matches the tab-header pattern (text-xl font-black) used on Stores/Overview
    font-size: 1.25rem;
    font-weight: 900;
    color: var(--blue);
    font-family: $font-satoshi;
    letter-spacing: -0.03em;
  }

  &__legend {
    display: none;
    align-items: center;
    gap: 1rem;
    font-size: $text-xs;
    font-family: $font-satoshi;

    @include sm { display: flex; }
  }

  &__legend-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  &__legend-label { color: var(--ditto-grey); }

  &__dot {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 9999px;

    &--yours { background: var(--brand-secondary); }
    &--collab { background: var(--success); }
    &--pending { background: $color-amber-500; }
  }

  /* Empty state */
  &__empty {
    border-radius: 1rem;
    border: 2px dashed var(--faded-grey);
    padding: 2rem;
    text-align: center;
    background: var(--ditto-colors-light-dark-ditto-background-white);
  }

  &__empty-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    background: rgba($color-ditto-purple, 0.1);
  }

  &__empty-title {
    font-size: $text-body;
    font-weight: 600;
    font-family: $font-satoshi;
    margin-bottom: 0.5rem;
    color: var(--blue);
  }

  &__empty-desc {
    font-size: $text-sm;
    font-family: $font-satoshi;
    margin-bottom: 1rem;
    max-width: 24rem;
    margin-left: auto;
    margin-right: auto;
    color: var(--ditto-grey);
  }
}
</style>
