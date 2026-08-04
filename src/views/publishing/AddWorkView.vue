<template>
  <div class="space-y-5">
    <StepIndicator
      :current-step="step"
      :labels="['Pick a Release', 'Register Works']"
      @go-to-step="step = 'pick-release'"
    />

    <!-- ============ Step 1: pick a release ============ -->
    <template v-if="step === 'pick-release'">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 class="font-satoshi text-xl tracking-[-0.02em] text-ditto-text">
          <span class="font-normal">Pick a</span> <span class="font-black">release</span>
        </h2>
        <SearchInput v-model="releaseQuery" placeholder="Search for a release" />
      </div>
      <p class="text-sm text-ditto-subtext -mt-3">Choose a release to register its works for publishing.</p>

      <div class="space-y-1">
        <button
          v-for="release in filteredReleases"
          :key="release.id"
          @click="selectRelease(release)"
          class="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-ditto-light-grey transition-colors text-left"
        >
          <img :src="release.artwork" :alt="release.title" class="w-14 h-14 rounded-lg object-cover flex-shrink-0" loading="lazy" />
          <span class="flex-1 min-w-0">
            <span class="block text-sm font-medium text-ditto-text truncate">{{ release.title }}</span>
            <span class="block text-xs text-ditto-subtext truncate">{{ release.artist }} · {{ release.year }}</span>
          </span>
          <span class="text-xs text-ditto-subtext tabular-nums flex-shrink-0">
            {{ registeredCount(release) }} of {{ release.tracks.length }} registered
          </span>
          <svg class="w-4 h-4 text-ditto-subtext flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,6 15,12 9,18" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <p v-if="filteredReleases.length === 0" class="text-center text-sm text-ditto-subtext py-10">
          No releases match "{{ releaseQuery }}".
        </p>
      </div>
    </template>

    <!-- ============ Step 2: register works ============ -->
    <template v-else-if="selectedRelease">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 class="font-satoshi text-xl tracking-[-0.02em] text-ditto-text">
          <span class="font-normal">Choose which</span> <span class="font-black">works to register</span>
        </h2>
        <button @click="step = 'pick-release'" class="text-sm text-ditto-purple hover:underline text-left sm:text-right">
          Change release
        </button>
      </div>

      <!-- Selected release summary -->
      <div class="flex items-center gap-4 px-4 py-3 bg-white border border-gray-200 rounded-2xl">
        <img :src="selectedRelease.artwork" :alt="selectedRelease.title" class="w-12 h-12 rounded-lg object-cover" />
        <div class="min-w-0">
          <p class="text-sm font-semibold text-ditto-text truncate">{{ selectedRelease.title }}</p>
          <p class="text-xs text-ditto-subtext">{{ selectedRelease.artist }} · {{ selectedRelease.year }}</p>
        </div>
        <p class="ml-auto text-xs text-ditto-subtext tabular-nums flex-shrink-0">
          {{ registeredCount(selectedRelease) }} of {{ selectedRelease.tracks.length }} registered
        </p>
      </div>

      <!-- Tracks -->
      <div class="space-y-1">
        <div
          v-for="track in selectedRelease.tracks"
          :key="track.id"
          :class="['rounded-2xl transition-colors', expandedTrackId === track.id ? 'bg-ditto-light-grey' : 'hover:bg-ditto-light-grey']"
        >
          <!-- Row -->
          <div class="grid grid-cols-[2rem_minmax(0,1fr)_auto] sm:grid-cols-[2rem_minmax(0,1fr)_70px_130px_110px] items-center gap-3 px-4 py-4">
            <span class="text-sm text-ditto-subtext">{{ track.number }}</span>
            <span class="min-w-0">
              <span class="block text-sm font-medium text-ditto-text truncate">{{ track.title }}</span>
              <span class="block text-xs text-ditto-subtext sm:hidden">{{ track.duration }} · {{ track.isrc }}</span>
            </span>
            <span class="hidden sm:block text-sm text-ditto-subtext tabular-nums">{{ track.duration }}</span>
            <span class="hidden sm:block text-xs text-ditto-subtext font-mono">{{ track.isrc }}</span>
            <span class="justify-self-end">
              <StatusPill v-if="track.registered" variant="success" label="Registered" />
              <button
                v-else
                @click="toggleTrack(track)"
                :class="[
                  'px-4 py-1.5 rounded-full text-xs font-medium transition-colors',
                  expandedTrackId === track.id
                    ? 'bg-ditto-text text-white'
                    : 'border border-ditto-purple/40 text-ditto-purple bg-white hover:bg-ditto-purple/5'
                ]"
              >{{ expandedTrackId === track.id ? 'Close' : 'Register' }}</button>
            </span>
          </div>

          <!-- Expanded registration form -->
          <div v-if="expandedTrackId === track.id && forms[track.id]" class="px-4 pb-5 space-y-6">
            <div class="border-t border-ditto-text/10 pt-5 space-y-6">
              <!-- Original work -->
              <div>
                <p class="text-sm font-semibold text-ditto-text mb-2">Is this an Original Musical Work?</p>
                <div class="flex items-center gap-2">
                  <button
                    v-for="opt in ['Yes', 'No']" :key="'orig' + opt"
                    @click="forms[track.id].original = opt"
                    :class="segClass(forms[track.id].original === opt)"
                  >{{ opt }}</button>
                </div>
              </div>

              <!-- Titles + duration -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-ditto-subtext mb-1.5">Alternative Title <span class="text-ditto-subtext/60">(optional)</span></label>
                  <input v-model="forms[track.id].altTitle" type="text" placeholder="Enter an alternative title" :class="inputClass" />
                  <button class="text-xs font-medium text-ditto-purple hover:underline mt-1.5">Add another title</button>
                </div>
                <div>
                  <label class="block text-xs font-medium text-ditto-subtext mb-1.5">Duration</label>
                  <input v-model="forms[track.id].duration" type="text" :class="inputClass" />
                </div>
              </div>

              <!-- Writers -->
              <div>
                <div class="flex items-center justify-between mb-2.5">
                  <p class="text-sm font-semibold text-ditto-text">Writers</p>
                  <p :class="['text-xs font-medium tabular-nums', shareTotal(track.id) === 100 ? 'text-ditto-subtext' : 'text-error']">
                    {{ shareTotal(track.id) }}% of 100% allocated
                  </p>
                </div>
                <div class="space-y-3">
                  <div
                    v-for="(w, i) in forms[track.id].writers" :key="'w' + i"
                    class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_150px_90px_32px] gap-3 items-end bg-white rounded-xl p-3"
                  >
                    <div>
                      <label class="block text-xs font-medium text-ditto-subtext mb-1.5">Legal Name</label>
                      <input v-model="w.legalName" type="text" placeholder="Start typing" :class="inputClass" />
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-ditto-subtext mb-1.5">Email</label>
                      <input v-model="w.email" type="email" placeholder="Enter email" :class="inputClass" />
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-ditto-subtext mb-1.5">Writer Role</label>
                      <select v-model="w.role" :class="[inputClass, 'cursor-pointer', !w.role && 'text-ditto-subtext/70']">
                        <option value="" disabled>Select Role</option>
                        <option v-for="r in writerRoles" :key="r" :value="r">{{ r }}</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-ditto-subtext mb-1.5">Share</label>
                      <div class="relative">
                        <input v-model.number="w.share" type="number" min="0" max="100" :class="[inputClass, 'pr-7']" />
                        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ditto-subtext">%</span>
                      </div>
                    </div>
                    <button
                      v-if="forms[track.id].writers.length > 1"
                      @click="forms[track.id].writers.splice(i, 1)"
                      class="h-10 flex items-center justify-center text-ditto-subtext hover:text-error transition-colors"
                      aria-label="Remove writer"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/></svg>
                    </button>
                  </div>
                </div>
                <div class="flex flex-wrap items-center gap-4 mt-3">
                  <button @click="addWriter(track.id)" class="text-xs font-medium text-ditto-purple hover:underline">Add another writer</button>
                  <div v-if="copySources(track.id).length > 0" class="flex items-center gap-2">
                    <span class="text-xs text-ditto-subtext">Copy shares from</span>
                    <select @change="copyShares(track.id, ($event.target as HTMLSelectElement).value)" :class="[inputClass, '!h-8 !py-0 text-xs cursor-pointer w-44']">
                      <option value="">Select a track</option>
                      <option v-for="s in copySources(track.id)" :key="s.id" :value="s.id">{{ s.title }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Samples -->
              <div>
                <p class="text-sm font-semibold text-ditto-text mb-2">Have you used any samples in this composition?</p>
                <div class="flex items-center gap-2">
                  <button
                    v-for="opt in ['Yes', 'No']" :key="'smp' + opt"
                    @click="forms[track.id].samples = opt"
                    :class="segClass(forms[track.id].samples === opt)"
                  >{{ opt }}</button>
                </div>
                <p v-if="forms[track.id].samples === 'Yes'" class="text-xs text-ditto-subtext mt-2 max-w-md">
                  You'll need a cleared sample license before this work can be registered — upload it under Copyright Documents after submitting.
                </p>
              </div>

              <!-- Submit -->
              <div class="flex items-center gap-3 pt-1 border-t border-ditto-text/10 sm:border-0 sm:pt-0">
                <button
                  @click="registerWork(track)"
                  :disabled="!isValid(track.id)"
                  :class="[
                    'px-6 py-2.5 text-sm font-medium rounded-full transition-all',
                    isValid(track.id) ? 'bg-ditto-purple btn-pop-purple text-white hover:opacity-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  ]"
                >Register Work</button>
                <button @click="expandedTrackId = null" class="px-4 py-2 text-sm font-medium text-ditto-subtext hover:text-ditto-text">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import StepIndicator from '../../components/neighbouring-rights/StepIndicator.vue'
import SearchInput from '../../components/common/SearchInput.vue'
import StatusPill from '../../components/common/StatusPill.vue'
import { registrableReleases, writerRoles, type RegistrableRelease, type RegistrableTrack } from '../../data/publishingAddWorkMock'

export interface NewWorkWriter { legalName: string; email: string; role: string; share: number }
export interface NewWorkPayload {
  track: RegistrableTrack
  release: RegistrableRelease
  title: string
  duration: string
  writers: NewWorkWriter[]
}

const emit = defineEmits<{
  (e: 'registered', payload: NewWorkPayload): void
}>()

// Account writer identity — prefilled as the first writer, like the live flow
const ME = { legalName: 'Amara Okoye', email: 'amara.okoye@example.com' }

const step = ref<'pick-release' | 'register-tracks'>('pick-release')
const releaseQuery = ref('')
const selectedRelease = ref<RegistrableRelease | null>(null)
const expandedTrackId = ref<string | null>(null)

interface TrackForm {
  original: string | null
  altTitle: string
  duration: string
  samples: string | null
  writers: NewWorkWriter[]
}
const forms = reactive<Record<string, TrackForm>>({})

const inputClass = 'w-full h-10 px-3.5 border border-gray-200 rounded-lg text-sm text-ditto-text bg-white focus:outline-none focus:border-ditto-purple placeholder:text-ditto-subtext/70'
const segClass = (active: boolean) => [
  'px-5 py-1.5 rounded-full text-sm font-medium transition-colors',
  active ? 'bg-ditto-text text-white' : 'bg-white border border-gray-200 text-ditto-subtext hover:border-gray-300',
].join(' ')

const filteredReleases = computed(() => {
  const q = releaseQuery.value.trim().toLowerCase()
  if (!q) return registrableReleases
  return registrableReleases.filter(r => r.title.toLowerCase().includes(q) || r.artist.toLowerCase().includes(q))
})

const registeredCount = (r: RegistrableRelease) => r.tracks.filter(t => t.registered).length

const selectRelease = (r: RegistrableRelease) => {
  selectedRelease.value = r
  expandedTrackId.value = null
  step.value = 'register-tracks'
}

const toggleTrack = (track: RegistrableTrack) => {
  if (expandedTrackId.value === track.id) {
    expandedTrackId.value = null
    return
  }
  if (!forms[track.id]) {
    forms[track.id] = {
      original: null,
      altTitle: '',
      duration: track.duration,
      samples: null,
      writers: [{ ...ME, role: 'Composer/Author', share: 100 }],
    }
  }
  expandedTrackId.value = track.id
}

const addWriter = (trackId: string) => {
  forms[trackId].writers.push({ legalName: '', email: '', role: '', share: 0 })
}

const shareTotal = (trackId: string) =>
  forms[trackId]?.writers.reduce((sum, w) => sum + (Number(w.share) || 0), 0) ?? 0

// Other tracks on this release with a filled-in writer set
const copySources = (trackId: string) =>
  (selectedRelease.value?.tracks ?? []).filter(t =>
    t.id !== trackId && forms[t.id] && forms[t.id].writers.some(w => w.legalName)
  )

const copyShares = (trackId: string, sourceId: string) => {
  if (!sourceId || !forms[sourceId]) return
  forms[trackId].writers = forms[sourceId].writers.map(w => ({ ...w }))
}

const isValid = (trackId: string) => {
  const f = forms[trackId]
  if (!f) return false
  return (
    f.original !== null &&
    f.samples !== null &&
    f.writers.length > 0 &&
    f.writers.every(w => w.legalName.trim() && w.role) &&
    shareTotal(trackId) === 100
  )
}

const registerWork = (track: RegistrableTrack) => {
  if (!isValid(track.id) || !selectedRelease.value) return
  track.registered = true
  expandedTrackId.value = null
  emit('registered', {
    track,
    release: selectedRelease.value,
    title: forms[track.id].altTitle.trim() || track.title,
    duration: forms[track.id].duration,
    writers: forms[track.id].writers.map(w => ({ ...w })),
  })
}
</script>
