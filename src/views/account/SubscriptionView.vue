<template>
  <div class="max-w-[1200px]">
    <!-- Header — the marketing page's "Pricing. Pick a plan." adapted -->
    <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8 lg:mb-10">
      <h1 class="font-satoshi font-black text-4xl sm:text-5xl lg:text-[64px] leading-[0.95] tracking-[-0.04em] text-ditto-text">
        Subscription.<br />
        <span class="text-ditto-purple">Pick a plan.</span>
      </h1>
      <div class="lg:text-right lg:max-w-xs lg:border-t lg:border-gray-200 lg:pt-4">
        <p class="text-sm font-bold text-ditto-text">One price. Unlimited releases.</p>
        <p class="text-sm text-ditto-subtext mt-1">100% royalties and our industry-leading artist tools. Included with every plan.</p>
      </div>
    </div>

    <!-- Plan cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
      <div
        v-for="plan in plans"
        :key="plan.id"
        :class="[
          'relative rounded-3xl p-7 flex flex-col',
          plan.id === 'starter' ? 'bg-white border border-gray-200' :
          plan.id === 'pro' ? 'bg-[#E6FF3A] text-[#0a0a0a] md:-mt-3' :
          'bg-[#0a0a0a] text-white'
        ]"
      >
        <!-- Most popular tab -->
        <span
          v-if="plan.mostPopular"
          class="absolute -top-3 left-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a0a0a] text-white text-[10px] font-bold uppercase tracking-[0.14em]"
        >
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/></svg>
          Most popular
        </span>
        <!-- Current plan tab -->
        <span
          v-if="isCurrent(plan)"
          class="absolute -top-3 right-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ditto-purple text-white text-[10px] font-bold uppercase tracking-[0.14em]"
        >
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Current plan
        </span>

        <p class="font-mono text-[11px] font-bold uppercase tracking-[0.18em]" :class="plan.id === 'label' ? 'text-white/70' : 'text-ditto-subtext'">// // {{ plan.eyebrow }}</p>

        <!-- Price -->
        <p class="mt-4 flex items-baseline gap-1">
          <span class="font-satoshi font-black text-5xl lg:text-[56px] tracking-[-0.04em] leading-none">£{{ displayPrice(plan) }}</span>
          <span class="text-sm font-medium" :class="plan.id === 'label' ? 'text-white/70' : 'text-ditto-subtext'">/year</span>
        </p>
        <p v-if="plan.id === 'label'" class="text-sm mt-2 text-white/85">For up to <span class="font-black text-white">{{ labelTier.artists }}</span> artists</p>

        <p class="text-sm mt-3 leading-relaxed" :class="plan.id === 'label' ? 'text-white/75' : plan.id === 'pro' ? 'text-[#0a0a0a]/75' : 'text-ditto-subtext'">{{ plan.blurb }}</p>

        <!-- Labels: artist slider -->
        <div v-if="plan.id === 'label'" class="mt-5">
          <input
            v-model.number="labelTierIndex"
            type="range"
            min="0"
            :max="labelTiers.length - 1"
            step="1"
            class="label-slider w-full"
            aria-label="Number of artists"
          />
          <div class="flex justify-between mt-1.5 px-0.5">
            <span
              v-for="(tier, i) in labelTiers"
              :key="tier.artists"
              class="text-[11px] font-semibold tabular-nums"
              :class="i === labelTierIndex ? 'text-[#E6FF3A]' : 'text-white/50'"
            >{{ tier.artists }}</span>
          </div>
        </div>

        <!-- CTA (dashboard rules decide the label and state) -->
        <button
          :disabled="cta(plan).disabled"
          @click="choose(plan)"
          :class="[
            'mt-6 w-full py-3.5 rounded-full text-sm font-bold uppercase tracking-[0.08em] transition-transform',
            cta(plan).disabled
              ? (plan.id === 'label' ? 'border border-white/30 text-white/50 cursor-not-allowed' : 'border border-gray-300 text-ditto-subtext cursor-not-allowed')
              : plan.id === 'label' ? 'bg-[#E6FF3A] text-[#0a0a0a] hover:-translate-y-0.5' : 'bg-[#0a0a0a] text-white hover:-translate-y-0.5'
          ]"
        >{{ cta(plan).label }}</button>

        <!-- Downgrade blocked: the dashboard's Plan Artists rule -->
        <div
          v-if="cta(plan).blocked"
          class="mt-4 rounded-xl border border-error/50 bg-error/5 p-3.5 flex items-start gap-2.5"
        >
          <svg class="w-4 h-4 text-error flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <p class="text-xs leading-relaxed" :class="plan.id === 'label' ? 'text-white/85' : 'text-ditto-text'">
            You have more Plan Artists ({{ subscription.planArtists }}) than this plan allows ({{ planArtistLimit(plan) }}). Remove some Plan Artists before downgrading.
          </p>
        </div>

        <!-- Features -->
        <p class="mt-7 text-sm font-bold" :class="plan.id === 'label' ? 'text-white' : ''">{{ plan.featuresIntro }}</p>
        <ul class="mt-3 space-y-2.5">
          <li v-for="feature in planFeatures(plan)" :key="feature" class="flex items-start gap-2.5 text-sm">
            <span
              class="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              :class="plan.id === 'label' ? 'bg-ditto-purple text-white' : 'bg-[#E6FF3A] text-[#0a0a0a] ring-1 ring-inset ring-[#0a0a0a]/10'"
            >
              <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <span :class="plan.id === 'label' ? 'text-white/85' : plan.id === 'pro' ? 'text-[#0a0a0a]/85' : 'text-ditto-text'">{{ feature }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Perks strip -->
    <div class="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-8 mb-6">
      <span v-for="perk in perks" :key="perk" class="inline-flex items-center gap-2 text-xs font-semibold text-ditto-text">
        <span class="flex gap-0.5"><span class="w-1 h-1 rounded-full bg-ditto-purple"></span><span class="w-1 h-1 rounded-full bg-ditto-purple"></span></span>
        {{ perk }}
      </span>
    </div>

    <!-- Renewal note for the current plan -->
    <p class="text-center text-xs text-ditto-subtext mb-14">
      You're on <span class="font-semibold text-ditto-text">{{ currentPlanName }}</span> — renews {{ subscription.renewsOn }}.
      Upgrades and downgrades are prorated, and you can pay renewals from your royalty balance in Account Settings.
    </p>

    <Toast :visible="toast.visible" :message="toast.message" type="success" @close="toast.visible = false" />

    <!-- Prototype-only: flip the account's current plan -->
    <div class="fixed bottom-4 left-4 z-50 flex items-center gap-1 bg-white border border-gray-200 rounded-full shadow-lg px-1.5 py-1">
      <span class="text-[10px] font-semibold uppercase tracking-wide text-ditto-subtext px-1.5">Demo</span>
      <button
        v-for="state in demoStateOptions"
        :key="state.id"
        @click="demoState = state.id"
        class="px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors"
        :class="demoState === state.id ? 'bg-ditto-text text-white dark:text-[#16161d]' : 'text-ditto-subtext hover:bg-ditto-light-grey'"
      >{{ state.label }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import Toast from '../../components/ui/Toast.vue'
import {
  plans,
  labelTiers,
  perks,
  planRank,
  subscriptionDemoStates,
  type Plan,
  type SubscriptionDemoState,
} from '../../data/subscriptionMockData'

// Demo state: ?plan=starter|pro|label5, defaulting to the label account
const urlParams = new URLSearchParams(window.location.search)
const paramState = urlParams.get('plan') as SubscriptionDemoState | null
const demoState = ref<SubscriptionDemoState>(paramState && paramState in subscriptionDemoStates ? paramState : 'label5')
const demoStateOptions: { id: SubscriptionDemoState; label: string }[] = [
  { id: 'starter', label: 'On Starter' },
  { id: 'pro', label: 'On Pro' },
  { id: 'label5', label: 'On Label 5' },
]
const subscription = computed(() => subscriptionDemoStates[demoState.value])

// Labels slider — starts on the account's own tier when it's a label plan
const labelTierIndex = ref(0)
watch(subscription, (s) => {
  labelTierIndex.value = s.planId === 'label' ? Math.max(0, labelTiers.findIndex(t => t.artists === s.labelArtists)) : 0
}, { immediate: true })
const labelTier = computed(() => labelTiers[labelTierIndex.value])

const displayPrice = (plan: Plan) => (plan.id === 'label' ? labelTier.value.price : plan.price)
const planArtistLimit = (plan: Plan) => (plan.id === 'label' ? labelTier.value.artists : plan.artists)
const planFeatures = (plan: Plan) =>
  plan.id === 'label' ? [`Unlimited releases for ${labelTier.value.artists} artists`] : plan.features

const targetName = (plan: Plan) => (plan.id === 'label' ? `Label ${labelTier.value.artists}` : plan.name)
const currentPlanName = computed(() =>
  subscription.value.planId === 'label' ? `Label ${subscription.value.labelArtists}` : plans.find(p => p.id === subscription.value.planId)?.name ?? ''
)

const isCurrent = (plan: Plan) =>
  plan.id === subscription.value.planId &&
  (plan.id !== 'label' || labelTier.value.artists === subscription.value.labelArtists)

// Dashboard rules: current plan is locked; downgrades need the Plan Artists to fit
const cta = (plan: Plan): { label: string; disabled: boolean; blocked: boolean } => {
  if (isCurrent(plan)) return { label: `You're on ${targetName(plan)}`, disabled: true, blocked: false }
  const target = planRank(plan.id, planArtistLimit(plan))
  const current = planRank(subscription.value.planId, subscription.value.labelArtists)
  if (target > current) return { label: `Upgrade to ${targetName(plan)}`, disabled: false, blocked: false }
  if (subscription.value.planArtists > planArtistLimit(plan)) return { label: 'Not allowed', disabled: true, blocked: true }
  return { label: `Downgrade to ${targetName(plan)}`, disabled: false, blocked: false }
}

const toast = reactive({ visible: false, message: '' })
let toastTimer: ReturnType<typeof setTimeout> | undefined
const choose = (plan: Plan) => {
  const c = cta(plan)
  if (c.disabled) return
  toast.message = `${c.label} — checkout would open here (prototype)`
  toast.visible = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.visible = false }, 2600)
}
</script>

<style scoped>
/* Labels slider: purple fill on the black card, lime thumb */
.label-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.18);
  outline: none;
}
.label-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #E6FF3A;
  border: 3px solid #0a0a0a;
  box-shadow: 0 0 0 2px #E6FF3A;
  cursor: pointer;
}
.label-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #E6FF3A;
  border: 3px solid #0a0a0a;
  box-shadow: 0 0 0 2px #E6FF3A;
  cursor: pointer;
}
</style>
