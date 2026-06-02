<template>
  <div>
    <!-- Header: Title + Complete Button -->
    <div class="flex items-start justify-between mb-6">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl lg:text-3xl text-ditto-text">Review Your Release</h2>
      <button
        @click="$emit('complete')"
        :disabled="errorStages.length > 0"
        :class="[
          'px-6 py-2.5 text-sm font-medium rounded-full transition-all flex-shrink-0',
          errorStages.length === 0
            ? 'bg-ditto-purple text-white hover:bg-ditto-purple/90'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        ]"
      >Complete Release</button>
    </div>

    <!-- Error Banner -->
    <div v-if="errorStages.length > 0" class="mb-6 py-3 px-5 rounded-lg bg-warning/10 border border-warning/20">
      <p class="text-sm text-warning">
        A few things need fixing in
        <template v-for="(stage, i) in errorStages" :key="stage.index">
          <button @click="$emit('goToStep', stage.index)" class="font-medium underline hover:no-underline">
            Step {{ stage.index + 1 }}</button><template v-if="i < errorStages.length - 1">, </template>
        </template>
        before you can submit.
      </p>
    </div>

    <!-- Summary Card -->
    <div class="rounded-2xl border border-gray-200 overflow-hidden mb-4">
      <!-- Main: Thumbnail left + Metadata right -->
      <div class="flex flex-col sm:flex-row p-6 gap-6">
        <!-- Thumbnail -->
        <div class="w-full sm:w-56 flex-shrink-0">
          <div class="aspect-video rounded-xl bg-gray-900 overflow-hidden flex items-center justify-center">
            <div v-if="!formData.thumbnailFile" class="text-center p-4">
              <svg class="w-10 h-10 text-white/30 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="10,8 16,12 10,16"/>
              </svg>
              <p class="text-xs text-white/40">No thumbnail</p>
            </div>
            <div v-else class="w-full h-full bg-gradient-to-br from-ditto-purple/20 to-ditto-purple/5 flex items-center justify-center">
              <svg class="w-10 h-10 text-ditto-purple/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
              </svg>
            </div>
          </div>
          <!-- File info under thumbnail -->
          <div class="mt-2 space-y-1">
            <div class="flex items-center gap-1.5">
              <svg class="w-3 h-3 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23,7 16,12 23,17"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              <p class="text-[10px] text-ditto-subtext truncate">{{ formData.videoFile?.name || 'No video uploaded' }}</p>
            </div>
            <div class="flex items-center gap-1.5">
              <svg class="w-3 h-3 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
              <p class="text-[10px] text-ditto-subtext truncate">{{ formData.thumbnailFile?.name || 'No thumbnail uploaded' }}</p>
            </div>
          </div>
        </div>

        <!-- Title + Metadata Grid -->
        <div class="flex-1 min-w-0">
          <h3 class="font-satoshi font-black tracking-[-0.03em] text-xl text-ditto-text mb-0.5">
            {{ formData.metadata.title || '[Untitled]' }}
          </h3>
          <p class="text-sm text-ditto-purple mb-4">
            {{ artistNames || '[No artists]' }}
          </p>

          <!-- Two-column metadata -->
          <div class="grid grid-cols-2 gap-x-8 gap-y-2.5">
            <div>
              <p class="text-xs text-ditto-subtext">Primary Genre:</p>
              <p class="text-sm text-ditto-text">{{ formData.metadata.primaryGenre || 'Not set' }}</p>
            </div>
            <div>
              <p class="text-xs text-ditto-subtext">Price Band:</p>
              <p class="text-sm text-ditto-text capitalize">{{ formData.stores.priceBand }}</p>
            </div>
            <div>
              <p class="text-xs text-ditto-subtext">Secondary Genre:</p>
              <p class="text-sm text-ditto-text">{{ formData.metadata.secondaryGenre || 'None' }}</p>
            </div>
            <div>
              <p class="text-xs text-ditto-subtext flex items-center gap-1">
                Release Date:
                <svg v-if="!formData.schedule.releaseDate" class="w-3 h-3 text-warning" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              </p>
              <p class="text-sm text-ditto-text">
                {{ formData.schedule.releaseDate ? formatDate(formData.schedule.releaseDate) : 'Not set' }}
              </p>
            </div>
            <div>
              <p class="text-xs text-ditto-subtext">Various Artists:</p>
              <p class="text-sm text-ditto-text">{{ formData.metadata.artistType === 'compilation' ? 'Yes' : 'No' }}</p>
            </div>
            <div>
              <p class="text-xs text-ditto-subtext">Language:</p>
              <p class="text-sm text-ditto-text">{{ formData.metadata.language }}</p>
            </div>
            <div>
              <p class="text-xs text-ditto-subtext">Distribution:</p>
              <p class="text-sm text-ditto-text">
                {{ formData.schedule.distributionType === 'priority' ? 'Priority (+$40)' : formData.schedule.distributionType === 'standard' ? 'Standard' : 'Not set' }}
              </p>
            </div>
            <div>
              <p class="text-xs text-ditto-subtext flex items-center gap-1">
                Copyright:
                <svg v-if="!formData.metadata.copyrightHolder" class="w-3 h-3 text-warning" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              </p>
              <p class="text-sm text-ditto-text">{{ formData.metadata.copyrightHolder ? `${formData.metadata.copyrightHolder} (${formData.metadata.copyrightYear})` : 'Not set' }}</p>
            </div>
            <div>
              <p class="text-xs text-ditto-subtext">Timed Release:</p>
              <p class="text-sm text-ditto-text">
                {{ formData.schedule.timedRelease ? formData.schedule.releaseTime : 'No' }}
              </p>
            </div>
            <div>
              <p class="text-xs text-ditto-subtext flex items-center gap-1">
                Production:
                <svg v-if="!formData.metadata.pCopyrightHolder" class="w-3 h-3 text-warning" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              </p>
              <p class="text-sm text-ditto-text">{{ formData.metadata.pCopyrightHolder ? `${formData.metadata.pCopyrightHolder} (${formData.metadata.productionYear})` : 'Not set' }}</p>
            </div>
            <div>
              <p class="text-xs text-ditto-subtext">Label:</p>
              <p class="text-sm text-ditto-text">{{ formData.metadata.recordLabel }}</p>
            </div>
            <div>
              <p class="text-xs text-ditto-subtext">ISRC:</p>
              <p class="text-sm text-ditto-text">{{ formData.metadata.isrc || 'Auto-assign' }}</p>
            </div>
            <div>
              <p class="text-xs text-ditto-subtext">Video Type:</p>
              <p class="text-sm text-ditto-text">{{ formData.metadata.videoType === 'live' ? 'Live Performance' : 'Official Video' }}{{ formData.metadata.isLyricVideo ? ' (Lyric)' : '' }}</p>
            </div>
            <div v-if="formData.schedule.hasOriginalDate && formData.schedule.originalReleaseDate">
              <p class="text-xs text-ditto-subtext">Original Release:</p>
              <p class="text-sm text-ditto-text">{{ formatDate(formData.schedule.originalReleaseDate) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Flags -->
      <div class="border-t border-gray-200 px-6 py-3">
        <div class="flex flex-wrap gap-2">
          <span v-if="formData.metadata.isExplicit" class="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-error/10 text-error border border-error/20">Explicit</span>
          <span v-if="formData.metadata.is18Plus" class="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-warning/10 text-warning border border-warning/20">18+</span>
          <span v-if="formData.metadata.isLyricVideo" class="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-info/10 text-info border border-info/20">Lyric Video</span>
          <span v-if="formData.metadata.aiTransparency" class="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-ditto-purple/10 text-ditto-purple border border-ditto-purple/20">AI Content</span>
          <span v-if="formData.metadata.artistType === 'compilation'" class="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-ditto-light-grey text-ditto-subtext border border-gray-200">Compilation</span>
          <span v-if="formData.assetSource.type" class="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-ditto-light-grey text-ditto-subtext border border-gray-200">{{ assetSourceLabel }}</span>
          <span v-if="!formData.metadata.isExplicit && !formData.metadata.is18Plus && !formData.metadata.isLyricVideo && !formData.metadata.aiTransparency && formData.metadata.artistType !== 'compilation' && !formData.assetSource.type" class="text-xs text-ditto-subtext">No content flags set</span>
        </div>
      </div>

      <!-- Stores -->
      <div class="border-t border-gray-200 px-6 py-4">
        <p class="text-xs font-medium text-ditto-subtext uppercase tracking-wide mb-2">Selected Stores</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="storeId in formData.stores.selected"
            :key="storeId"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-ditto-light-grey text-ditto-text"
          >
            <img :src="getStoreLogo(storeId)" :alt="getStoreName(storeId)" class="w-4 h-4 object-contain" />
            {{ getStoreName(storeId) }}
          </span>
          <span v-if="formData.stores.selected.length === 0" class="text-xs text-warning">No stores selected</span>
        </div>

        <!-- Linked Spotify Release -->
        <div v-if="linkedSpotifyRelease" class="mt-3 flex items-center gap-2 p-2 rounded-lg bg-ditto-light-grey">
          <img :src="linkedSpotifyRelease.artwork" :alt="linkedSpotifyRelease.title" class="w-8 h-8 rounded object-cover" />
          <div class="min-w-0">
            <p class="text-xs font-medium text-ditto-text truncate">Linked: {{ linkedSpotifyRelease.title }} &mdash; {{ linkedSpotifyTrackTitle }}</p>
            <p class="text-[10px] text-ditto-subtext">{{ linkedSpotifyRelease.artist }} (Spotify)</p>
          </div>
        </div>

        <!-- Country Restrictions -->
        <div v-if="formData.schedule.countryRestrictions && formData.schedule.restrictedCountries.length > 0" class="mt-3">
          <p class="text-[10px] text-ditto-subtext mb-1">Restricted in:</p>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="country in formData.schedule.restrictedCountries"
              :key="country"
              class="px-2 py-0.5 rounded text-[10px] bg-error/10 text-error"
            >{{ country }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- VEVO Channel Card -->
    <div v-if="formData.stores.selected.includes('vevo')" class="rounded-2xl border border-gray-200 overflow-hidden mb-4">
      <div class="px-6 py-4 bg-ditto-light-grey/50 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img src="/img/vevo-icon.svg" alt="VEVO" class="w-5 h-5 object-contain" />
          <p class="text-sm font-semibold text-ditto-text">VEVO Channel</p>
        </div>
        <button @click="$emit('goToStep', 2)" class="text-xs text-ditto-purple hover:underline">Edit</button>
      </div>
      <div class="px-6 py-4">
        <div class="grid grid-cols-2 gap-x-8 gap-y-2.5">
          <div>
            <p class="text-xs text-ditto-subtext">Channel Status:</p>
            <p class="text-sm text-ditto-text">{{ formData.stores.vevoHasChannel === true ? 'Linking existing' : formData.stores.vevoHasChannel === false ? 'Creating new' : 'Not configured' }}</p>
          </div>
          <div>
            <p class="text-xs text-ditto-subtext">Channel Name:</p>
            <p class="text-sm text-ditto-text">{{ vevoChannelDisplayName }}</p>
          </div>
          <div>
            <p class="text-xs text-ditto-subtext">Artist Name:</p>
            <p class="text-sm text-ditto-text">{{ formData.stores.vevoArtistName || 'Not set' }}</p>
          </div>
          <div>
            <p class="text-xs text-ditto-subtext">Biography:</p>
            <p class="text-sm text-ditto-text">{{ formData.stores.vevoBiography ? 'Provided' : 'Not set' }}</p>
          </div>
          <div>
            <p class="text-xs text-ditto-subtext">Artist Image:</p>
            <p class="text-sm" :class="formData.stores.vevoArtistImage ? 'text-success' : 'text-ditto-subtext'">
              {{ formData.stores.vevoArtistImage ? formData.stores.vevoArtistImage.name : 'Not uploaded' }}
            </p>
          </div>
          <div>
            <p class="text-xs text-ditto-subtext">YouTube Banner:</p>
            <p class="text-sm" :class="formData.stores.vevoBanner ? 'text-success' : 'text-ditto-subtext'">
              {{ formData.stores.vevoBanner ? formData.stores.vevoBanner.name : 'Not uploaded' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Credits Card -->
    <div class="rounded-2xl border border-gray-200 overflow-hidden mb-4">
      <div class="px-6 py-4 bg-ditto-light-grey/50 border-b border-gray-200 flex items-center justify-between">
        <p class="text-sm font-semibold text-ditto-text">Credits</p>
        <button @click="$emit('goToStep', 1)" class="text-xs text-ditto-purple hover:underline">Edit</button>
      </div>
      <div class="px-6 py-4">
        <div v-if="filledCredits.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div
            v-for="credit in filledCredits"
            :key="credit.id"
            class="flex items-center justify-between py-1.5"
          >
            <p class="text-sm text-ditto-text">{{ credit.name }}</p>
            <span class="text-xs text-ditto-subtext bg-ditto-light-grey px-2 py-0.5 rounded">{{ credit.role }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-ditto-subtext">No credits filled in yet.</p>
      </div>
    </div>

    <!-- Artists Card -->
    <div class="rounded-2xl border border-gray-200 overflow-hidden mb-6">
      <div class="px-6 py-4 bg-ditto-light-grey/50 border-b border-gray-200 flex items-center justify-between">
        <p class="text-sm font-semibold text-ditto-text">Artists</p>
        <button @click="$emit('goToStep', 1)" class="text-xs text-ditto-purple hover:underline">Edit</button>
      </div>
      <div class="px-6 py-4 space-y-3">
        <!-- Primary -->
        <div>
          <p class="text-xs font-medium text-ditto-subtext uppercase tracking-wide mb-1.5">Primary</p>
          <div v-if="formData.artists.primary.length > 0" class="flex flex-wrap gap-2">
            <span v-for="a in formData.artists.primary" :key="a.id" class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ditto-purple/10 text-xs font-medium text-ditto-text">
              <span class="w-5 h-5 rounded-full bg-ditto-purple flex items-center justify-center text-[8px] font-bold text-white">{{ a.initials }}</span>
              {{ a.name }}
            </span>
          </div>
          <p v-else class="text-xs text-warning">No primary artists added</p>
        </div>
        <!-- Featured -->
        <div v-if="formData.artists.featured.length > 0">
          <p class="text-xs font-medium text-ditto-subtext uppercase tracking-wide mb-1.5">Featured</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="a in formData.artists.featured" :key="a.id" class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-info/10 text-xs font-medium text-ditto-text">
              <span class="w-5 h-5 rounded-full bg-info flex items-center justify-center text-[8px] font-bold text-white">{{ a.initials }}</span>
              {{ a.name }}
            </span>
          </div>
        </div>
        <!-- Remixer -->
        <div v-if="formData.artists.remixer.length > 0">
          <p class="text-xs font-medium text-ditto-subtext uppercase tracking-wide mb-1.5">Remixer</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="a in formData.artists.remixer" :key="a.id" class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning/10 text-xs font-medium text-ditto-text">
              <span class="w-5 h-5 rounded-full bg-warning flex items-center justify-center text-[8px] font-bold text-white">{{ a.initials }}</span>
              {{ a.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Extras Card -->
    <div class="rounded-2xl border border-gray-200 overflow-hidden mb-6">
      <div class="px-6 py-4 bg-ditto-light-grey/50 border-b border-gray-200 flex items-center justify-between">
        <p class="text-sm font-semibold text-ditto-text">Extras</p>
        <button @click="$emit('goToStep', 3)" class="text-xs text-ditto-purple hover:underline">Edit</button>
      </div>
      <div class="px-6 py-4 space-y-3">
        <!-- Priority Distribution -->
        <div class="flex items-center justify-between py-1.5">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-ditto-purple flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z"/>
            </svg>
            <p class="text-sm text-ditto-text">Priority Distribution</p>
          </div>
          <span :class="[
            'text-xs font-medium px-2.5 py-1 rounded-full',
            formData.schedule.distributionType === 'priority'
              ? 'bg-ditto-purple/10 text-ditto-purple'
              : 'bg-ditto-light-grey text-ditto-subtext'
          ]">
            {{ formData.schedule.distributionType === 'priority' ? '+$40' : 'Not selected' }}
          </span>
        </div>

        <!-- Timed Release -->
        <div class="flex items-center justify-between py-1.5 border-t border-gray-100">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-ditto-subtext flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
            </svg>
            <p class="text-sm text-ditto-text">Timed Release</p>
          </div>
          <span class="text-xs font-medium text-ditto-subtext bg-ditto-light-grey px-2.5 py-1 rounded-full">
            {{ formData.schedule.timedRelease ? formData.schedule.releaseTime : 'Off' }}
          </span>
        </div>

        <!-- Country Restrictions -->
        <div class="flex items-center justify-between py-1.5 border-t border-gray-100">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-ditto-subtext flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
            </svg>
            <p class="text-sm text-ditto-text">Country Restrictions</p>
          </div>
          <span class="text-xs font-medium text-ditto-subtext bg-ditto-light-grey px-2.5 py-1 rounded-full">
            {{ formData.schedule.countryRestrictions && formData.schedule.restrictedCountries.length > 0 ? formData.schedule.restrictedCountries.length + ' countries' : 'None' }}
          </span>
        </div>

        <!-- Original Release Date -->
        <div class="flex items-center justify-between py-1.5 border-t border-gray-100">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-ditto-subtext flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <p class="text-sm text-ditto-text">Re-release (Original Date)</p>
          </div>
          <span class="text-xs font-medium text-ditto-subtext bg-ditto-light-grey px-2.5 py-1 rounded-full">
            {{ formData.schedule.hasOriginalDate && formData.schedule.originalReleaseDate ? formatDate(formData.schedule.originalReleaseDate) : 'No' }}
          </span>
        </div>

        <!-- Charts Registration -->
        <div class="flex items-center justify-between py-1.5 border-t border-gray-100">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-ditto-subtext flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 20V10M12 20V4M6 20v-6"/>
            </svg>
            <p class="text-sm text-ditto-text">Charts Registration</p>
          </div>
          <span class="text-xs font-medium text-ditto-subtext bg-ditto-light-grey px-2.5 py-1 rounded-full">N/A</span>
        </div>

        <!-- YouTube Content ID -->
        <div class="flex items-center justify-between py-1.5 border-t border-gray-100">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-ditto-subtext flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <p class="text-sm text-ditto-text">YouTube Content ID &amp; Shorts</p>
          </div>
          <span class="text-xs font-medium text-ditto-subtext bg-ditto-light-grey px-2.5 py-1 rounded-full">N/A</span>
        </div>

        <!-- Auto-release -->
        <div class="flex items-center justify-between py-1.5 border-t border-gray-100">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-ditto-subtext flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="17,1 21,5 17,9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7,23 3,19 7,15"/><path d="M21 13v2a4 4 0 01-4 4H3"/>
            </svg>
            <p class="text-sm text-ditto-text">Auto-release to new platforms</p>
          </div>
          <span class="text-xs font-medium text-ditto-subtext bg-ditto-light-grey px-2.5 py-1 rounded-full">N/A</span>
        </div>
      </div>
    </div>

    <!-- Bottom Complete button -->
    <div class="flex justify-center mt-6">
      <button
        @click="$emit('complete')"
        :disabled="errorStages.length > 0"
        :class="[
          'px-10 py-3 text-sm font-medium rounded-full transition-all',
          errorStages.length === 0
            ? 'bg-ditto-purple text-white hover:bg-ditto-purple/90'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        ]"
      >Complete Release</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { videoStores, spotifyMusicReleases } from '../../../data/videoMockData'

interface FormData {
  videoFile: File | null
  thumbnailFile: File | null
  contentChecks: Record<string, boolean>
  assetSource: {
    type: '' | 'original' | 'licensed' | 'previously-distributed' | 'commissioned'
    ownershipConfirmed: boolean
    licenseHolder: string
    licenseType: '' | 'exclusive' | 'non-exclusive'
    licenseValidUntil: string
    licenseTerritory: 'global' | 'selected'
    licenseReference: string
    licenseConfirmed: boolean
    previousDistributor: string
    takedownConfirmed: boolean
    commissionedBy: string
    commissionAgreement: boolean
  }
  metadata: {
    title: string
    copyrightHolder: string
    copyrightYear: number
    pCopyrightHolder: string
    productionYear: number
    recordLabel: string
    primaryGenre: string
    secondaryGenre: string
    language: string
    isrc: string
    artistType: 'artist' | 'compilation'
    isLyricVideo: boolean
    isExplicit: boolean
    is18Plus: boolean
    videoType: 'official' | 'live'
    description: string
    aiTransparency: boolean
  }
  artists: {
    primary: { id: string; name: string; initials: string }[]
    featured: { id: string; name: string; initials: string }[]
    remixer: { id: string; name: string; initials: string }[]
    showFeatured: boolean
    showRemixer: boolean
  }
  credits: { id: string; category: string; name: string; role: string }[]
  schedule: {
    releaseDate: Date | null
    distributionType: '' | 'priority' | 'standard'
    timedRelease: boolean
    releaseTime: string
    countryRestrictions: boolean
    restrictedCountries: string[]
    hasOriginalDate: boolean
    originalReleaseDate: Date | null
  }
  stores: {
    selected: string[]
    vevoHasChannel: boolean | null
    vevoChannelName: string
    vevoArtistName: string
    vevoBiography: string
    vevoArtistImage: File | null
    vevoBanner: File | null
    priceBand: 'budget' | 'mid' | 'premium'
    spotifyReleaseId: string | null
    spotifyTrackId: string | null
  }
}

const props = defineProps<{
  formData: FormData
  stepErrors: boolean[]
}>()

defineEmits<{
  (e: 'goToStep', index: number): void
  (e: 'complete'): void
}>()

const stepNames = ['Upload', 'Details', 'Stores', 'Schedule', 'Content Check', 'Review']

const assetSourceLabel = computed(() => {
  const labels: Record<string, string> = {
    'original': 'Original',
    'licensed': 'Licensed',
    'previously-distributed': 'Re-distributed',
    'commissioned': 'Commissioned',
  }
  return labels[props.formData.assetSource.type] || ''
})

const artistNames = computed(() => {
  const all = [
    ...props.formData.artists.primary.map(a => a.name),
    ...props.formData.artists.featured.map(a => a.name),
  ]
  return all.join(', ')
})

const filledCredits = computed(() => {
  return props.formData.credits.filter(c => c.name.trim())
})

const vevoChannelDisplayName = computed(() => {
  if (props.formData.stores.vevoHasChannel === true) {
    return props.formData.stores.vevoChannelName || 'Not entered'
  }
  if (props.formData.stores.vevoHasChannel === false) {
    return props.formData.stores.vevoArtistName
      ? props.formData.stores.vevoArtistName.replace(/\s+/g, '') + 'VEVO'
      : 'Will be auto-generated'
  }
  return 'Not configured'
})

const errorStages = computed(() => {
  const errors: { index: number; name: string; message: string }[] = []

  if (!props.formData.videoFile || !props.formData.thumbnailFile) {
    const issues = []
    if (!props.formData.videoFile) issues.push('video not uploaded')
    if (!props.formData.thumbnailFile) issues.push('thumbnail not uploaded')
    errors.push({ index: 0, name: stepNames[0], message: issues.join(', ') })
  }

  const metaIssues = []
  if (!props.formData.metadata.title) metaIssues.push('title missing')
  if (props.formData.metadata.copyrightHolder.length < 2) metaIssues.push('copyright holder not set')
  if (props.formData.metadata.pCopyrightHolder.length < 2) metaIssues.push('production copyright not set')
  if (!props.formData.metadata.primaryGenre) metaIssues.push('primary genre not selected')
  if (props.formData.artists.primary.length === 0) metaIssues.push('no primary artists')
  if (props.formData.credits.slice(0, 4).some(c => !c.name.trim() || (c.category !== 'composer' && !c.role))) metaIssues.push('required credits incomplete')
  if (metaIssues.length > 0) {
    errors.push({ index: 1, name: stepNames[1], message: metaIssues.join(', ') })
  }

  if (props.formData.stores.selected.length === 0) {
    errors.push({ index: 2, name: stepNames[2], message: 'no stores selected' })
  }

  if (!props.formData.schedule.releaseDate || !props.formData.schedule.distributionType) {
    const issues = []
    if (!props.formData.schedule.releaseDate) issues.push('release date not set')
    if (!props.formData.schedule.distributionType) issues.push('distribution type not selected')
    errors.push({ index: 3, name: stepNames[3], message: issues.join(', ') })
  }

  if (!Object.values(props.formData.contentChecks).every(v => v) || !props.formData.assetSource.type) {
    const issues = []
    if (!Object.values(props.formData.contentChecks).every(v => v)) issues.push('content checklist not complete')
    if (!props.formData.assetSource.type) issues.push('video source not selected')
    errors.push({ index: 4, name: stepNames[4], message: issues.join(', ') })
  }

  return errors
})

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const getStoreName = (id: string) => {
  return videoStores.find(s => s.id === id)?.name || id
}

const getStoreLogo = (id: string) => {
  return videoStores.find(s => s.id === id)?.logo || ''
}

const linkedSpotifyRelease = computed(() => {
  if (!props.formData.stores.spotifyReleaseId) return null
  return spotifyMusicReleases.find(r => r.id === props.formData.stores.spotifyReleaseId) || null
})

const linkedSpotifyTrackTitle = computed(() => {
  if (!linkedSpotifyRelease.value || !props.formData.stores.spotifyTrackId) return ''
  return linkedSpotifyRelease.value.tracks.find(t => t.id === props.formData.stores.spotifyTrackId)?.title || ''
})
</script>
