<template>
  <div class="relative px-4 py-4 sm:px-6 sm:py-6 lg:px-16 lg:py-8 w-full max-w-full box-border">
    <GlobalSearch />
    <!-- ── Header ── -->
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-12">
      <div>
        <h1 class="font-satoshi font-black text-xl sm:text-3xl lg:text-[42px] tracking-[-0.03em] text-ditto-text">
          {{ isNewUser ? 'Welcome, Goldenboy!' : 'Hey, Goldenboy!' }} <span>👋</span>
        </h1>
        <p class="text-sm text-ditto-subtext mt-1.5">{{ isNewUser ? "Let's get your first release out into the world." : "Here's what's happening with your music." }}</p>
      </div>
      <button @click="emit('navigate', 'music-builder')" class="flex items-center gap-2 px-5 h-10 bg-ditto-purple btn-pop-purple text-white text-sm font-medium rounded-full hover:opacity-95 transition-all flex-shrink-0 lg:mr-[24.75rem]">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        Create Release
      </button>
    </div>

    <!-- ── Stat band: Royalties + music snapshot + Analytics ── -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
      <!-- Balance -->
      <button @click="emit('navigate', 'royalties')" class="text-left rounded-2xl border border-gray-200 bg-ditto-light-grey/40 p-6 hover:shadow-lg transition-shadow group flex flex-col justify-between min-h-[230px]">
        <div>
          <p class="text-sm text-ditto-subtext">Current Balance</p>
          <p v-if="!isNewUser" class="font-satoshi font-black text-3xl lg:text-4xl tracking-[-0.03em] text-ditto-text mt-2 tabular-nums">£{{ balanceCount.toLocaleString('en-GB') }}<span class="text-xl">.56</span></p>
          <template v-else>
            <p class="font-satoshi font-black text-3xl lg:text-4xl tracking-[-0.03em] text-ditto-subtext/40 mt-2">£0<span class="text-xl">.00</span></p>
            <p class="text-xs text-ditto-subtext mt-2 leading-relaxed">Royalties land here once your music is live in stores.</p>
          </template>
        </div>
        <p class="flex items-center justify-between text-sm text-ditto-subtext">
          {{ isNewUser ? 'Nothing to withdraw yet' : 'Available now' }}
          <span class="w-8 h-8 rounded-full bg-ditto-text text-white flex items-center justify-center group-hover:bg-ditto-purple transition-colors">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </span>
        </p>
      </button>

      <!-- New user: onboarding replaces the stats snapshot -->
      <div v-if="isNewUser" class="sm:col-span-1 lg:col-span-2 rounded-2xl p-6 lg:p-7 text-white flex flex-col" style="background: linear-gradient(145deg, #26262e, #0a0a0a 80%)">
        <p class="text-[11px] font-bold tracking-[0.16em] uppercase text-[#E6FF3A]">Getting started</p>
        <h2 class="font-satoshi font-black text-xl lg:text-2xl tracking-[-0.03em] mt-1.5">Three steps to your first release</h2>
        <div class="grid sm:grid-cols-3 gap-3 mt-5 flex-1">
          <button
            v-for="(step, i) in onboardingSteps"
            :key="step.label"
            @click="step.go()"
            class="text-left rounded-xl bg-white/[0.07] hover:bg-white/[0.14] p-4 transition-colors flex flex-col justify-between group"
          >
            <span class="w-7 h-7 rounded-full bg-[#E6FF3A] text-[#0a0a0a] text-sm font-black flex items-center justify-center">{{ i + 1 }}</span>
            <span>
              <span class="block text-sm font-bold leading-snug mt-4">{{ step.label }}</span>
              <span class="block text-xs text-white/50 leading-snug mt-1">{{ step.blurb }}</span>
              <span class="inline-flex items-center gap-1 text-xs font-semibold text-[#E6FF3A] mt-3 group-hover:gap-2 transition-all">
                {{ step.cta }}
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </span>
            </span>
          </button>
        </div>
      </div>

      <!-- 2x2 core stats snapshot (brand palette: lime signature + ink + purple) -->
      <div v-else class="sm:col-span-1 lg:col-span-2 grid grid-cols-2 gap-4">
        <!-- Lime signature card: THE number -->
        <button @click="emit('navigate', 'analytics')" class="text-left rounded-2xl p-5 relative overflow-hidden hover:scale-[1.02] hover:shadow-lg transition-all duration-200 bg-[#E6FF3A] text-[#0a0a0a]">
          <span class="absolute top-4 right-4 w-12 h-12 rounded-xl bg-[#0a0a0a] flex items-center justify-center">
            <img src="/img/equalizer-icon.svg" alt="" class="w-7 h-7" />
          </span>
          <p class="text-xs text-[#0a0a0a]/60 mb-1">Streams This Week</p>
          <p class="text-2xl font-black font-satoshi tracking-[-0.02em] mb-2 tabular-nums">{{ streamsCount.toLocaleString('en-GB') }}</p>
          <p class="text-xs text-[#0a0a0a]/55">All stores, 14–20 Apr</p>
        </button>
        <!-- Ink card with artwork -->
        <button @click="emit('navigate', 'analytics')" class="text-left rounded-2xl p-5 text-white relative overflow-hidden hover:scale-[1.02] hover:shadow-lg transition-all duration-200" style="background: linear-gradient(145deg, #26262e, #0a0a0a 80%)">
          <span class="absolute top-4 right-4 w-12 h-12 rounded-xl overflow-hidden">
            <img src="https://prod-ditto-music-release-content.s3.eu-west-2.amazonaws.com/05301321/artwork/transforms/p1680529-edit-edit-edit-69c138b3ab4dd252257380-small.jpg" alt="Solar" class="w-full h-full object-cover" />
          </span>
          <p class="text-xs text-white/60 mb-1">Most Streamed Track</p>
          <p class="text-2xl font-black font-satoshi tracking-[-0.02em] mb-2">Solar</p>
          <p class="text-xs text-white/45">All stores • 440,333 streams</p>
        </button>
        <!-- Electric purple card -->
        <button @click="emit('navigate', 'analytics')" class="text-left rounded-2xl p-5 text-white relative overflow-hidden hover:scale-[1.02] hover:shadow-lg transition-all duration-200" style="background: linear-gradient(145deg, #6d28ff, #4A00FF 85%)">
          <span class="absolute top-4 right-4 w-12 h-12 rounded-xl bg-white/12 backdrop-blur-sm flex items-center justify-center">
            <img src="/img/spotify-icon.svg" alt="Spotify" class="w-7 h-7" />
          </span>
          <p class="text-xs text-white/65 mb-1">Best Playlist</p>
          <p class="text-2xl font-black font-satoshi tracking-[-0.02em] mb-2">Mix</p>
          <p class="text-xs text-white/50">Spotify • 60,766 streams</p>
        </button>
        <!-- Ink navy card -->
        <button @click="emit('navigate', 'analytics')" class="text-left rounded-2xl p-5 text-white relative overflow-hidden hover:scale-[1.02] hover:shadow-lg transition-all duration-200" style="background: linear-gradient(145deg, #1c2f56, #101f3c 80%)">
          <span class="absolute top-4 right-4 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <img src="/img/spotify-icon.svg" alt="Spotify" class="w-7 h-7" />
          </span>
          <p class="text-xs text-white/60 mb-1">Best Platform</p>
          <p class="text-2xl font-black font-satoshi tracking-[-0.02em] mb-2">Spotify</p>
          <p class="text-xs text-white/45">1,089,741 streams</p>
        </button>
      </div>
    </div>

    <!-- ── Your releases ── -->
    <section class="mb-14">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl lg:text-3xl text-ditto-text">Your releases</h2>
        <div v-if="!isNewUser" class="flex items-center gap-3">
          <button @click="emit('navigate', 'music')" class="text-sm font-medium text-ditto-purple hover:opacity-80 transition-opacity mr-2">View all →</button>
          <button @click="scrollRail(releaseRail, -1)" class="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-ditto-text hover:bg-ditto-light-grey transition-colors" aria-label="Scroll releases back">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button @click="scrollRail(releaseRail, 1)" class="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-ditto-text hover:bg-ditto-light-grey transition-colors" aria-label="Scroll releases forward">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
      <!-- New user: empty frame + ghost slots -->
      <div v-if="isNewUser" class="flex gap-5 overflow-x-hidden pb-4 pt-1">
        <button
          @click="emit('navigate', 'music-builder')"
          class="flex-shrink-0 w-52 sm:w-56 aspect-square rounded-2xl bg-white shadow-[0_2px_14px_rgba(16,31,60,0.08)] hover:shadow-[0_12px_32px_rgba(95,31,255,0.18)] hover:-translate-y-1 flex flex-col items-center justify-center gap-4 transition-all duration-200 group"
        >
          <img src="/img/suite/distro.svg" alt="" class="w-12 h-12 group-hover:scale-105 transition-transform" />
          <span class="text-center">
            <span class="block text-sm font-bold text-ditto-text">New release</span>
            <span class="block text-xs text-ditto-subtext mt-1">Upload audio &amp; artwork</span>
          </span>
        </button>
        <div v-for="n in 4" :key="'ghost-rel-' + n" class="flex-shrink-0 w-52 sm:w-56 aspect-square rounded-2xl bg-ditto-light-grey" :style="{ opacity: 1 - n * 0.2 }"></div>
      </div>

      <!-- -mt-3/pt-3: overflow-x forces overflow-y, so the hover lift and shadow
           need headroom inside the clip box (the negative margin keeps spacing) -->
      <div v-else ref="releaseRail" class="flex gap-5 overflow-x-auto scrollbar-hide snap-x scroll-smooth -mt-3 pt-3 pb-4 -mx-4 px-4 scroll-px-4 sm:-mx-6 sm:px-6 sm:scroll-px-6 lg:-mx-16 lg:px-16 lg:scroll-px-16">
        <button
          v-for="release in homeReleases"
          :key="release.title + release.year"
          @click="emit('navigate', 'music')"
          class="snap-start flex-shrink-0 w-52 sm:w-56 text-left group transition-transform duration-300 hover:-translate-y-1.5"
        >
          <span class="relative block rounded-2xl overflow-hidden clip-radius-stable shadow-sm group-hover:shadow-xl transition-shadow duration-300">
            <img :src="release.artwork" :alt="release.title" class="w-full aspect-square object-cover group-hover:scale-[1.05] transition-transform duration-500" loading="lazy" />
            <span :class="['absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-sm', statusPillClass(release.status)]">{{ release.status }}</span>
          </span>
          <span class="block text-[15px] font-bold text-ditto-text truncate mt-3">{{ release.title }}</span>
          <span class="block text-[13px] text-ditto-subtext truncate mt-0.5">{{ release.type }} by <span class="text-ditto-purple">{{ release.artist }}</span> · {{ release.year }}</span>
        </button>

        <!-- Trailing create card -->
        <button
          @click="emit('navigate', 'music-builder')"
          class="snap-start flex-shrink-0 w-52 sm:w-56 aspect-square rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-3 text-ditto-subtext hover:border-ditto-purple hover:text-ditto-purple transition-colors"
        >
          <img src="/img/suite/distro.svg" alt="" class="w-12 h-12" />
          <span class="text-sm font-semibold">Start a release</span>
        </button>
      </div>
    </section>

    <!-- ── Your artists ── -->
    <section class="mb-12">
      <div class="flex items-baseline justify-between mb-5">
        <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl lg:text-3xl text-ditto-text">Your artists</h2>
        <button v-if="!isNewUser" @click="emit('navigate', 'artists')" class="text-sm font-medium text-ditto-purple hover:opacity-80 transition-opacity">Manage artists →</button>
      </div>
      <!-- New user: add-artist frame + ghost circles -->
      <div v-if="isNewUser" class="flex gap-6 overflow-x-hidden pb-2">
        <button
          @click="emit('navigate', 'artists')"
          class="flex-shrink-0 w-32 sm:w-36 aspect-square rounded-2xl bg-white shadow-[0_2px_14px_rgba(16,31,60,0.08)] hover:shadow-[0_12px_32px_rgba(95,31,255,0.18)] hover:-translate-y-1 flex flex-col items-center justify-center gap-3 transition-all duration-200 group mt-1"
        >
          <img src="/img/suite/add-artist.svg" alt="" class="h-12 w-auto group-hover:scale-105 transition-transform" />
          <span class="text-sm font-bold text-ditto-text">Add artist</span>
        </button>
        <div v-for="n in 5" :key="'ghost-art-' + n" class="flex-shrink-0 w-32 sm:w-36 flex flex-col items-center gap-3" :style="{ opacity: 1 - n * 0.18 }">
          <span class="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-ditto-light-grey"></span>
          <span class="w-16 h-2.5 rounded bg-ditto-light-grey"></span>
        </div>
      </div>
      <div v-else class="flex gap-6 overflow-x-auto scrollbar-hide snap-x -mt-3 pt-3 pb-3 -mx-4 px-4 scroll-px-4 sm:-mx-6 sm:px-6 sm:scroll-px-6 lg:-mx-16 lg:px-16 lg:scroll-px-16">
        <button
          v-for="artist in homeArtists"
          :key="artist.id"
          @click="emit('navigate', 'artists')"
          class="snap-start flex-shrink-0 w-32 sm:w-36 flex flex-col items-center gap-3 group transition-transform duration-300 hover:-translate-y-1"
        >
          <span class="block w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden clip-radius-stable ring-1 ring-gray-200 group-hover:ring-[3px] group-hover:ring-ditto-purple shadow-sm group-hover:shadow-lg transition-all">
            <img v-if="artist.avatar" :src="artist.avatar" :alt="artist.name" class="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500" loading="lazy" />
            <InitialsAvatar v-else :name="artist.name" text-class="text-3xl" />
          </span>
          <span class="text-sm font-semibold text-ditto-text text-center leading-tight w-full truncate">{{ artist.name }}</span>
        </button>
      </div>
    </section>

    <!-- ── Refer a Friend entry point ── -->
    <ReferShareStrip v-if="!isNewUser" @navigate="emit('navigate', $event)" />

    <!-- ── Explore Ditto (lower-tier areas, quiet row) ── -->
    <section class="mb-12">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl lg:text-3xl text-ditto-text mb-5">More from Ditto</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          v-for="tile in exploreTiles"
          :key="tile.id"
          @click="emit('navigate', tile.section)"
          class="flex flex-col items-center text-center gap-3 xl:flex-row xl:items-center xl:text-left xl:gap-4 rounded-2xl bg-white p-5 shadow-[0_2px_14px_rgba(16,31,60,0.08)] hover:shadow-[0_10px_28px_rgba(16,31,60,0.14)] hover:-translate-y-0.5 transition-all duration-200"
        >
          <img :src="tile.icon" alt="" class="w-14 h-14 object-contain flex-shrink-0" />
          <span class="min-w-0">
            <span class="block text-sm font-bold text-ditto-text leading-tight">{{ tile.label }}</span>
            <span class="block text-xs text-ditto-subtext mt-1 leading-snug">{{ tile.blurb }}</span>
          </span>
        </button>
      </div>
    </section>

    <!-- ── Guides & tutorials (Ditto blog) ── -->
    <section ref="guidesSection" class="mb-8 scroll-mt-6">
      <div class="flex items-baseline justify-between mb-5">
        <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl lg:text-3xl text-ditto-text">Guides &amp; tutorials</h2>
        <a href="https://dittomusic.com/en/blog" target="_blank" rel="noopener" class="text-sm font-medium text-ditto-purple hover:opacity-80 transition-opacity">Visit the blog ↗</a>
      </div>
      <div class="flex gap-4 overflow-x-auto scrollbar-hide snap-x pb-2 -mx-4 px-4 scroll-px-4 sm:-mx-6 sm:px-6 sm:scroll-px-6 lg:-mx-16 lg:px-16 lg:scroll-px-16">
        <a
          v-for="guide in homeGuides"
          :key="guide.url"
          :href="guide.url"
          target="_blank"
          rel="noopener"
          class="snap-start flex-shrink-0 w-64 group"
        >
          <span class="block rounded-2xl overflow-hidden">
            <img :src="guide.image" :alt="guide.title" class="w-full aspect-[16/10] object-cover group-hover:scale-[1.03] transition-transform duration-300" loading="lazy" />
          </span>
          <span class="block text-[11px] font-bold tracking-[0.14em] uppercase text-ditto-purple mt-3">{{ guide.category }}</span>
          <span class="block text-sm font-semibold text-ditto-text leading-snug mt-1">{{ guide.title }}</span>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { releaseCatalog } from '../../data/releaseDetailMockData'
import { artists } from '../../data/artistsMockData'
import { homeGuides, exploreTiles } from '../../data/homeMockData'
import { useDemoUser } from '../../composables/useDemoUser'
import { useCountUp } from '../../composables/useCountUp'
import InitialsAvatar from '../../components/common/InitialsAvatar.vue'
import GlobalSearch from '../../components/layout/GlobalSearch.vue'
import ReferShareStrip from '../../components/refer/ReferShareStrip.vue'

const emit = defineEmits<{
  (e: 'navigate', section: string): void
}>()

const { isNewUser } = useDemoUser()

// Headline figures rack up on arrival (pence stay put — see useCountUp)
const balanceCount = useCountUp(24318)
const streamsCount = useCountUp(1696508, { duration: 850 })

// New-user onboarding: three concrete first moves
const guidesSection = ref<HTMLElement | null>(null)
const onboardingSteps = [
  { label: 'Upload your first release', blurb: 'Audio, artwork and stores in one guided flow.', cta: 'Start now', go: () => emit('navigate', 'music-builder') },
  { label: 'Set up your artist profile', blurb: 'Connect your Spotify & Apple Music IDs.', cta: 'Add artist', go: () => emit('navigate', 'artists') },
  { label: 'Learn the ropes', blurb: 'Guides on royalties, promo and releasing.', cta: 'Browse guides', go: () => guidesSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
]

// Live releases first, deduped by title, capped for the slider
const homeReleases = computed(() => {
  const seen = new Set<string>()
  return releaseCatalog
    .filter(r => {
      if (seen.has(r.title)) return false
      seen.add(r.title)
      return true
    })
    .sort((a, b) => (a.status === 'Live' ? 0 : 1) - (b.status === 'Live' ? 0 : 1))
    .slice(0, 14)
})

// Lead the rail with artists who have a photo — initials tiles trail behind
const homeArtists = computed(() =>
  [...artists].sort((a, b) => Number(Boolean(b.avatar)) - Number(Boolean(a.avatar))).slice(0, 10)
)

// Arrow-button scrolling for the release rail
const releaseRail = ref<HTMLElement | null>(null)
const scrollRail = (rail: HTMLElement | null, direction: 1 | -1) => {
  if (!rail) return
  rail.scrollBy({ left: direction * Math.round(rail.clientWidth * 0.8), behavior: 'smooth' })
}

const statusPillClass = (status: string) => {
  if (status === 'Live') return 'bg-[#00e785]/90 text-[#00331d]'
  if (status === 'Takedown') return 'bg-[#ee404c]/90 text-white'
  return 'bg-white/80 text-ditto-text'
}
</script>

<style scoped>
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.animate-gradient-shift {
  animation: gradient-shift 3s ease infinite;
}
</style>
