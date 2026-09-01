<template>
  <Teleport to="body">
    <div class="fsm-overlay" @click="$emit('close')">
      <div class="fsm" :class="{ 'fsm--rls': isRLS }" @click.stop>
        <h2 class="fsm__title" :class="{ 'fsm__title--rls': isRLS }">You've set up your first split! 🎉</h2>
        <p class="fsm__subtitle" :class="{ 'fsm__subtitle--rls': isRLS }">Here is how it works:</p>

        <!-- One flow for RLS users: email -> free account -> paid -->
        <div class="fsm__steps">
          <div class="fsm__step">
            <div class="fsm__step-icon fsm__step-icon--blue">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="#287EF7" stroke-width="1.6"/><path d="M2 4.5L8 9L14 4.5" stroke="#287EF7" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div>
              <p class="fsm__step-title" :class="{ 'fsm__step-title--rls': isRLS }">We'll email your collaborators</p>
              <p class="fsm__step-desc" :class="{ 'fsm__step-desc--rls': isRLS }">They'll receive an email about their split</p>
            </div>
          </div>
          <div class="fsm__step">
            <div class="fsm__step-icon fsm__step-icon--amber">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="5" r="2.75" stroke="#F59E0B" stroke-width="1.6"/><path d="M1.5 14C1.5 11.5 3.5 9.75 6.5 9.75C7.3 9.75 8.05 9.87 8.7 10.1" stroke="#F59E0B" stroke-width="1.6" stroke-linecap="round"/><path d="M12 9.5V14.5M9.5 12H14.5" stroke="#F59E0B" stroke-width="1.6" stroke-linecap="round"/></svg>
            </div>
            <div>
              <p class="fsm__step-title" :class="{ 'fsm__step-title--rls': isRLS }">They create a free Ditto account</p>
              <p class="fsm__step-desc" :class="{ 'fsm__step-desc--rls': isRLS }">We'll hold onto their share until they sign up</p>
            </div>
          </div>
          <div class="fsm__step">
            <div class="fsm__step-icon fsm__step-icon--purple">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="4" width="13" height="8" rx="1.5" stroke="#6C5CE7" stroke-width="1.6"/><circle cx="8" cy="8" r="1.9" stroke="#6C5CE7" stroke-width="1.6"/><path d="M4 8H4.01M12 8H12.01" stroke="#6C5CE7" stroke-width="1.8" stroke-linecap="round"/></svg>
            </div>
            <div>
              <p class="fsm__step-title" :class="{ 'fsm__step-title--rls': isRLS }">Everyone gets paid</p>
              <p class="fsm__step-desc" :class="{ 'fsm__step-desc--rls': isRLS }">Your collaborators can withdraw their royalties</p>
            </div>
          </div>
        </div>

        <button @click="$emit('close')" class="fsm__cta" :class="{ 'fsm__cta--rls': isRLS }">Got it</button>

        <button v-if="otherTracksCount > 0" @click="$emit('copy-to-all')" class="fsm__copy-link" :class="{ 'fsm__copy-link--rls': isRLS }">
          or Copy this split to {{ otherTracksCount === 1 ? '1 other track' : `all ${otherTracksCount} other tracks` }} →
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  otherTracksCount: number
  isRLS?: boolean
}>()

defineEmits<{
  close: []
  'copy-to-all': []
}>()
</script>

<style lang="scss" scoped>
.fsm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.fsm {
  border-radius: $radius-card;
  padding: 1rem;
  width: 100%;
  max-width: 95vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  margin: 0 0.5rem;
  background: var(--ditto-colors-light-dark-ditto-background-white);

  @include sm { padding: 1.5rem; width: 440px; margin: 0; }

  &--rls { background: var(--rls-card); }

  &__title {
    font-size: $text-h4;
    font-weight: 900;
    font-family: $font-satoshi;
    letter-spacing: -0.03em;
    margin-bottom: 1rem;
    color: var(--blue);

    @include sm { font-size: $text-h3; }
    &--rls { color: var(--rls-text); }
  }

  &__subtitle {
    font-size: $text-sm;
    font-weight: 500;
    font-family: $font-satoshi;
    margin-bottom: 0.75rem;
    color: var(--blue);

    &--rls { color: var(--rls-text); }
  }

  &__steps {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  &__step {
    display: flex;
    gap: 0.75rem;
  }

  &__step-icon {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &--blue { background: rgba($color-brand-secondary, 0.1); }
    &--amber { background: $color-amber-100; }
    &--purple { background: rgba($color-ditto-purple, 0.1); }
  }

  &__step-title {
    font-size: $text-sm;
    font-weight: 500;
    color: var(--blue);
    font-family: $font-satoshi;

    &--rls { color: var(--rls-text); }
  }

  &__step-desc {
    font-size: $text-xs;
    color: var(--ditto-grey);
    font-family: $font-satoshi;

    &--rls { color: var(--rls-text-secondary); }
  }

  &__cta {
    width: 100%;
    padding: 0.75rem 1.5rem;
    color: #fff;
    border-radius: $radius-button;
    font-size: $text-sm;
    font-weight: 600;
    font-family: $font-satoshi;
    transition: background 0.15s;
    background: $color-ditto-purple;

    &:hover { background: rgba($color-ditto-purple, 0.9); }
    &--rls {
      background: var(--rls-accent);
      &:hover { background: rgba($color-rls-accent, 0.9); }
    }
  }

  &__copy-link {
    width: 100%;
    margin-top: 0.75rem;
    font-size: $text-sm;
    font-weight: 500;
    font-family: $font-satoshi;
    color: $color-ditto-purple;
    transition: color 0.15s;

    &:hover { text-decoration: underline; }
    &--rls { color: var(--rls-accent); }
  }
}
</style>
