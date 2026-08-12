<template>
  <div class="max-w-[1200px]">
    <!-- Header -->
    <div class="mb-10">
      <h1 class="font-satoshi font-black text-xl sm:text-3xl lg:text-[42px] tracking-tight text-ditto-text mb-2">
        Pattern <span class="text-ditto-purple">Library</span>
      </h1>
      <p class="text-sm sm:text-base text-ditto-subtext max-w-2xl">
        Every recurring pattern across the Ditto prototypes — live components where a shared one exists, class recipes where the pattern is idiomatic.
        Tokens live in <code class="text-xs bg-ditto-light-grey px-1.5 py-0.5 rounded">tailwind.css</code>; dark mode flips by re-targeting CSS variables, never
        <code class="text-xs bg-ditto-light-grey px-1.5 py-0.5 rounded">dark:</code> variants. Click any recipe to copy it.
      </p>
    </div>

    <!-- Section jump pills -->
    <div class="flex flex-wrap gap-2 mb-12">
      <a
        v-for="s in sections"
        :key="s.id"
        :href="`#${s.id}`"
        class="px-3.5 py-1.5 rounded-full text-xs font-medium bg-ditto-light-grey text-ditto-text hover:bg-ditto-purple/10 hover:text-ditto-purple transition-colors"
      >{{ s.label }}</a>
    </div>

    <!-- ══ Colours ══ -->
    <section id="colours" class="mb-14 scroll-mt-6">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text mb-1">Colours</h2>
      <p class="text-sm text-ditto-subtext mb-6">CSS variables on <code class="text-xs">:root</code>, re-targeted under <code class="text-xs">.dark</code>. Use the token utilities, never raw hex.</p>
      <div v-for="group in colourGroups" :key="group.label" class="mb-8">
        <h3 class="text-sm font-bold text-ditto-text mb-3">{{ group.label }}</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            v-for="c in group.colours"
            :key="c.name"
            @click="copy(c.utility)"
            class="text-left rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
          >
            <span class="block h-14" :style="{ background: c.swatch }"></span>
            <span class="block px-3 py-2.5">
              <span class="block text-xs font-bold text-ditto-text">{{ c.name }}</span>
              <span class="block text-[11px] text-ditto-subtext truncate group-hover:text-ditto-purple">{{ c.utility }}</span>
              <span class="block text-[10px] text-ditto-subtext/70 mt-0.5">{{ c.note }}</span>
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- ══ Typography ══ -->
    <section id="type" class="mb-14 scroll-mt-6">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text mb-1">Typography</h2>
      <p class="text-sm text-ditto-subtext mb-6">Satoshi everywhere — variable weight, black (900) for headings with tight tracking.</p>
      <div class="space-y-5">
        <button v-for="t in typeSpecs" :key="t.label" @click="copy(t.recipe)" class="block w-full text-left group">
          <span :class="t.classes">{{ t.sample }}</span>
          <span class="block text-[11px] text-ditto-subtext mt-1 group-hover:text-ditto-purple font-mono">{{ t.recipe }}</span>
        </button>
      </div>
    </section>

    <!-- ══ Buttons ══ -->
    <section id="buttons" class="mb-14 scroll-mt-6">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text mb-1">Buttons</h2>
      <p class="text-sm text-ditto-subtext mb-6">Always pill-shaped. Lime is reserved for conversion moments (Upgrade, Withdraw, affiliate CTA) — one per view, maximum.</p>
      <div class="flex flex-wrap items-center gap-4 mb-6">
        <button class="px-5 py-2.5 text-sm font-semibold rounded-full text-white btn-pop-purple hover:opacity-90 transition-opacity">Primary action</button>
        <button class="px-5 py-2.5 text-sm font-semibold rounded-full text-white btn-pop-dark hover:opacity-90 transition-opacity">Ink action</button>
        <button class="px-5 py-2.5 bg-[#E6FF3A] text-[#0a0a0a] text-sm font-semibold rounded-full hover:-translate-y-0.5 transition-transform">Conversion (lime)</button>
        <button class="px-5 py-2.5 text-sm font-medium rounded-full border border-gray-200 text-ditto-text hover:bg-ditto-light-grey transition-colors">Secondary</button>
        <button class="text-sm font-medium text-ditto-purple hover:opacity-80 transition-opacity">Text link →</button>
        <button class="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-ditto-text hover:bg-ditto-light-grey transition-colors" aria-label="Icon button">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <button class="group relative px-4 py-1.5 text-sm font-semibold rounded-full text-white flex items-center gap-2 overflow-hidden animate-gradient-shift" style="background: linear-gradient(135deg, #5f1fff, #8640f4, #a855f7); background-size: 200% 200%">
          <span class="relative z-10">Create (animated)</span>
          <span class="absolute inset-0 bg-white/15 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></span>
        </button>
      </div>
      <div class="space-y-1.5">
        <button v-for="r in buttonRecipes" :key="r.label" @click="copy(r.recipe)" class="block w-full text-left text-[11px] font-mono text-ditto-subtext hover:text-ditto-purple truncate">
          <span class="font-sans font-semibold text-ditto-text">{{ r.label }}:</span> {{ r.recipe }}
        </button>
      </div>
    </section>

    <!-- ══ Pills & badges ══ -->
    <section id="pills" class="mb-14 scroll-mt-6">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text mb-1">Pills &amp; badges</h2>
      <p class="text-sm text-ditto-subtext mb-6">
        Two families: the tiny inline pill (10px, tint at 15%) and the shared <code class="text-xs">StatusPill</code> component with its leading dot.
        Artwork overlays get translucency + backdrop blur.
      </p>
      <div class="flex flex-wrap items-center gap-3 mb-4">
        <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/15 text-success">Reward earned</span>
        <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-info/15 text-info">Clearing</span>
        <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-warning/15 text-warning">Pending</span>
        <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-error/15 text-error">Rejected</span>
        <span class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-ditto-purple/15 text-ditto-purple">PLAN BADGE</span>
      </div>
      <div class="flex flex-wrap items-center gap-3 mb-4">
        <StatusPill variant="success" label="Registered" />
        <StatusPill variant="warning" label="In review" />
        <StatusPill variant="info" label="Submitted" />
        <StatusPill variant="danger" label="Rejected" />
        <StatusPill variant="neutral" label="Draft" />
      </div>
      <div class="flex flex-wrap items-center gap-2 mb-6">
        <button class="px-4 py-1.5 rounded-full text-xs font-medium bg-ditto-text text-white dark:text-[#16161d]">Active filter</button>
        <button class="px-4 py-1.5 rounded-full text-xs font-medium bg-ditto-light-grey text-ditto-text">Inactive filter</button>
        <span class="relative inline-block w-24 h-9 rounded-xl overflow-hidden">
          <img :src="artworks[0]" alt="" class="w-full h-full object-cover" />
          <span class="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-sm bg-[#00e785]/90 text-[#00331d]">Live</span>
        </span>
      </div>
      <div class="space-y-1.5">
        <button v-for="r in pillRecipes" :key="r.label" @click="copy(r.recipe)" class="block w-full text-left text-[11px] font-mono text-ditto-subtext hover:text-ditto-purple truncate">
          <span class="font-sans font-semibold text-ditto-text">{{ r.label }}:</span> {{ r.recipe }}
        </button>
      </div>
    </section>

    <!-- ══ Stat cards ══ -->
    <section id="stats" class="mb-14 scroll-mt-6">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text mb-1">Stat cards</h2>
      <p class="text-sm text-ditto-subtext mb-6">
        Shared components for dashboards (<code class="text-xs">common/StatsCard</code>, <code class="text-xs">common/RoyaltiesStatsCard</code>), plus the home-hub gradient band —
        lime is the signature card and carries THE number.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <StatsCard :stat="{ id: 'demo-streams', title: 'Total Streams', value: '1,696,508', change: 12.4, iconType: 'broadcast' }" />
        <RoyaltiesStatsCard :stat="{ id: 'demo-earnings', title: 'Total earnings', value: '£24,318.56', change: 8.2, icon: 'earnings' }" />
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button class="text-left rounded-2xl p-5 relative overflow-hidden hover:scale-[1.02] hover:shadow-lg transition-all duration-200 bg-[#E6FF3A] text-[#0a0a0a]">
          <p class="text-xs text-[#0a0a0a]/60 mb-1">Signature (lime)</p>
          <p class="text-2xl font-black font-satoshi tracking-[-0.02em] mb-2">1,696,508</p>
          <p class="text-xs text-[#0a0a0a]/55">THE number of the page</p>
        </button>
        <button class="text-left rounded-2xl p-5 text-white relative overflow-hidden hover:scale-[1.02] hover:shadow-lg transition-all duration-200" style="background: linear-gradient(145deg, #26262e, #0a0a0a 80%)">
          <p class="text-xs text-white/60 mb-1">Ink</p>
          <p class="text-2xl font-black font-satoshi tracking-[-0.02em] mb-2">Solar</p>
          <p class="text-xs text-white/45">supporting fact</p>
        </button>
        <button class="text-left rounded-2xl p-5 text-white relative overflow-hidden hover:scale-[1.02] hover:shadow-lg transition-all duration-200" style="background: linear-gradient(145deg, #6d28ff, #4A00FF 85%)">
          <p class="text-xs text-white/65 mb-1">Electric purple</p>
          <p class="text-2xl font-black font-satoshi tracking-[-0.02em] mb-2">Mix</p>
          <p class="text-xs text-white/50">supporting fact</p>
        </button>
        <button class="text-left rounded-2xl p-5 text-white relative overflow-hidden hover:scale-[1.02] hover:shadow-lg transition-all duration-200" style="background: linear-gradient(145deg, #1c2f56, #101f3c 80%)">
          <p class="text-xs text-white/60 mb-1">Ink navy</p>
          <p class="text-2xl font-black font-satoshi tracking-[-0.02em] mb-2">Spotify</p>
          <p class="text-xs text-white/45">supporting fact</p>
        </button>
      </div>
      <div class="space-y-1.5">
        <button v-for="r in statRecipes" :key="r.label" @click="copy(r.recipe)" class="block w-full text-left text-[11px] font-mono text-ditto-subtext hover:text-ditto-purple truncate">
          <span class="font-sans font-semibold text-ditto-text">{{ r.label }}:</span> {{ r.recipe }}
        </button>
      </div>
    </section>

    <!-- ══ Tabs & filters ══ -->
    <section id="tabs" class="mb-14 scroll-mt-6">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text mb-1">Tabs &amp; filters</h2>
      <p class="text-sm text-ditto-subtext mb-6">
        <code class="text-xs">common/LiquidTabs</code> is the canonical tab row (used in 8 places — the fill physically slides).
        Filter chips remove with a leading ✕; the segmented control switches chart series.
      </p>
      <div class="mb-4"><LiquidTabs :tabs="demoTabs" :active="activeDemoTab" @select="activeDemoTab = $event" /></div>
      <div class="flex flex-wrap items-center gap-3 mb-4">
        <FilterChip label="Artist" value="Almost Joey" @remove="flash('FilterChip @remove')" />
        <FilterChip label="Store" value="Spotify" @remove="flash('FilterChip @remove')" />
        <div class="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200">
          <button
            v-for="seg in ['Total', 'Streams', 'Downloads']"
            :key="seg"
            @click="activeSegment = seg"
            class="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            :class="activeSegment === seg ? 'bg-ditto-purple text-white shadow-sm' : 'text-ditto-subtext hover:text-ditto-text'"
          >{{ seg }}</button>
        </div>
      </div>
      <div class="space-y-1.5">
        <button v-for="r in tabRecipes" :key="r.label" @click="copy(r.recipe)" class="block w-full text-left text-[11px] font-mono text-ditto-subtext hover:text-ditto-purple truncate">
          <span class="font-sans font-semibold text-ditto-text">{{ r.label }}:</span> {{ r.recipe }}
        </button>
      </div>
    </section>

    <!-- ══ Charts ══ -->
    <section id="charts" class="mb-14 scroll-mt-6">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text mb-1">Charts</h2>
      <p class="text-sm text-ditto-subtext mb-6">
        chart.js + vue-chartjs, registered per file. Legends are always hand-built HTML dot rows — <code class="text-xs">legend.display</code> is off everywhere.
        Series flips with the theme via <code class="text-xs">useTheme()</code>.
      </p>
      <div class="mb-5"><PerformanceChart :data="chartDemoData" /></div>
      <div class="flex flex-wrap gap-4 mb-6">
        <span v-for="s in chartSeries" :key="s.label" class="flex items-center gap-1.5 text-sm text-ditto-text">
          <span class="w-3 h-3 rounded-full" :style="{ background: s.color }"></span>{{ s.label }}
        </span>
      </div>
      <div class="space-y-1.5">
        <button v-for="r in chartRecipes" :key="r.label" @click="copy(r.recipe)" class="block w-full text-left text-[11px] font-mono text-ditto-subtext hover:text-ditto-purple truncate">
          <span class="font-sans font-semibold text-ditto-text">{{ r.label }}:</span> {{ r.recipe }}
        </button>
      </div>
    </section>

    <!-- ══ Tables & rank rows ══ -->
    <section id="tables" class="mb-14 scroll-mt-6">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text mb-1">Tables &amp; rank rows</h2>
      <p class="text-sm text-ditto-subtext mb-6">
        No shared table component — the pattern is a CSS-grid header + hover rows, with a mandatory mobile twin. No sortable headers exist anywhere (ordering is pre-baked).
      </p>
      <div class="mb-4">
        <div class="hidden lg:grid gap-4 px-4 py-3 text-xs text-ditto-subtext grid-cols-[40px_1fr_140px_120px]">
          <span>#</span><span>Release</span><span class="text-center">Streams</span><span class="text-center">Listeners</span>
        </div>
        <div v-for="(row, i) in tableRows" :key="row.title" class="hidden lg:grid gap-4 px-4 py-4 items-center hover:bg-ditto-light-grey rounded-2xl transition-colors cursor-pointer grid-cols-[40px_1fr_140px_120px]">
          <span class="text-lg text-ditto-text">{{ i + 1 }}</span>
          <span class="flex items-center gap-4 min-w-0">
            <img :src="row.artwork" alt="" class="w-16 h-16 rounded-lg object-cover" />
            <span class="min-w-0">
              <p class="text-base font-medium text-ditto-text truncate max-w-[220px]">{{ row.title }}</p>
              <p class="text-xs text-ditto-subtext truncate">{{ row.artist }}</p>
            </span>
          </span>
          <span class="text-center text-base text-ditto-text">{{ row.streams }}</span>
          <span class="text-center text-base text-ditto-text">{{ row.listeners }}</span>
        </div>
        <!-- Mobile twin -->
        <div v-for="row in tableRows" :key="'m' + row.title" class="lg:hidden flex items-center gap-3 px-2 py-3 hover:bg-ditto-light-grey rounded-xl transition-colors cursor-pointer">
          <img :src="row.artwork" alt="" class="w-12 h-12 rounded-lg object-cover" />
          <span class="flex-1 min-w-0">
            <p class="text-sm font-medium text-ditto-text truncate">{{ row.title }}</p>
            <p class="text-xs text-ditto-subtext truncate">{{ row.artist }}</p>
          </span>
          <span class="text-sm font-semibold text-ditto-text">{{ row.streams }}</span>
        </div>
      </div>
      <div class="space-y-1.5">
        <button v-for="r in tableRecipes" :key="r.label" @click="copy(r.recipe)" class="block w-full text-left text-[11px] font-mono text-ditto-subtext hover:text-ditto-purple truncate">
          <span class="font-sans font-semibold text-ditto-text">{{ r.label }}:</span> {{ r.recipe }}
        </button>
      </div>
    </section>

    <!-- ══ Forms & inputs ══ -->
    <section id="forms" class="mb-14 scroll-mt-6">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text mb-1">Forms &amp; inputs</h2>
      <p class="text-sm text-ditto-subtext mb-6">
        Boxed inputs for search and pickers; the underline treatment is the house form field. Radios are purple-filled circles with a white tick.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 max-w-3xl mb-6">
        <SearchInput v-model="demoSearch" placeholder="Search releases" width-class="w-full" />
        <SearchableSelect v-model="demoSelect" :options="['Single', 'EP', 'Album', 'Compilation']" placeholder="Release type" />
        <div>
          <label class="text-xs text-gray-500">Underline field</label>
          <input v-model="demoText" placeholder="Artist name" class="w-full py-2 text-sm text-gray-900 border-b border-gray-200 focus:border-ditto-purple focus:outline-none transition-colors bg-transparent" />
        </div>
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-3">
            <ToggleSwitch v-model="demoToggle" />
            <span class="text-sm text-ditto-text">ToggleSwitch</span>
          </div>
          <button @click="demoRadio = !demoRadio" class="flex items-center gap-3">
            <span class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors" :class="demoRadio ? 'border-ditto-purple bg-ditto-purple' : 'border-ditto-border-grey'">
              <svg v-if="demoRadio" class="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 6L5 9L10 3" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <span class="text-sm" :class="demoRadio ? 'text-ditto-purple font-medium' : 'text-ditto-text'">Filter option <span class="text-ditto-subtext">[45]</span></span>
          </button>
        </div>
      </div>
      <div class="space-y-1.5">
        <button v-for="r in formRecipes" :key="r.label" @click="copy(r.recipe)" class="block w-full text-left text-[11px] font-mono text-ditto-subtext hover:text-ditto-purple truncate">
          <span class="font-sans font-semibold text-ditto-text">{{ r.label }}:</span> {{ r.recipe }}
        </button>
      </div>
    </section>

    <!-- ══ Cards & surfaces ══ -->
    <section id="cards" class="mb-14 scroll-mt-6">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text mb-1">Cards &amp; surfaces</h2>
      <p class="text-sm text-ditto-subtext mb-6">Three tiers: bordered card for content, floating shadow tile for marketing moments, mesh gradient for money.</p>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div class="bg-white rounded-2xl border border-gray-200 p-6">
          <p class="text-sm font-bold text-ditto-text mb-1">Bordered card</p>
          <p class="text-sm text-ditto-subtext">Default content surface. Sections, forms, lists.</p>
        </div>
        <div class="rounded-2xl bg-white shadow-[0_2px_14px_rgba(16,31,60,0.08)] hover:shadow-[0_12px_32px_rgba(95,31,255,0.18)] hover:-translate-y-1 transition-all duration-200 p-6 flex flex-col items-center text-center gap-3">
          <img src="/img/suite/perks.svg" alt="" class="w-12 h-12" />
          <span>
            <span class="block text-sm font-bold text-ditto-text">Shadow tile</span>
            <span class="block text-xs text-ditto-subtext mt-1">Markety moments, suite features.</span>
          </span>
        </div>
        <div class="relative overflow-hidden rounded-2xl p-6 text-white pattern-mesh flex flex-col justify-between min-h-[120px]">
          <span class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15 pointer-events-none"></span>
          <p class="relative text-xs text-white/65">Money surface</p>
          <p class="relative font-satoshi font-black text-3xl tracking-[-0.03em]">$50<span class="text-lg align-top">.00</span></p>
        </div>
      </div>
      <div class="space-y-1.5">
        <button v-for="r in cardRecipes" :key="r.label" @click="copy(r.recipe)" class="block w-full text-left text-[11px] font-mono text-ditto-subtext hover:text-ditto-purple truncate">
          <span class="font-sans font-semibold text-ditto-text">{{ r.label }}:</span> {{ r.recipe }}
        </button>
      </div>
    </section>

    <!-- ══ Media cards ══ -->
    <section id="media" class="mb-14 scroll-mt-6">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text mb-1">Media cards</h2>
      <p class="text-sm text-ditto-subtext mb-6">
        Artwork cards zoom under a clipped box (<code class="text-xs">clip-radius-stable</code> stops WebKit squaring the corners). Artists are circles;
        <code class="text-xs">InitialsAvatar</code> fills any shaped parent when there's no photo.
      </p>
      <div class="flex flex-wrap items-start gap-6 mb-6">
        <button class="w-44 text-left group transition-transform duration-300 hover:-translate-y-1.5">
          <span class="relative block rounded-2xl overflow-hidden clip-radius-stable shadow-sm group-hover:shadow-xl transition-shadow duration-300">
            <img :src="artworks[0]" alt="" class="w-full aspect-square object-cover group-hover:scale-[1.05] transition-transform duration-500" />
            <span class="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-sm bg-[#00e785]/90 text-[#00331d]">Live</span>
          </span>
          <span class="block text-[15px] font-bold text-ditto-text truncate mt-3">Release card</span>
          <span class="block text-[13px] text-ditto-subtext truncate mt-0.5">Single by <span class="text-ditto-purple">Artist</span> · 2026</span>
        </button>
        <div class="w-32 flex flex-col items-center gap-3 group transition-transform duration-300 hover:-translate-y-1">
          <span class="block w-28 h-28 rounded-full overflow-hidden clip-radius-stable ring-1 ring-gray-200 group-hover:ring-[3px] group-hover:ring-ditto-purple shadow-sm group-hover:shadow-lg transition-all">
            <InitialsAvatar name="Almost Joey" text-class="text-3xl" />
          </span>
          <span class="text-sm font-semibold text-ditto-text text-center leading-tight">InitialsAvatar</span>
        </div>
        <button class="w-44 aspect-square rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-3 text-ditto-subtext hover:border-ditto-purple hover:text-ditto-purple transition-colors">
          <img src="/img/suite/distro.svg" alt="" class="w-12 h-12" />
          <span class="text-sm font-semibold">Create card</span>
        </button>
      </div>
      <div class="space-y-1.5">
        <button v-for="r in mediaRecipes" :key="r.label" @click="copy(r.recipe)" class="block w-full text-left text-[11px] font-mono text-ditto-subtext hover:text-ditto-purple truncate">
          <span class="font-sans font-semibold text-ditto-text">{{ r.label }}:</span> {{ r.recipe }}
        </button>
      </div>
    </section>

    <!-- ══ Lists ══ -->
    <section id="lists" class="mb-14 scroll-mt-6">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text mb-1">List rows</h2>
      <p class="text-sm text-ditto-subtext mb-6">The canonical row: no dividers, rounded hover wash, avatar + detail + status + figure.</p>
      <div class="space-y-1 mb-6 max-w-2xl">
        <div class="flex items-center gap-4 px-4 py-4 hover:bg-ditto-light-grey rounded-2xl transition-colors cursor-pointer">
          <div class="w-10 h-10 rounded-full bg-ditto-purple/10 text-ditto-purple flex items-center justify-center flex-shrink-0 text-sm font-bold">NS</div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-ditto-text truncate">Primary line</p>
            <p class="text-xs text-ditto-subtext truncate">Secondary detail · 14 Jun 2026</p>
          </div>
          <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/15 text-success">Status</span>
          <p class="text-base font-semibold text-ditto-text flex-shrink-0">+$10</p>
        </div>
        <div class="flex items-center gap-4 px-4 py-4 hover:bg-ditto-light-grey rounded-2xl transition-colors cursor-pointer">
          <div class="w-10 h-10 rounded-full bg-info/15 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-ditto-text truncate">Icon variant</p>
            <p class="text-xs text-ditto-subtext truncate">Tinted circle instead of initials</p>
          </div>
          <p class="text-base font-semibold text-ditto-text flex-shrink-0">-£1,400.00</p>
        </div>
      </div>
      <button @click="copy(listRecipe)" class="block w-full text-left text-[11px] font-mono text-ditto-subtext hover:text-ditto-purple truncate">
        <span class="font-sans font-semibold text-ditto-text">Row:</span> {{ listRecipe }}
      </button>
    </section>

    <!-- ══ Overlays ══ -->
    <section id="overlays" class="mb-14 scroll-mt-6">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text mb-1">Overlays</h2>
      <p class="text-sm text-ditto-subtext mb-6">
        Modals centre on a 40% black backdrop; panels slide from the right; menus are white rounded-2xl flyouts. Shown here inline, positioning classes in the recipes.
      </p>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <!-- Static modal mock -->
        <div class="bg-black/40 rounded-2xl p-6 sm:p-10 flex items-center justify-center">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm px-8 py-7 relative">
            <button class="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-ditto-text hover:bg-ditto-light-grey transition-colors" aria-label="Close">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/></svg>
            </button>
            <h4 class="font-satoshi font-black tracking-[-0.03em] text-xl text-ditto-text text-center pr-6 mb-6">Modal title</h4>
            <div class="flex items-center justify-center gap-3">
              <button class="px-8 py-2.5 rounded-full bg-ditto-light-grey text-sm font-semibold text-ditto-text hover:bg-gray-200 transition-colors">Cancel</button>
              <button class="px-8 py-2.5 rounded-full text-sm font-semibold bg-ditto-purple btn-pop-purple text-white hover:opacity-95 transition-all">Confirm</button>
            </div>
          </div>
        </div>
        <!-- Static menu flyout mock -->
        <div class="rounded-2xl border border-gray-200 bg-ditto-light-grey/40 p-6 sm:p-10 flex items-start justify-center">
          <div class="w-56 bg-white rounded-2xl shadow-xl border border-gray-200 py-1.5">
            <button v-for="item in ['Account Settings', 'Order History', 'Refer a Friend']" :key="item" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors text-left">{{ item }}</button>
            <div class="border-t border-gray-200 mt-1 pt-1">
              <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error/5 transition-colors text-left">Logout</button>
            </div>
          </div>
        </div>
      </div>
      <div class="space-y-1.5">
        <button v-for="r in overlayRecipes" :key="r.label" @click="copy(r.recipe)" class="block w-full text-left text-[11px] font-mono text-ditto-subtext hover:text-ditto-purple truncate">
          <span class="font-sans font-semibold text-ditto-text">{{ r.label }}:</span> {{ r.recipe }}
        </button>
      </div>
    </section>

    <!-- ══ Wizard / stepper ══ -->
    <section id="wizard" class="mb-14 scroll-mt-6">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text mb-1">Wizard step bar</h2>
      <p class="text-sm text-ditto-subtext mb-6">
        The builder pattern (music + video): sticky top bar, flex-stretch steps with a 3px bottom border carrying the state. Sticky footer nav with Back / Next pills.
      </p>
      <div class="rounded-2xl border border-gray-200 overflow-hidden mb-6">
        <div class="bg-white border-b border-gray-200 px-6">
          <div class="flex items-stretch">
            <button v-for="step in wizardSteps" :key="step.n" class="flex-1 flex flex-col items-center gap-0.5 pb-3 pt-3 text-sm font-medium transition-all border-b-[3px] whitespace-nowrap" :class="step.bar">
              <span class="text-lg font-bold leading-none" :class="step.num">{{ step.n }}</span>
              <span class="hidden sm:inline">{{ step.label }}</span>
            </button>
          </div>
        </div>
        <div class="bg-white px-6 py-4 flex items-center justify-center gap-4 border-t border-gray-200">
          <button class="px-8 py-2.5 text-sm font-medium rounded-full border border-gray-200 text-ditto-text hover:bg-ditto-light-grey transition-colors">Back</button>
          <button class="px-8 py-2.5 bg-ditto-purple btn-pop-purple text-white text-sm font-medium rounded-full hover:opacity-95 transition-opacity">Next</button>
        </div>
      </div>
      <div class="space-y-1.5">
        <button v-for="r in wizardRecipes" :key="r.label" @click="copy(r.recipe)" class="block w-full text-left text-[11px] font-mono text-ditto-subtext hover:text-ditto-purple truncate">
          <span class="font-sans font-semibold text-ditto-text">{{ r.label }}:</span> {{ r.recipe }}
        </button>
      </div>
    </section>

    <!-- ══ Feedback & empty states ══ -->
    <section id="feedback" class="mb-14 scroll-mt-6">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text mb-1">Feedback &amp; empty states</h2>
      <p class="text-sm text-ditto-subtext mb-6">
        Toast confirms actions. <code class="text-xs">EmptyState</code> for no-results, <code class="text-xs">NewUserEmptyState</code> for onboarding, ghost tiles for empty rails.
      </p>
      <div class="flex flex-wrap items-center gap-4 mb-5">
        <button @click="demoToastFire" class="px-5 py-2.5 text-sm font-semibold rounded-full text-white btn-pop-purple hover:opacity-90 transition-opacity">Trigger toast</button>
        <div class="flex gap-3 items-center">
          <div class="w-16 h-16 rounded-2xl bg-ditto-light-grey"></div>
          <div class="w-16 h-16 rounded-2xl bg-ditto-light-grey opacity-70"></div>
          <div class="w-16 h-16 rounded-2xl bg-ditto-light-grey opacity-40"></div>
          <span class="text-xs text-ditto-subtext">ghost tiles: opacity 1 − n × 0.16</span>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div class="bg-white rounded-2xl border border-gray-200"><EmptyState type="no-results" title="No matches" message="Try a different search or clear your filters." action-label="Clear filters" @action="flash('EmptyState @action')" /></div>
        <div class="bg-white rounded-2xl border border-gray-200"><NewUserEmptyState icon="/img/suite/playlisting.svg" title="Nothing here yet" message="This appears once your first release is live in stores." cta-label="Create your first release" @cta="flash('NewUserEmptyState @cta')" /></div>
      </div>
      <div class="space-y-1.5">
        <button v-for="r in feedbackRecipes" :key="r.label" @click="copy(r.recipe)" class="block w-full text-left text-[11px] font-mono text-ditto-subtext hover:text-ditto-purple truncate">
          <span class="font-sans font-semibold text-ditto-text">{{ r.label }}:</span> {{ r.recipe }}
        </button>
      </div>
    </section>

    <!-- ══ Motion ══ -->
    <section id="motion" class="mb-14 scroll-mt-6">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text mb-1">Motion</h2>
      <p class="text-sm text-ditto-subtext mb-6">
        Hover lifts, count-ups, gradient shift. All count-ups honour <code class="text-xs">prefers-reduced-motion</code>.
        Transitions are scoped per component — <code class="text-xs">fade · slide · sheet · toast · modal · dropdown · mini-basket-*</code>.
      </p>
      <div class="flex flex-wrap items-center gap-6 mb-6">
        <p class="font-satoshi font-black text-4xl tracking-[-0.03em] text-ditto-text tabular-nums">{{ motionCount.toLocaleString('en-GB') }}<span class="text-xl">.56</span></p>
        <span class="text-xs text-ditto-subtext">← useCountUp(24318) · easeOutCubic · integers only, decimals static</span>
      </div>
      <div class="space-y-1.5">
        <button v-for="r in motionRecipes" :key="r.label" @click="copy(r.recipe)" class="block w-full text-left text-[11px] font-mono text-ditto-subtext hover:text-ditto-purple truncate">
          <span class="font-sans font-semibold text-ditto-text">{{ r.label }}:</span> {{ r.recipe }}
        </button>
      </div>
    </section>

    <!-- ══ Iconography ══ -->
    <section id="icons" class="mb-14 scroll-mt-6">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text mb-1">Iconography</h2>
      <p class="text-sm text-ditto-subtext mb-6">
        Two families. <span class="font-semibold text-ditto-text">Suite illustrations</span> (<code class="text-xs">/img/suite/</code>) for marketing moments —
        <span class="font-semibold text-ditto-text">stroke glyphs</span> (inline SVG or <code class="text-xs">/img/nav-*.svg</code>, 1.8–2px, round caps) for UI. Nav glyphs auto-invert in dark mode.
      </p>
      <div class="flex flex-wrap gap-4 mb-4">
        <div v-for="icon in suiteIcons" :key="icon" class="w-20 flex flex-col items-center gap-2">
          <span class="w-16 h-16 rounded-2xl bg-white shadow-[0_2px_14px_rgba(16,31,60,0.08)] flex items-center justify-center">
            <img :src="`/img/suite/${icon}`" alt="" class="w-9 h-9 object-contain" />
          </span>
          <span class="text-[10px] text-ditto-subtext text-center leading-tight truncate w-full">{{ icon.replace('.svg','') }}</span>
        </div>
      </div>
    </section>

    <!-- ══ Gradients ══ -->
    <section id="gradients" class="mb-14 scroll-mt-6">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text mb-1">Gradient recipes</h2>
      <p class="text-sm text-ditto-subtext mb-6">Mesh = overlapping soft radials over a diagonal base. Deep tones anchor where figures and lime CTAs sit.</p>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div v-for="g in gradients" :key="g.label" class="rounded-2xl overflow-hidden border border-gray-200">
          <div class="h-20" :class="g.class" :style="g.style"></div>
          <div class="px-3 py-2.5">
            <p class="text-xs font-bold text-ditto-text">{{ g.label }}</p>
            <p class="text-[10px] text-ditto-subtext leading-snug">{{ g.note }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ Gotchas ══ -->
    <section id="gotchas" class="mb-14 scroll-mt-6">
      <h2 class="font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text mb-1">Gotchas</h2>
      <p class="text-sm text-ditto-subtext mb-5">Things that will bite you when lifting patterns from this codebase.</p>
      <ul class="space-y-3 max-w-3xl">
        <li v-for="g in gotchas" :key="g" class="flex items-start gap-3 text-sm text-ditto-text">
          <span class="w-5 h-5 rounded-full bg-warning/15 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg class="w-3 h-3 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v4M12 17h.01" stroke-linecap="round"/></svg>
          </span>
          <span v-html="g"></span>
        </li>
      </ul>
    </section>

    <Toast :visible="showToast" :message="toastMessage" type="success" @close="showToast = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Toast from '../../components/ui/Toast.vue'
import StatusPill from '../../components/common/StatusPill.vue'
import StatsCard from '../../components/common/StatsCard.vue'
import RoyaltiesStatsCard from '../../components/common/RoyaltiesStatsCard.vue'
import LiquidTabs from '../../components/common/LiquidTabs.vue'
import FilterChip from '../../components/layout/FilterChip.vue'
import PerformanceChart from '../../components/common/PerformanceChart.vue'
import SearchInput from '../../components/common/SearchInput.vue'
import SearchableSelect from '../../views/videos/steps/SearchableSelect.vue'
import ToggleSwitch from '../../components/artists/ToggleSwitch.vue'
import InitialsAvatar from '../../components/common/InitialsAvatar.vue'
import EmptyState from '../../components/common/EmptyState.vue'
import NewUserEmptyState from '../../components/common/NewUserEmptyState.vue'
import { useCountUp } from '../../composables/useCountUp'
import { releaseCatalog } from '../../data/releaseDetailMockData'

const sections = [
  { id: 'colours', label: 'Colours' },
  { id: 'type', label: 'Typography' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'pills', label: 'Pills & badges' },
  { id: 'stats', label: 'Stat cards' },
  { id: 'tabs', label: 'Tabs & filters' },
  { id: 'charts', label: 'Charts' },
  { id: 'tables', label: 'Tables' },
  { id: 'forms', label: 'Forms' },
  { id: 'cards', label: 'Cards & surfaces' },
  { id: 'media', label: 'Media cards' },
  { id: 'lists', label: 'List rows' },
  { id: 'overlays', label: 'Overlays' },
  { id: 'wizard', label: 'Wizard' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'motion', label: 'Motion' },
  { id: 'icons', label: 'Iconography' },
  { id: 'gradients', label: 'Gradients' },
  { id: 'gotchas', label: 'Gotchas' },
]

// ── Foundations ──
const colourGroups = [
  {
    label: 'Brand',
    colours: [
      { name: 'Ditto Purple', utility: 'ditto-purple', swatch: '#5f1fff', note: '#5f1fff · #a06bff dark' },
      { name: 'Brand Lime', utility: 'bg-[#E6FF3A]', swatch: '#E6FF3A', note: 'conversion only, never flips' },
      { name: 'Ink Navy', utility: 'ditto-text / --ink-fill', swatch: '#101f3c', note: 'text flips light, fills stay' },
      { name: 'Light Purple', utility: 'ditto-purple/10', swatch: 'rgba(95,31,255,0.1)', note: 'selection & icon tints' },
      { name: 'Light Grey', utility: 'ditto-light-grey', swatch: '#efeffc', note: 'washes · #1e1e27 dark' },
    ],
  },
  {
    label: 'Status',
    colours: [
      { name: 'Success', utility: 'success', swatch: '#00e785', note: 'earned, live, confirmed' },
      { name: 'Info', utility: 'info', swatch: '#287ef7', note: 'clearing, in progress' },
      { name: 'Warning', utility: 'warning', swatch: '#ffb100', note: 'pending, action needed' },
      { name: 'Error', utility: 'error', swatch: '#ee404c', note: 'rejected, failed' },
      { name: 'Subtext', utility: 'ditto-subtext', swatch: '#626984', note: 'secondary copy' },
    ],
  },
  {
    label: 'Charts & splits',
    colours: [
      { name: 'Series purple', utility: '#8640f4', swatch: '#8640f4', note: 'primary chart series' },
      { name: 'Series pink', utility: '#ff006e', swatch: '#ff006e', note: 'streams series' },
      { name: 'Series mint', utility: '#12c1ae', swatch: '#12c1ae', note: 'downloads series' },
      { name: 'Split yours', utility: '--split-yours', swatch: '#287ef7', note: '#5b9dff dark' },
      { name: 'Split confirmed', utility: '--split-confirmed', swatch: '#00e785', note: 'shared with success' },
    ],
  },
]

const typeSpecs = [
  { label: 'Page header', sample: 'Page header', classes: 'font-satoshi font-black text-xl sm:text-3xl lg:text-[42px] tracking-tight text-ditto-text', recipe: 'font-satoshi font-black text-xl sm:text-3xl lg:text-[42px] tracking-tight text-ditto-text' },
  { label: 'Section header', sample: 'Section header', classes: 'font-satoshi font-black tracking-[-0.03em] text-2xl text-ditto-text', recipe: 'font-satoshi font-black tracking-[-0.03em] text-2xl lg:text-3xl text-ditto-text' },
  { label: 'Card heading', sample: 'Card heading', classes: 'font-satoshi font-black tracking-[-0.03em] text-lg text-ditto-text', recipe: 'font-satoshi font-black tracking-[-0.03em] text-lg lg:text-xl text-ditto-text' },
  { label: 'Body', sample: 'Body copy sits at 14px with the subtext grey for supporting lines.', classes: 'text-sm text-ditto-subtext', recipe: 'text-sm text-ditto-text · supporting: text-sm text-ditto-subtext' },
  { label: 'Headline figure', sample: '$1,696,508', classes: 'font-satoshi font-black text-4xl tracking-[-0.03em] text-ditto-text tabular-nums', recipe: 'font-satoshi font-black tracking-[-0.03em] tabular-nums (+ useCountUp on mount)' },
]

const buttonRecipes = [
  { label: 'Primary', recipe: 'px-5 py-2.5 text-sm font-semibold rounded-full text-white btn-pop-purple hover:opacity-90' },
  { label: 'Ink', recipe: 'px-5 py-2.5 text-sm font-semibold rounded-full text-white btn-pop-dark hover:opacity-90' },
  { label: 'Conversion', recipe: 'bg-[#E6FF3A] text-[#0a0a0a] font-semibold rounded-full hover:-translate-y-0.5 transition-transform' },
  { label: 'Secondary', recipe: 'rounded-full border border-gray-200 text-ditto-text hover:bg-ditto-light-grey' },
  { label: 'Icon button', recipe: 'w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-ditto-light-grey' },
  { label: 'Create (animated)', recipe: 'rounded-full text-white animate-gradient-shift + inline linear-gradient(135deg,#5f1fff,#8640f4,#a855f7) background-size:200% 200% + sheen span' },
]

const pillRecipes = [
  { label: 'Inline status pill', recipe: 'text-[10px] font-semibold px-2 py-0.5 rounded-full bg-{success|info|warning|error}/15 text-{same}' },
  { label: 'StatusPill component', recipe: "components/common/StatusPill.vue — { variant: 'success'|'warning'|'danger'|'info'|'neutral', label } · leading dot w-1.5 h-1.5" },
  { label: 'Artwork overlay', recipe: 'absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-sm bg-[#00e785]/90 text-[#00331d]' },
  { label: 'Filter pill', recipe: 'px-4 py-1.5 rounded-full text-xs font-medium · active: bg-ditto-text text-white dark:text-[#16161d] · inactive: bg-ditto-light-grey text-ditto-text' },
  { label: 'Plan badge', recipe: 'text-[10px] font-semibold px-2 py-0.5 rounded-md bg-ditto-purple/15 text-ditto-purple' },
]

// ── Stat cards ──
const statRecipes = [
  { label: 'StatsCard', recipe: "components/common/StatsCard.vue — { stat: { id, title, value, change?, iconType?: 'broadcast'|'clock'|'store', storeIcon?, storeName? } }" },
  { label: 'RoyaltiesStatsCard', recipe: "components/common/RoyaltiesStatsCard.vue — { stat: { id, title, value, change?, icon: 'earnings'|'average'|'store'|'streams' } } (imported AS StatsCard in royalties OverviewView — beware)" },
  { label: 'Gradient stat card', recipe: 'text-left rounded-2xl p-5 relative overflow-hidden hover:scale-[1.02] hover:shadow-lg transition-all duration-200 + variant bg (lime | ink | electric purple | ink navy) + icon chip absolute top-4 right-4 w-12 h-12 rounded-xl' },
  { label: 'Balance card', recipe: 'rounded-2xl border border-gray-200 bg-ditto-light-grey/40 p-6 hover:shadow-lg flex flex-col justify-between min-h-[230px] + figure tabular-nums + arrow chip group-hover:bg-ditto-purple' },
]

// ── Tabs ──
const demoTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'releases', label: 'Releases' },
  { id: 'tracks', label: 'Tracks' },
  { id: 'audience', label: 'Audience' },
]
const activeDemoTab = ref('overview')
const activeSegment = ref('Total')

const tabRecipes = [
  { label: 'LiquidTabs', recipe: "components/common/LiquidTabs.vue — { tabs: {id,label,icon?}[], active, fillClass? } @select · icons must be markRaw()" },
  { label: 'FilterChip', recipe: 'components/layout/FilterChip.vue — { label, value } @remove · row: flex flex-wrap gap-2 mb-4' },
  { label: 'Segmented control', recipe: 'track: flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200 · segment: px-3 py-1.5 rounded-md text-xs font-medium · active: bg-ditto-purple text-white shadow-sm' },
  { label: 'Sidebar rail', recipe: 'components/layout/LeftSidebar.vue — mobile pills / desktop list · active: bg-ditto-purple text-white lg:bg-ditto-light-grey lg:text-ditto-purple' },
  { label: 'Nav underline', recipe: 'absolute bottom-[-28px] h-[2px] bg-ditto-purple rounded-full transition-all duration-300 ease-out (position computed from active item)' },
]

// ── Charts ──
const chartDemoData = [
  { day: 'Mon', current: 24800, previous: 21200 },
  { day: 'Tue', current: 26900, previous: 22800 },
  { day: 'Wed', current: 25400, previous: 24100 },
  { day: 'Thu', current: 29800, previous: 23400 },
  { day: 'Fri', current: 34200, previous: 26700 },
  { day: 'Sat', current: 38100, previous: 29800 },
  { day: 'Sun', current: 36400, previous: 28900 },
]
const chartSeries = [
  { label: 'Current period · #5f1fff (dark #a06bff)', color: '#5f1fff' },
  { label: 'Previous · #d9c1ff', color: '#d9c1ff' },
  { label: 'Total · #8640f4', color: '#8640f4' },
  { label: 'Streams · #ff006e', color: '#ff006e' },
  { label: 'Downloads · #12c1ae', color: '#12c1ae' },
]
const chartRecipes = [
  { label: 'Line chart', recipe: 'components/common/PerformanceChart.vue — { data: {day,current,previous}[] } · tension 0.4, pointRadius 0, gradient fill rgba(95,31,255,0.15)→transparent' },
  { label: 'Shared options', recipe: "grid y #efefef (dark rgba(255,255,255,0.07)) · ticks 10px Satoshi #626984 · tooltip white/#1e1e27 rounded-8 usePointStyle · legend.display false — legends are HTML dot rows (w-3 h-3 rounded-full)" },
  { label: 'Donut', recipe: "cutout '70–72%', borderRadius 4, spacing 2, borderColor = surface colour · centre total = absolute inset-0 overlay" },
  { label: 'Chart shell', recipe: 'bg-[#f9f9ff] rounded-2xl p-4 lg:p-6 · canvas box h-[300px] relative' },
  { label: 'Progress ring', recipe: 'SVG 44×44 r=18 stroke-width 4, track #EFEFFC fill #6C5CE7, stroke-dashoffset animated, rotate -90deg (no sparkline component exists)' },
  { label: 'Proportion bar', recipe: 'h-2 bg-gray-100 rounded-full overflow-hidden > h-full rounded-full transition-all duration-700 + inline width/backgroundColor' },
]

// ── Tables ──
const artworks = [
  releaseCatalog[0]?.artwork ?? '/img/suite/distro.svg',
  releaseCatalog[1]?.artwork ?? '/img/suite/distro.svg',
]
const tableRows = [
  { title: 'Solar', artist: 'Almost Joey', artwork: artworks[0], streams: '440,333', listeners: '112,401' },
  { title: 'Midnight Run', artist: 'Darkoo', artwork: artworks[1], streams: '287,120', listeners: '98,774' },
]
const tableRecipes = [
  { label: 'Header', recipe: 'hidden lg:grid gap-4 px-4 py-3 text-xs text-ditto-subtext grid-cols-[40px_1fr_140px_100px_120px_120px]' },
  { label: 'Row', recipe: 'hidden lg:grid gap-4 px-4 py-4 items-center hover:bg-ditto-light-grey rounded-2xl transition-colors cursor-pointer (same grid-cols)' },
  { label: 'Identity cell', recipe: 'flex items-center gap-4 + img w-16 h-16 rounded-lg object-cover + p text-base font-medium truncate max-w-[220px]' },
  { label: 'Mobile twin', recipe: 'lg:hidden flex items-center gap-3 px-2 py-3 hover:bg-ditto-light-grey rounded-xl — artwork w-12 h-12, figures abbreviated' },
  { label: 'Money cell', recipe: 'text-center text-base font-semibold text-ditto-purple (royalties tables)' },
  { label: 'Real <table>', recipe: 'components/common/StoresTable.vue — { stores, selectedStore } @select · selected row bg-ditto-purple/5' },
]

// ── Forms ──
const demoSearch = ref('')
const demoSelect = ref('')
const demoText = ref('')
const demoToggle = ref(true)
const demoRadio = ref(true)

const formRecipes = [
  { label: 'SearchInput', recipe: "components/common/SearchInput.vue — { modelValue, placeholder?, widthClass? } · NOT artists/SearchInput (legacy)" },
  { label: 'Underline field', recipe: 'label text-xs text-gray-500 + input w-full py-2 text-sm border-b border-gray-200 focus:border-ditto-purple focus:outline-none' },
  { label: 'SearchableSelect', recipe: 'views/videos/steps/SearchableSelect.vue — { modelValue, options, placeholder?, error?, searchable? } · underline trigger + rounded-xl shadow-lg menu' },
  { label: 'CustomDropdown', recipe: 'TWO exist: components/neighbouring-rights/ (grouped+search, SCSS) vs components/release-services/ — check before importing' },
  { label: 'ToggleSwitch', recipe: 'components/artists/ToggleSwitch.vue — { modelValue } · w-12 h-7, on bg-success · (nav menus use a smaller inline w-8 h-[18px] variant)' },
  { label: 'Radio/check', recipe: 'w-5 h-5 rounded-full border-2 + selected border-ditto-purple bg-ditto-purple + white tick svg (FiltersPanel)' },
  { label: 'DateRangePicker', recipe: 'components/common/DateRangePicker.vue — { modelValue: {start,end} DD/MM/YYYY } · desktop popover + mobile bottom sheet' },
  { label: 'GlobalSearch', recipe: "components/layout/GlobalSearch.vue — ⌘K palette · renders only when navStyle === 'side', needs relative page root + appNav inject" },
]

const cardRecipes = [
  { label: 'Bordered card', recipe: 'bg-white rounded-2xl border border-gray-200 p-6' },
  { label: 'Shadow tile', recipe: 'rounded-2xl bg-white shadow-[0_2px_14px_rgba(16,31,60,0.08)] hover:shadow-[0_12px_32px_rgba(95,31,255,0.18)] hover:-translate-y-1 transition-all duration-200' },
  { label: 'Money surface', recipe: 'rounded-3xl text-white + mesh gradient (see Gradients) + ring-1 ring-inset ring-white/15 overlay' },
]

// ── Media ──
const mediaRecipes = [
  { label: 'Artwork card', recipe: 'group hover:-translate-y-1.5 > span relative rounded-2xl overflow-hidden clip-radius-stable + img aspect-square group-hover:scale-[1.05] duration-500' },
  { label: 'Artist circle', recipe: 'w-28 h-28 rounded-full overflow-hidden clip-radius-stable ring-1 ring-gray-200 group-hover:ring-[3px] group-hover:ring-ditto-purple' },
  { label: 'InitialsAvatar', recipe: 'components/common/InitialsAvatar.vue — { name, textClass? } · fills any shaped parent, deterministic 5-pair palette' },
  { label: 'Create card', recipe: 'aspect-square rounded-2xl border-2 border-dashed border-gray-300 hover:border-ditto-purple hover:text-ditto-purple' },
  { label: 'Scroll rail', recipe: 'flex gap-5 overflow-x-auto scrollbar-hide snap-x scroll-smooth -mt-3 pt-3 -mx-4 px-4 scroll-px-4 (negative margins bleed to viewport edge; -mt/pt give hover headroom)' },
]

const listRecipe = 'flex items-center gap-4 px-4 py-4 hover:bg-ditto-light-grey rounded-2xl transition-colors — avatar w-10 h-10 rounded-full bg-ditto-purple/10 · title text-sm font-medium · detail text-xs text-ditto-subtext'

// ── Overlays ──
const overlayRecipes = [
  { label: 'Modal', recipe: 'fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 @click.self=close > bg-white rounded-3xl shadow-2xl max-w-lg px-10 py-9 relative' },
  { label: 'Slide-over', recipe: "components/common/FiltersPanel.vue — fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 · transitions fade (backdrop) + slide (translateX 100%)" },
  { label: 'Drawer', recipe: 'components/basket/MiniBasket.vue — Teleport + fixed right, 22rem, z-1060, cubic-bezier(0.22,1,0.36,1)' },
  { label: 'Menu flyout', recipe: 'absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 py-1.5 z-50 · item px-4 py-2.5 text-sm hover:bg-ditto-light-grey (SideNav uses fixed + computed position)' },
  { label: 'Tooltip', recipe: 'fixed z-[70] px-2.5 py-1.5 rounded-lg bg-[#101f3c] text-white text-xs font-medium whitespace-nowrap pointer-events-none' },
]

// ── Wizard ──
const wizardSteps = [
  { n: 1, label: 'Details', bar: 'border-ditto-text text-ditto-text', num: 'text-ditto-text' },
  { n: 2, label: 'Upload', bar: 'border-ditto-purple text-ditto-text', num: 'text-ditto-purple' },
  { n: 3, label: 'Artwork', bar: 'border-warning text-warning', num: 'text-warning' },
  { n: 4, label: 'Review', bar: 'border-transparent text-ditto-subtext', num: 'text-ditto-subtext/60' },
]
const wizardRecipes = [
  { label: 'Step button', recipe: 'flex-1 flex flex-col items-center gap-0.5 pb-3 pt-1 text-sm font-medium border-b-[3px] · current border-ditto-purple / complete border-ditto-text / error border-warning / untouched border-transparent text-ditto-subtext' },
  { label: 'Bar', recipe: 'sticky top-0 z-20 bg-white border-b border-gray-200 (see views/music/builder/ReleaseBuilderView.vue — video builder duplicates it, not shared)' },
  { label: 'Footer nav', recipe: 'sticky bottom-0 z-20 bg-white border-t border-gray-200 py-4 · Back: rounded-full border · Next: bg-ditto-purple btn-pop-purple' },
  { label: 'Numbered stepper', recipe: 'components/neighbouring-rights/StepIndicator.vue — { currentStep, labels? } · 2rem circles, active bg brand-primary, completed tick' },
]

// ── Feedback ──
const feedbackRecipes = [
  { label: 'Toast', recipe: 'components/ui/Toast.vue — { visible, message, type: success|info|warning } · Teleport to body, auto-dismiss ~2s' },
  { label: 'EmptyState', recipe: "components/common/EmptyState.vue — { type?: 'no-results'|'no-data'|'info', title, message, actionLabel? } @action" },
  { label: 'NewUserEmptyState', recipe: 'components/common/NewUserEmptyState.vue — { title, message, ctaLabel?, icon? (suite svg path) } @cta · gated by useDemoUser().isNewUser' },
  { label: 'Ghost tiles', recipe: 'v-for n placeholder divs bg-ditto-light-grey + :style opacity 1 − n × 0.16 (rails/grids when empty)' },
  { label: 'SkeletonLoader', recipe: "components/common/SkeletonLoader.vue — { type?: 'stats'|'chart'|'table'|'cards'|'full', rows? } · exists but currently unused" },
]

// ── Motion ──
const motionCount = useCountUp(24318)
const motionRecipes = [
  { label: 'Tile lift', recipe: 'hover:-translate-y-1 + shadow-[0_2px_14px…] → hover:shadow-[0_12px_32px_rgba(95,31,255,0.18)] duration-200' },
  { label: 'Stat scale', recipe: 'hover:scale-[1.02] hover:shadow-lg transition-all duration-200' },
  { label: 'Artwork zoom', recipe: 'parent overflow-hidden clip-radius-stable (translateZ(0) — stops WebKit squaring corners) + child group-hover:scale-[1.05] duration-500' },
  { label: 'useCountUp', recipe: 'useCountUp(target, {duration=750, delay=80}) → Ref<number> · render .toLocaleString() + tabular-nums, decimals as static span' },
  { label: 'Gradient shift', recipe: '@keyframes gradient-shift (background-position 0%→100%→0%) 3s ease infinite + background-size 200% 200% — scoped per component, define locally' },
  { label: 'Sheen sweep', recipe: 'absolute inset-0 bg-white/15 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12' },
  { label: 'Rail scroll', recipe: "rail.scrollBy({ left: dir * clientWidth * 0.8, behavior: 'smooth' }) + snap-x scroll-smooth + w-9 h-9 arrow buttons" },
]

// ── Icons / gradients / gotchas ──
const suiteIcons = [
  'distro.svg', 'add-artist.svg', 'Royalties.svg', 'Smartlinks.svg', 'perks.svg',
  'promo.svg', 'publishing.svg', 'sync.svg', 'playlisting.svg', 'release-protection.svg',
  'music-video-distro.svg', 'promo-design-studio.svg',
]

const gradients = [
  { label: 'Money mesh', class: 'pattern-mesh', style: '', note: 'Balance & referral cards' },
  { label: 'Ink banner', class: 'pattern-ink', style: '', note: 'Announcements, post-cap' },
  { label: 'Create sweep', class: 'pattern-create', style: '', note: 'Create button, animated' },
  { label: 'Ink stat', class: '', style: 'background: linear-gradient(145deg, #26262e, #0a0a0a 80%)', note: 'Home stat card' },
  { label: 'Electric purple', class: '', style: 'background: linear-gradient(145deg, #6d28ff, #4A00FF 85%)', note: 'Home stat card' },
  { label: 'Ink navy', class: '', style: 'background: linear-gradient(145deg, #1c2f56, #101f3c 80%)', note: 'Home stat card' },
]

const gotchas = [
  'Two components named <code class="text-xs">CustomDropdown</code> (neighbouring-rights vs release-services) and two named <code class="text-xs">SearchInput</code> (common = canonical, artists = legacy).',
  '<code class="text-xs">RoyaltiesStatsCard</code> is imported <em>as</em> <code class="text-xs">StatsCard</code> in royalties/OverviewView — easy to grab the wrong one.',
  'Half the components are Tailwind-inline, half SCSS/BEM (basket, royalty-splits, neighbouring-rights, release-services, Toast). The SCSS ones need the globally-injected Sass variables from vite.config — they will not render standalone.',
  'Dark mode = CSS-variable re-targeting + a raw-utility retarget layer in tailwind.css. Never write <code class="text-xs">dark:</code> variants.',
  'No sortable table headers and no sparkline component exist — ordering is pre-baked into mock data; the progress ring / proportion bar stand in for sparklines.',
  'Transitions are defined per component (fade, slide, sheet, toast, modal, dropdown, mini-basket-*) — there is no shared transition stylesheet, so copy the scoped CSS with the component.',
]

// ── Copy-to-clipboard with toast confirmation ──
const showToast = ref(false)
const toastMessage = ref('')
let toastTimer: ReturnType<typeof setTimeout> | undefined

const flash = (msg: string) => {
  toastMessage.value = msg
  showToast.value = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { showToast.value = false }, 1800)
}

const copy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    /* clipboard unavailable in some embedded contexts */
  }
  flash('Recipe copied to clipboard')
}

const demoToastFire = () => flash('This is the shared Toast component')
</script>

<style scoped>
/* The sanctioned gradient recipes, kept verbatim from their sources */
.pattern-mesh {
  background:
    radial-gradient(75% 95% at 0% 0%, #2a0a8c 0%, rgba(42, 10, 140, 0) 62%),
    radial-gradient(65% 80% at 104% 96%, #d6bcff 0%, rgba(214, 188, 255, 0) 58%),
    radial-gradient(60% 70% at 96% 18%, #a879ff 0%, rgba(168, 121, 255, 0) 55%),
    radial-gradient(55% 60% at 62% 78%, #7d3bff 0%, rgba(125, 59, 255, 0) 58%),
    linear-gradient(120deg, #3a12a8 0%, #5f1fff 52%, #9c6dff 100%);
}
.pattern-ink {
  background:
    radial-gradient(70% 90% at 100% 0%, rgba(95, 31, 255, 0.55) 0%, rgba(95, 31, 255, 0) 60%),
    radial-gradient(60% 80% at 0% 100%, rgba(40, 126, 247, 0.35) 0%, rgba(40, 126, 247, 0) 55%),
    linear-gradient(120deg, #0d1830 0%, #101f3c 55%, #1c2f5c 100%);
}
.pattern-create {
  background: linear-gradient(135deg, #5f1fff, #8640f4, #a855f7);
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.animate-gradient-shift {
  animation: gradient-shift 3s ease infinite;
}
</style>
