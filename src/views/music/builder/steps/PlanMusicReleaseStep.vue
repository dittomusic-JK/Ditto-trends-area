<template>
  <div>
    <h1 class="font-satoshi font-black text-2xl lg:text-[32px] tracking-[-0.03em] text-ditto-text mb-10">Plan Your Release</h1>

    <!-- ── Release date card ── -->
    <div class="border border-gray-200 rounded-2xl p-7 lg:p-10 max-w-3xl">
      <h2 class="font-satoshi font-black text-xl lg:text-2xl tracking-[-0.03em] text-ditto-text mb-6">Choose a <span class="text-ditto-purple">release date</span></h2>

      <!-- Date input -->
      <div class="relative max-w-xs" ref="calendarWrap">
        <button
          @click="showCalendar = !showCalendar"
          :class="[
            'w-full flex items-center gap-2.5 border-0 border-b px-0 py-2.5 text-sm bg-transparent transition-colors focus:outline-none',
            form.releaseDate ? 'border-gray-300 hover:border-ditto-purple' : 'border-error'
          ]"
        >
          <svg class="w-4 h-4 flex-shrink-0" :class="form.releaseDate ? 'text-ditto-purple' : 'text-error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span :class="form.releaseDate ? 'text-ditto-text font-medium' : 'text-ditto-subtext'">{{ form.releaseDate ? formatDate(form.releaseDate) : 'Select date' }}</span>
          <svg class="w-3.5 h-3.5 text-ditto-subtext ml-auto transition-transform" :class="showCalendar ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>

        <!-- Calendar dropdown -->
        <div v-if="showCalendar" class="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-30">
          <div class="flex items-center justify-between mb-3">
            <button @click="prevMonth" class="w-7 h-7 flex items-center justify-center rounded-lg text-ditto-subtext hover:bg-ditto-light-grey transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <p class="text-sm font-bold text-ditto-text">{{ monthLabel }}</p>
            <button @click="nextMonth" class="w-7 h-7 flex items-center justify-center rounded-lg text-ditto-subtext hover:bg-ditto-light-grey transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
          <div class="grid grid-cols-7 gap-y-1 text-center text-xs">
            <span v-for="d in ['Mo','Tu','We','Th','Fr','Sa','Su']" :key="d" class="font-semibold text-ditto-subtext py-1">{{ d }}</span>
            <button
              v-for="cell in calendarCells"
              :key="cell.key"
              :disabled="cell.disabled || !cell.inMonth"
              @click="selectDate(cell.date)"
              :class="[
                'relative h-8 rounded-lg text-[13px] transition-colors',
                !cell.inMonth ? 'text-gray-300' :
                cell.disabled ? 'text-gray-300 cursor-not-allowed' :
                isSelected(cell.date) ? 'bg-ditto-purple text-white font-bold' :
                cell.isToday ? 'text-ditto-purple font-bold ring-1 ring-inset ring-ditto-purple/40' :
                'text-ditto-text hover:bg-ditto-light-grey'
              ]"
            >
              {{ cell.day }}
              <span v-if="cell.inMonth && !cell.disabled && cell.priorityOnly" class="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-warning"></span>
            </button>
          </div>
          <div class="mt-3 flex justify-end">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-warning/15 text-[#92400e] text-[11px] font-semibold">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
              Priority Distro Only
            </span>
          </div>
        </div>
      </div>
      <p v-if="!form.releaseDate" class="text-xs text-error mt-2">Release date is required.</p>

      <!-- Distro cards -->
      <div class="grid sm:grid-cols-2 gap-4 mt-7">
        <button
          @click="form.distributionType = 'priority'"
          :class="[
            'text-left rounded-2xl p-5 text-white relative overflow-hidden transition-shadow',
            form.distributionType === 'priority' ? 'ring-2 ring-ditto-purple ring-offset-2 shadow-lg' : 'hover:shadow-lg'
          ]"
          style="background: linear-gradient(135deg, #6d28ff 0%, #5f1fff 60%, #4a12d8 100%)"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="font-satoshi font-black text-lg tracking-[-0.02em]">Priority Distro</p>
              <p class="text-[11px] font-bold tracking-[0.14em] text-white/70 mt-0.5">LESS THAN 3 DAYS</p>
            </div>
            <svg class="w-6 h-6 text-[#E6FF3A]" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
          </div>
          <p class="text-[13px] text-white/85 leading-relaxed mt-3">Skip the queue to get your music out extra fast or give yourself more time to pitch for playlists.</p>
          <div class="flex items-center justify-between mt-4">
            <p class="font-satoshi font-black text-lg">+£40</p>
            <span :class="['w-6 h-6 rounded-full border-2 flex items-center justify-center', form.distributionType === 'priority' ? 'bg-white border-white' : 'border-white/70']">
              <svg v-if="form.distributionType === 'priority'" class="w-3.5 h-3.5 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
          </div>
        </button>

        <button
          @click="standardDisabled ? null : form.distributionType = 'standard'"
          :disabled="standardDisabled"
          :class="[
            'text-left rounded-2xl p-5 bg-ditto-light-grey transition-all relative',
            standardDisabled ? 'opacity-50 cursor-not-allowed' :
            form.distributionType === 'standard' ? 'ring-2 ring-ditto-purple ring-offset-2 shadow-lg' : 'hover:shadow-lg'
          ]"
        >
          <p class="font-satoshi font-black text-lg tracking-[-0.02em] text-ditto-text">Standard Distro</p>
          <p class="text-[11px] font-bold tracking-[0.14em] text-ditto-subtext mt-0.5">10 DAYS+</p>
          <p class="text-[13px] text-ditto-subtext leading-relaxed mt-3">We'll let you know when your music has been processed and sent to stores.</p>
          <div class="flex items-center justify-between mt-4">
            <p class="font-satoshi font-black text-lg text-ditto-text">Included</p>
            <span :class="['w-6 h-6 rounded-full border-2 flex items-center justify-center', form.distributionType === 'standard' ? 'bg-ditto-purple border-ditto-purple' : 'border-gray-300']">
              <svg v-if="form.distributionType === 'standard'" class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
          </div>
        </button>
      </div>
      <p v-if="standardDisabled" class="text-xs text-ditto-subtext mt-2">Your chosen date is less than 10 days away, so it needs Priority Distro.</p>

      <!-- Release time -->
      <div class="grid sm:grid-cols-2 gap-6 mt-8 items-start">
        <div>
          <p class="text-sm font-semibold text-ditto-text mb-3">Set a <span class="font-black">release time?</span> <span title="Release exactly at a chosen time in each timezone." class="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-ditto-purple/50 text-ditto-purple text-[9px] font-bold cursor-help">i</span></p>
          <div class="flex items-center gap-2">
            <button @click="form.timedRelease = false" :class="ynClass(!form.timedRelease)">No</button>
            <button @click="form.timedRelease = true" :class="ynClass(form.timedRelease)">Yes</button>
          </div>
        </div>
        <div :class="form.timedRelease ? '' : 'opacity-40 pointer-events-none'">
          <p class="text-sm font-semibold mb-3" :class="form.timedRelease ? 'text-ditto-text' : 'text-ditto-subtext'">Enter a <span class="font-black">release time</span></p>
          <div class="flex items-center gap-2">
            <select v-model="form.releaseTime.hour" class="builder-select w-20"><option value="" disabled></option><option v-for="hh in 24" :key="hh" :value="String(hh - 1).padStart(2, '0')">{{ String(hh - 1).padStart(2, '0') }}</option></select>
            <select v-model="form.releaseTime.minute" class="builder-select w-20"><option value="" disabled></option><option value="00">00</option><option value="15">15</option><option value="30">30</option><option value="45">45</option></select>
            <select v-model="form.releaseTime.zone" class="builder-select flex-1"><option value="" disabled></option><option>Local to each store</option><option>UTC</option><option>BST (UK)</option><option>EST (US)</option></select>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Country restrictions ── -->
    <div class="mt-12">
      <p class="text-lg font-semibold text-ditto-text mb-4">Would you like to add <span class="font-black">country restrictions</span> and limit the availability of your release?</p>
      <div class="flex items-center gap-2">
        <button @click="form.countryRestrictions = false" :class="ynClass(!form.countryRestrictions)">No</button>
        <button @click="form.countryRestrictions = true" :class="ynClass(form.countryRestrictions)">Yes</button>
      </div>
      <div v-if="form.countryRestrictions" class="mt-5 space-y-3">
        <p class="text-xs text-ditto-subtext">Your release will not be available in the selected countries.</p>
        <div class="flex flex-wrap items-center gap-2">
          <span
            v-for="country in form.restrictedCountries"
            :key="country"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-error/10 text-error"
          >
            {{ country }}
            <button @click="removeCountry(country)" class="hover:opacity-70" :aria-label="'Remove ' + country">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </span>
          <button
            @click="showCountryModal = true"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border border-gray-200 text-ditto-text hover:border-ditto-purple hover:text-ditto-purple transition-colors"
          >
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {{ form.restrictedCountries.length ? 'Edit countries' : 'Select countries' }}
          </button>
        </div>
      </div>
    </div>

    <CountryRestrictionsModal
      v-if="showCountryModal"
      :selected="form.restrictedCountries"
      @update:selected="form.restrictedCountries = $event"
      @close="showCountryModal = false"
    />

    <!-- ── Released before ── -->
    <div class="mt-12">
      <p class="text-lg font-semibold text-ditto-text mb-4">Has this been <span class="font-black">released before?</span></p>
      <div class="flex items-center gap-2">
        <button @click="form.releasedBefore = false" :class="ynClass(!form.releasedBefore)">No</button>
        <button @click="form.releasedBefore = true" :class="ynClass(form.releasedBefore)">Yes</button>
      </div>
      <div v-if="form.releasedBefore" class="mt-5 max-w-xs">
        <label class="block text-sm font-medium text-ditto-text mb-1.5">Enter the original release date</label>
        <input
          type="date"
          :value="originalDateValue"
          @input="setOriginalDate(($event.target as HTMLInputElement).value)"
          class="w-full px-0 py-2.5 border-0 border-b border-gray-300 text-sm text-ditto-text bg-transparent focus:outline-none focus:border-ditto-purple transition-colors"
        />
      </div>
    </div>

    <div class="border-t border-gray-200 mt-12"></div>

    <!-- ── Optional extras ── -->
    <div class="mt-10 grid lg:grid-cols-[minmax(0,1fr)_280px] gap-10 items-start">
      <div>
        <h2 class="font-satoshi font-black text-xl lg:text-2xl tracking-[-0.03em] text-ditto-text mb-5">Optional Extras</h2>
        <div class="border border-gray-200 rounded-2xl p-6 lg:p-7">
          <h3 class="text-base font-semibold text-ditto-text mb-5">Register this release for <span class="font-black">the official charts</span></h3>
          <div class="grid sm:grid-cols-2 gap-x-10 gap-y-4 max-w-lg">
            <label v-for="region in chartRegions" :key="region.id" class="flex items-center justify-between gap-3 cursor-pointer group">
              <span class="flex items-center gap-3">
                <span :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0', form.chartRegions.includes(region.id) ? 'border-ditto-purple bg-ditto-purple' : 'border-gray-300 group-hover:border-ditto-purple/50']">
                  <svg v-if="form.chartRegions.includes(region.id)" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <input type="checkbox" class="sr-only" :checked="form.chartRegions.includes(region.id)" @change="toggleChartRegion(region.id)" />
                <span class="text-sm font-semibold text-ditto-text">{{ region.label }}</span>
              </span>
              <span class="text-sm font-bold text-ditto-purple">+£{{ region.price }}</span>
            </label>
          </div>

          <h3 class="text-base font-semibold text-ditto-text mt-8 mb-5">Exclusive <span class="font-black">add-ons</span></h3>
          <div class="space-y-6">
            <div class="flex items-start gap-3">
              <button @click="togglePreRelease" :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5', form.preReleaseDownloads ? 'border-ditto-purple bg-ditto-purple' : preReleaseAllowed ? 'border-gray-300 hover:border-ditto-purple/50' : 'border-gray-200 cursor-not-allowed']">
                <svg v-if="form.preReleaseDownloads" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
              <div class="flex-1">
                <div class="flex items-center justify-between gap-4">
                  <p :class="['text-sm font-semibold', preReleaseAllowed ? 'text-ditto-text' : 'text-ditto-subtext/60']">Pre-release downloads</p>
                  <p class="text-sm font-bold text-ditto-purple">+£40</p>
                </div>
                <p class="text-[13px] text-ditto-subtext leading-relaxed mt-1">Let fans pre-order your music on iTunes and Amazon and offer early access to selected tracks with instant gratification.</p>
                <p v-if="!preReleaseAllowed" class="text-[13px] font-medium text-ditto-purple mt-1">Pick a date more than 10 days away or use Priority Distro.</p>

                <!-- Pre-order date: anywhere between today and release day -->
                <div v-if="form.preReleaseDownloads" class="mt-5">
                  <p class="flex items-center gap-1.5 text-sm font-semibold text-ditto-text mb-1">
                    Choose a pre-order date
                    <span class="group/tip relative">
                      <svg class="w-4 h-4 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12" stroke-linecap="round"/><line x1="12" y1="8" x2="12.01" y2="8" stroke-linecap="round"/></svg>
                      <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 rounded-lg bg-ditto-text text-white text-[11px] font-normal leading-relaxed opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all z-30">
                        The day fans can start pre-ordering. It must land before your release date.
                      </span>
                    </span>
                  </p>
                  <div class="relative max-w-xs" ref="preOrderWrap">
                    <button
                      @click="showPreOrderCalendar = !showPreOrderCalendar"
                      class="w-full flex items-center gap-2.5 border-0 border-b border-gray-300 hover:border-ditto-purple px-0 py-2.5 text-sm bg-transparent transition-colors focus:outline-none"
                    >
                      <svg class="w-4 h-4 flex-shrink-0 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      <span :class="form.preReleaseDate ? 'text-ditto-text font-medium' : 'text-ditto-subtext'">{{ form.preReleaseDate ? formatLongDate(form.preReleaseDate) : 'Select date' }}</span>
                      <svg class="w-3.5 h-3.5 text-ditto-subtext ml-auto transition-transform" :class="showPreOrderCalendar ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>

                    <div v-if="showPreOrderCalendar" class="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-30">
                      <div class="flex items-center justify-between mb-3">
                        <button @click="prevPreOrderMonth" class="w-7 h-7 flex items-center justify-center rounded-lg text-ditto-subtext hover:bg-ditto-light-grey transition-colors">
                          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                        <p class="text-sm font-bold text-ditto-text">{{ preOrderMonthLabel }}</p>
                        <button @click="nextPreOrderMonth" class="w-7 h-7 flex items-center justify-center rounded-lg text-ditto-subtext hover:bg-ditto-light-grey transition-colors">
                          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                      </div>
                      <div class="grid grid-cols-7 gap-y-1 text-center text-xs">
                        <span v-for="d in ['Mo','Tu','We','Th','Fr','Sa','Su']" :key="d" class="font-semibold text-ditto-subtext py-1">{{ d }}</span>
                        <button
                          v-for="cell in preOrderCells"
                          :key="cell.key"
                          :disabled="cell.disabled || !cell.inMonth"
                          @click="selectPreOrderDate(cell.date)"
                          :class="[
                            'relative h-8 rounded-lg text-[13px] transition-colors',
                            !cell.inMonth ? 'text-gray-300' :
                            cell.isReleaseDay ? 'text-ditto-purple font-bold ring-1 ring-inset ring-ditto-purple/40 cursor-not-allowed' :
                            cell.disabled ? 'text-gray-300 cursor-not-allowed' :
                            isPreOrderSelected(cell.date) ? 'bg-ditto-purple text-white font-bold' :
                            'text-ditto-text hover:bg-ditto-light-grey'
                          ]"
                        >
                          {{ cell.day }}
                        </button>
                      </div>
                      <p class="mt-3 text-[11px] text-ditto-subtext text-center">Release day: {{ form.releaseDate ? formatDate(form.releaseDate) : 'not set' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <button @click="form.autoReleaseNewPlatforms = !form.autoReleaseNewPlatforms" :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5', form.autoReleaseNewPlatforms ? 'border-ditto-purple bg-ditto-purple' : 'border-gray-300 hover:border-ditto-purple/50']">
                <svg v-if="form.autoReleaseNewPlatforms" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
              <div class="flex-1">
                <p class="text-sm font-semibold text-ditto-text">Auto-release to new platforms</p>
                <p class="text-[13px] text-ditto-subtext leading-relaxed mt-1">Whenever we partner with a new store or platform, this release will automatically be sent there — no action needed from you.</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <button @click="form.releaseProtection = !form.releaseProtection" :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5', form.releaseProtection ? 'border-ditto-purple bg-ditto-purple' : 'border-gray-300 hover:border-ditto-purple/50']">
                <svg v-if="form.releaseProtection" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
              <div class="flex-1">
                <p class="text-sm font-semibold text-ditto-text">Add release protection</p>
                <p class="text-[13px] text-ditto-subtext leading-relaxed mt-1">We'll never remove this release from stores unless you ask us to. Even if you cancel your account or miss a subscription payment, your music stays protected and will continue to generate royalties.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tip card -->
      <aside class="border border-ditto-purple/30 rounded-2xl p-6 pt-9 relative mt-6 lg:mt-11">
        <span class="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border border-ditto-purple/30 flex items-center justify-center">
          <svg class="w-5 h-5 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg>
        </span>
        <p class="text-center font-satoshi font-black text-base text-ditto-purple leading-snug mb-3">Pre-release &amp;<br/>chart registration</p>
        <p class="text-[13px] text-ditto-subtext leading-relaxed text-center">Combining a pre-release campaign with chart registration can boost your chances of landing an official chart position.</p>
        <p class="text-[13px] text-ditto-subtext leading-relaxed text-center mt-3">All pre-release downloads count towards your grand total on release day – and downloads are worth much more than streams when calculating the charts.</p>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { chartRegions } from '../../../../data/releaseBuilderMockData'
import CountryRestrictionsModal from '../../../videos/steps/CountryRestrictionsModal.vue'
import type { ReleaseBuilderForm } from '../ReleaseBuilderView.vue'

const props = defineProps<{ form: ReleaseBuilderForm }>()

const ynClass = (active: boolean) =>
  [
    'px-6 py-2 text-sm font-medium rounded-full transition-colors',
    active ? 'bg-ditto-purple btn-pop-purple text-white' : 'border border-gray-200 text-ditto-text hover:bg-ditto-light-grey',
  ].join(' ')

// ── Calendar ──
const showCalendar = ref(false)
const calendarWrap = ref<HTMLElement | null>(null)
const today = new Date()
today.setHours(0, 0, 0, 0)
const viewMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const monthLabel = computed(() =>
  viewMonth.value.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
)

const dayMs = 86400000
const daysFromToday = (d: Date) => Math.round((d.getTime() - today.getTime()) / dayMs)

const calendarCells = computed(() => {
  const first = viewMonth.value
  const startOffset = (first.getDay() + 6) % 7 // Monday-first
  const cells = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(first.getFullYear(), first.getMonth(), 1 - startOffset + i)
    const diff = daysFromToday(date)
    cells.push({
      key: date.toISOString(),
      date,
      day: date.getDate(),
      inMonth: date.getMonth() === first.getMonth(),
      isToday: diff === 0,
      disabled: diff < 3,
      priorityOnly: diff >= 3 && diff < 10,
    })
  }
  return cells
})

const prevMonth = () => { viewMonth.value = new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth() - 1, 1) }
const nextMonth = () => { viewMonth.value = new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth() + 1, 1) }

const isSelected = (d: Date) =>
  props.form.releaseDate !== null && d.getTime() === props.form.releaseDate.getTime()

const selectDate = (d: Date) => {
  props.form.releaseDate = d
  showCalendar.value = false
  // Dates inside the standard window force Priority
  if (daysFromToday(d) < 10) props.form.distributionType = 'priority'
  else if (!props.form.distributionType) props.form.distributionType = 'standard'
}

const standardDisabled = computed(() =>
  props.form.releaseDate !== null && daysFromToday(props.form.releaseDate) < 10
)

const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const handleClickOutside = (e: MouseEvent) => {
  if (showCalendar.value && calendarWrap.value && !calendarWrap.value.contains(e.target as Node)) {
    showCalendar.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

// ── Country restrictions (same popup as the video builder) ──
const showCountryModal = ref(false)
const removeCountry = (country: string) => {
  props.form.restrictedCountries = props.form.restrictedCountries.filter(c => c !== country)
}

// ── Extras ──
const toggleChartRegion = (id: string) => {
  const i = props.form.chartRegions.indexOf(id)
  if (i >= 0) props.form.chartRegions.splice(i, 1)
  else props.form.chartRegions.push(id)
}

// Original release date binds to a plain date input
const originalDateValue = computed(() => {
  const d = props.form.originalReleaseDate
  if (!d) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})
const setOriginalDate = (v: string) => {
  props.form.originalReleaseDate = v ? new Date(v + 'T00:00:00') : null
}

const preReleaseAllowed = computed(() =>
  props.form.distributionType === 'priority' ||
  (props.form.releaseDate !== null && daysFromToday(props.form.releaseDate) >= 10)
)

const togglePreRelease = () => {
  if (!preReleaseAllowed.value) return
  props.form.preReleaseDownloads = !props.form.preReleaseDownloads
  if (props.form.preReleaseDownloads) {
    // Default the pre-order window to a week out, clamped inside the release date
    if (!props.form.preReleaseDate && props.form.releaseDate) {
      const suggested = new Date(today.getTime() + 7 * dayMs)
      props.form.preReleaseDate = suggested < props.form.releaseDate ? suggested : new Date(today.getTime() + dayMs)
    }
    preOrderMonth.value = new Date(
      (props.form.preReleaseDate ?? today).getFullYear(),
      (props.form.preReleaseDate ?? today).getMonth(),
      1,
    )
  } else {
    props.form.preReleaseDate = null
  }
}

// ── Pre-order calendar (same anatomy as the release-date picker) ──
const showPreOrderCalendar = ref(false)
const preOrderWrap = ref<HTMLElement | null>(null)
const preOrderMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const preOrderMonthLabel = computed(() =>
  preOrderMonth.value.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
)

const preOrderCells = computed(() => {
  const first = preOrderMonth.value
  const startOffset = (first.getDay() + 6) % 7
  const release = props.form.releaseDate
  const cells = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(first.getFullYear(), first.getMonth(), 1 - startOffset + i)
    const diff = daysFromToday(date)
    cells.push({
      key: date.toISOString(),
      date,
      day: date.getDate(),
      inMonth: date.getMonth() === first.getMonth(),
      // Pre-orders open from tomorrow up to the day before release
      disabled: diff < 1 || (release !== null && date.getTime() >= release.getTime()),
      isReleaseDay: release !== null && date.getTime() === release.getTime(),
    })
  }
  return cells
})

const prevPreOrderMonth = () => { preOrderMonth.value = new Date(preOrderMonth.value.getFullYear(), preOrderMonth.value.getMonth() - 1, 1) }
const nextPreOrderMonth = () => { preOrderMonth.value = new Date(preOrderMonth.value.getFullYear(), preOrderMonth.value.getMonth() + 1, 1) }

const isPreOrderSelected = (d: Date) =>
  props.form.preReleaseDate !== null && d.getTime() === props.form.preReleaseDate.getTime()

const selectPreOrderDate = (d: Date) => {
  props.form.preReleaseDate = d
  showPreOrderCalendar.value = false
}

const formatLongDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const handlePreOrderClickOutside = (e: MouseEvent) => {
  if (showPreOrderCalendar.value && preOrderWrap.value && !preOrderWrap.value.contains(e.target as Node)) {
    showPreOrderCalendar.value = false
  }
}
onMounted(() => document.addEventListener('click', handlePreOrderClickOutside))
onUnmounted(() => document.removeEventListener('click', handlePreOrderClickOutside))

// Moving the release date can strand an earlier pre-order choice
watch(() => props.form.releaseDate, (release) => {
  if (release && props.form.preReleaseDate && props.form.preReleaseDate >= release) {
    props.form.preReleaseDate = null
  }
})
</script>

<style scoped>
/* Underline select matching the builder field idiom */
.builder-select {
  border: 0;
  border-bottom: 1px solid #d1d5db;
  border-radius: 0;
  padding: 0.625rem 0;
  font-size: 0.875rem;
  color: var(--ditto-colors-light-dark-ditto-text-fill);
  background: transparent;
  transition: border-color 0.15s ease;
}
.builder-select:focus {
  outline: none;
  border-bottom-color: var(--ditto-purple);
}
</style>
