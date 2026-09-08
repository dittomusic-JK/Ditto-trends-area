<template>
  <!-- Straight port of the marketing pricing block (ditto-web PricingBlock +
       styles/homepage.css .pricing / .tier) with the live dashboard's rules
       layered on: current plan locked, downgrades gated by Plan Artists. -->
  <div class="pricing">
    <div class="pricing-head">
      <h1 class="h-mega">
        Subscription.<br />
        <span class="purple-deep">Pick a plan.</span>
      </h1>
      <div class="pricing-cap">
        <strong>One price. Unlimited releases.</strong>
        100% royalties and our industry-leading artist tools. Included with every plan.
      </div>
    </div>

    <div class="tier-grid">
      <div
        v-for="plan in plans"
        :key="plan.id"
        class="tier"
        :class="{ pro: plan.id === 'pro', labels: plan.id === 'label', current: isCurrent(plan) }"
      >
        <span v-if="plan.mostPopular" class="badge">★ Most popular</span>
        <span v-if="isCurrent(plan)" class="badge badge--current">Current plan</span>

        <div class="tier-name">// // {{ plan.eyebrow }}</div>

        <div class="tier-price">
          <div class="num"><span class="currency">£</span>{{ displayPrice(plan) }}</div>
          <div class="per">/year</div>
        </div>
        <p v-if="plan.id === 'label'" class="labels-count">For up to <strong>{{ labelTier.artists }}</strong> artists</p>
        <p class="tier-tag">{{ plan.blurb }}</p>

        <!-- Labels: artist-count slider (same anatomy as the marketing LabelsSlider) -->
        <div v-if="plan.id === 'label'" class="labels-slider">
          <input
            v-model.number="labelTierIndex"
            type="range"
            min="0"
            :max="labelTiers.length - 1"
            step="1"
            class="labels-slider-input"
            aria-label="Choose how many artists you want to manage"
          />
          <div class="labels-slider-scale" aria-hidden="true">
            <span v-for="(tier, i) in labelTiers" :key="tier.artists" :class="{ active: i === labelTierIndex }">{{ tier.artists }}</span>
          </div>
        </div>

        <!-- CTA: dashboard rules decide label + state -->
        <button
          class="tier-cta"
          :class="{ 'tier-cta--disabled': cta(plan).disabled }"
          :disabled="cta(plan).disabled"
          @click="choose(plan)"
        >{{ cta(plan).label }}</button>

        <div v-if="cta(plan).blocked" class="tier-warn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span>You have more Plan Artists ({{ subscription.planArtists }}) than this plan allows ({{ planArtistLimit(plan) }}). Remove some Plan Artists before downgrading.</span>
        </div>

        <ul>
          <li v-if="plan.id !== 'starter'" class="muted">{{ plan.featuresIntro.replace(', plus:', '') }}</li>
          <li v-for="feature in planFeatures(plan)" :key="feature">{{ feature }}</li>
        </ul>
      </div>
    </div>

    <div class="pricing-foot">
      <span v-for="perk in perks" :key="perk">{{ perk }}</span>
    </div>

    <p class="pricing-note">
      You're on <strong>{{ currentPlanName }}</strong> — renews {{ subscription.renewsOn }}.
      Upgrades and downgrades are prorated, and renewals can be paid from your royalty balance in Account Settings.
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
/* Tokens from ditto-web styles/theme.css */
.pricing {
  --ink: #0a0a0a;
  --ink-soft: #3a3a3a;
  --line: #262626;
  --line-light: #e6e6e2;
  --lime: #e6ff3a;
  --purple: #a06bff;
  --purple-deep: #4a00ff;
  --muted-2: #cfcfcf;
  max-width: 1160px;
  color: var(--ink);
  font-family: 'Satoshi', 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* Head */
.pricing-head {
  display: grid;
  grid-template-columns: 1.4fr auto;
  gap: 48px;
  align-items: end;
  margin-bottom: 56px;
}
.h-mega {
  font-weight: 900;
  font-size: clamp(44px, 6.2vw, 84px);
  line-height: 0.94;
  letter-spacing: -3px;
  margin: 0;
}
.h-mega .purple-deep { color: var(--purple-deep); }
.pricing-cap {
  font-size: 14px;
  line-height: 1.6;
  color: var(--ink-soft);
  max-width: 280px;
  text-align: right;
  border-top: 1px solid var(--line-light);
  padding-top: 20px;
}
.pricing-cap strong {
  color: var(--ink);
  font-weight: 700;
  display: block;
  margin-bottom: 6px;
  letter-spacing: -0.2px;
}

/* Tiers — equal heights come from grid stretch + the feature list flexing */
.tier-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: stretch;
}
.tier {
  background: #fff;
  border: 1.5px solid var(--line-light);
  border-radius: 24px;
  padding: 40px 36px 36px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.25s ease, border-color 0.25s ease;
}
.tier:hover { transform: translateY(-4px); border-color: var(--ink); }
.tier .tier-name {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2.4px;
  text-transform: uppercase;
  color: var(--ink);
  margin-bottom: 24px;
}
.tier .tier-price { display: flex; align-items: flex-end; gap: 8px; margin-bottom: 14px; }
.tier .tier-price .num {
  font-weight: 900;
  font-size: 84px;
  line-height: 0.9;
  letter-spacing: -3.5px;
  color: var(--ink);
}
.tier .tier-price .num .currency { font-size: 42px; line-height: 1; letter-spacing: 0; vertical-align: top; margin-right: 2px; }
.tier .tier-price .per { font-size: 14px; font-weight: 600; color: var(--ink-soft); padding-bottom: 12px; }
.tier .tier-tag { font-size: 15px; line-height: 1.5; color: var(--ink-soft); margin: 0 0 28px 0; max-width: 280px; }
.tier .tier-cta {
  display: block;
  width: 100%;
  text-align: center;
  background: var(--ink);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  padding: 18px 24px;
  border-radius: 60px;
  transition: transform 0.2s ease, background 0.2s ease;
}
.tier .tier-cta:hover:not(:disabled) { transform: translateY(-2px); }
.tier .tier-cta--disabled { background: transparent; color: var(--ink-soft); border: 1.5px solid var(--line-light); cursor: not-allowed; }
.tier ul {
  list-style: none;
  padding: 28px 0 0;
  margin: 32px 0 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  border-top: 1px solid var(--line-light);
  flex: 1;
}
.tier ul li { font-size: 14px; line-height: 1.5; color: var(--ink); padding-left: 28px; position: relative; font-weight: 500; }
.tier ul li::before { content: ''; position: absolute; left: 0; top: 4px; width: 18px; height: 18px; border-radius: 50%; background: var(--lime); }
.tier ul li::after { content: ''; position: absolute; left: 5px; top: 9px; width: 8px; height: 4px; border-left: 2px solid var(--ink); border-bottom: 2px solid var(--ink); transform: rotate(-45deg); }
.tier ul li.muted { color: var(--ink-soft); font-weight: 400; }

/* Blocked-downgrade warning (dashboard rule) */
.tier .tier-warn {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  border: 1px solid rgba(238, 64, 76, 0.55);
  background: rgba(238, 64, 76, 0.06);
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 12.5px;
  line-height: 1.45;
  color: var(--ink);
}
.tier .tier-warn svg { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; color: #ee404c; }

/* Badges */
.tier .badge {
  position: absolute;
  top: -14px;
  left: 36px;
  background: var(--ink);
  color: var(--lime);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  padding: 8px 14px;
  border-radius: 30px;
}
.tier .badge--current { left: auto; right: 36px; background: var(--purple-deep); color: #fff; }

/* Pro */
.tier.pro { background: var(--lime); border-color: var(--lime); transform: translateY(-12px); }
.tier.pro:hover { transform: translateY(-16px); }
.tier.pro ul { border-top-color: rgba(10, 10, 10, 0.18); }
.tier.pro ul li::before { background: var(--ink); }
.tier.pro ul li::after { border-color: var(--lime); }
.tier.pro .tier-cta { background: var(--ink); color: var(--lime); }
.tier.pro .tier-cta--disabled { background: transparent; color: rgba(10, 10, 10, 0.55); border-color: rgba(10, 10, 10, 0.25); }
.tier.pro .tier-cta:hover:not(:disabled) { background: #000; }

/* Labels */
.tier.labels { background: var(--ink); color: #fff; border-color: var(--ink); }
.tier.labels .tier-name, .tier.labels .tier-price .num { color: #fff; }
.tier.labels .tier-price .per, .tier.labels .tier-tag { color: var(--muted-2); }
.tier.labels ul { border-top-color: var(--line); }
.tier.labels ul li { color: #fff; }
.tier.labels ul li.muted { color: var(--muted-2); }
.tier.labels ul li::before { background: var(--purple); }
.tier.labels ul li::after { border-color: var(--ink); }
.tier.labels .tier-cta { background: var(--lime); color: var(--ink); }
.tier.labels .tier-cta--disabled { background: transparent; color: rgba(255, 255, 255, 0.55); border-color: rgba(255, 255, 255, 0.28); }
.tier.labels .tier-warn { color: #fff; background: rgba(238, 64, 76, 0.14); }
.labels-count { margin: -6px 0 10px; font-size: 14px; color: rgba(255, 255, 255, 0.85); }
.labels-count strong { color: var(--lime); font-weight: 800; font-size: 16px; }
.labels-slider { display: flex; flex-direction: column; gap: 10px; margin: -8px 0 22px; }
.labels-slider-input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  outline: none;
  margin: 4px 0 0;
}
.labels-slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--lime); border: 2px solid #0a0a0a; cursor: pointer; transition: transform 150ms ease;
}
.labels-slider-input::-webkit-slider-thumb:hover { transform: scale(1.1); }
.labels-slider-input::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: var(--lime); border: 2px solid #0a0a0a; cursor: pointer; }
.labels-slider-scale { display: flex; justify-content: space-between; font-size: 11px; color: rgba(255, 255, 255, 0.5); letter-spacing: 0.04em; }
.labels-slider-scale .active { color: var(--lime); font-weight: 700; }

/* Footer strip + note */
.pricing-foot { margin-top: 48px; display: flex; justify-content: center; align-items: center; gap: 32px; font-size: 13px; color: var(--ink-soft); flex-wrap: wrap; }
.pricing-foot span { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; }
.pricing-foot span::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--purple-deep); }
.pricing-note { margin: 20px 0 56px; text-align: center; font-size: 13px; color: var(--ink-soft); }
.pricing-note strong { color: var(--ink); font-weight: 700; }

@media (max-width: 1023px) {
  .pricing-head { grid-template-columns: 1fr; gap: 20px; margin-bottom: 36px; }
  .pricing-cap { text-align: left; max-width: none; }
  .tier-grid { grid-template-columns: 1fr; }
  .tier.pro { transform: none; }
  .tier.pro:hover { transform: translateY(-4px); }
  .tier { padding: 32px 26px 28px; }
  .tier .tier-price .num { font-size: 64px; }
}
</style>
