<template>
  <div>
    <h2 class="font-satoshi font-black tracking-[-0.03em] text-xl lg:text-2xl text-ditto-text mb-2">Track Credits</h2>
    <p class="text-sm text-ditto-subtext mb-6">
      You need to add <span class="font-semibold text-ditto-text">at least one name for each category</span> of credits on this release.
    </p>

    <div class="space-y-5">
      <div
        v-for="(credit, index) in credits"
        :key="credit.id"
        class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 items-start"
      >
        <!-- Name -->
        <div>
          <label class="flex items-center gap-1 text-sm font-medium text-ditto-text mb-1">
            {{ categoryLabel(credit) }}
            <span v-if="index < 4" class="text-error">*</span>
          </label>
          <input
            :value="credit.name"
            @input="updateCredit(index, 'name', ($event.target as HTMLInputElement).value)"
            @blur="touch(credit.id, 'name')"
            type="text"
            maxlength="255"
            placeholder="Name"
            :class="[
              'w-full px-0 py-2.5 border-0 border-b text-sm text-ditto-text bg-transparent focus:outline-none transition-colors',
              nameError(credit) ? 'border-error focus:border-error' : 'border-gray-300 focus:border-ditto-purple'
            ]"
          />
          <p v-if="nameError(credit)" class="text-xs text-error mt-1">{{ nameError(credit) }}</p>
        </div>

        <!-- Role (every category except Composer) -->
        <div v-if="credit.category !== 'composer'">
          <label class="block text-sm font-medium text-ditto-text mb-1">Role</label>
          <div class="flex items-center gap-2">
            <SearchableSelect
              class="flex-1"
              :model-value="credit.role"
              :options="roleOptionsFor(credit)"
              :placeholder="rolePlaceholder(credit)"
              :error="!!roleError(credit)"
              @update:model-value="updateCredit(index, 'role', $event)"
              @blur="touch(credit.id, 'role')"
            />
            <!-- Remove (additional credits only) -->
            <button
              v-if="index >= 4"
              @click="removeCredit(index)"
              class="w-8 h-8 rounded-full hover:bg-error/10 flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="Remove credit"
            >
              <svg class="w-4 h-4 text-ditto-subtext hover:text-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <p v-if="roleError(credit)" class="text-xs text-error mt-1">Please select a role for this credit.</p>
        </div>
      </div>
    </div>

    <!-- Add More -->
    <button
      v-if="additionalCount < 20"
      @click="addCredit"
      class="mt-5 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-ditto-purple bg-ditto-light-grey hover:bg-ditto-purple/10 transition-colors"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Add more
    </button>
    <p v-else class="mt-3 text-xs text-ditto-subtext">Maximum of 20 additional credits reached.</p>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import SearchableSelect from './SearchableSelect.vue'
import { roleOptionsForCategory } from '../../../data/videoMockData'
import type { CreditCategory } from '../../../data/videoMockData'

interface Credit {
  id: string
  category: CreditCategory
  name: string
  role: string
}

const props = defineProps<{
  credits: Credit[]
}>()

const emit = defineEmits<{
  (e: 'update:credits', credits: Credit[]): void
}>()

// Per-field touched state so validation only fires after the user leaves a field.
const touched = reactive<Record<string, boolean>>({})
const touch = (id: string, field: 'name' | 'role') => { touched[`${id}-${field}`] = true }

const categoryLabels: Record<CreditCategory, string> = {
  composer: 'Composer',
  songwriter: 'Songwriter',
  production: 'Production / Engineer',
  performer: 'Performer',
  additional: 'Additional Credit',
}
const categoryLabel = (credit: Credit) => categoryLabels[credit.category]

const rolePlaceholders: Record<CreditCategory, string> = {
  composer: '',
  songwriter: 'e.g. Lyricist',
  production: 'e.g. Producer',
  performer: 'e.g. Lead Vocals',
  additional: 'Select role',
}
const rolePlaceholder = (credit: Credit) => rolePlaceholders[credit.category]

const roleOptionsFor = (credit: Credit) => roleOptionsForCategory(credit.category)

const additionalCount = computed(() => props.credits.filter(c => c.category === 'additional').length)

// Validation — mirrors the spec (name required + min 2 words, role required).
const nameError = (credit: Credit): string | null => {
  if (!touched[`${credit.id}-name`]) return null
  const name = credit.name.trim()
  if (!name) {
    return credit.category === 'additional'
      ? 'Credit name is required.'
      : `${categoryLabels[credit.category]} is required.`
  }
  if (name.split(/\s+/).length < 2) return 'First name and last name are required.'
  return null
}

const roleError = (credit: Credit): string | null => {
  if (credit.category === 'composer') return null
  if (!touched[`${credit.id}-role`]) return null
  return credit.role ? null : 'Please select a role for this credit.'
}

let nextId = props.credits.length + 1

const updateCredit = (index: number, field: keyof Credit, value: string) => {
  const updated = [...props.credits]
  updated[index] = { ...updated[index], [field]: value }
  emit('update:credits', updated)
}

const addCredit = () => {
  if (additionalCount.value < 20) {
    nextId++
    emit('update:credits', [
      ...props.credits,
      { id: `c${nextId}`, category: 'additional' as CreditCategory, name: '', role: '' },
    ])
  }
}

const removeCredit = (index: number) => {
  if (index >= 4) {
    emit('update:credits', props.credits.filter((_, i) => i !== index))
  }
}
</script>
