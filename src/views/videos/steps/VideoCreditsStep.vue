<template>
  <div>
    <h2 class="font-poppins font-bold text-xl lg:text-2xl text-ditto-text mb-2">Track Credits</h2>
    <p class="text-sm text-ditto-subtext mb-6">
      Add the credits for the people involved in creating this video. Mandatory roles are required.
    </p>

    <div class="space-y-3">
      <div
        v-for="(credit, index) in credits"
        :key="credit.id"
        class="flex items-start gap-3 py-3"
      >
        <div class="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <!-- First Name -->
          <input
            :value="credit.firstName"
            @input="updateCredit(index, 'firstName', ($event.target as HTMLInputElement).value)"
            type="text"
            maxlength="255"
            placeholder="First name"
            class="w-full px-0 py-2 border-0 border-b border-gray-300 text-sm text-ditto-text bg-transparent focus:outline-none focus:border-ditto-purple transition-colors"
          />

          <!-- Last Name -->
          <input
            :value="credit.lastName"
            @input="updateCredit(index, 'lastName', ($event.target as HTMLInputElement).value)"
            type="text"
            maxlength="255"
            placeholder="Last name"
            class="w-full px-0 py-2 border-0 border-b border-gray-300 text-sm text-ditto-text bg-transparent focus:outline-none focus:border-ditto-purple transition-colors"
          />

          <!-- Role Dropdown -->
          <div class="relative">
            <select
              :value="credit.role"
              @change="updateCredit(index, 'role', ($event.target as HTMLSelectElement).value)"
              class="w-full px-0 py-2 border-0 border-b border-gray-300 text-sm text-ditto-text bg-transparent focus:outline-none focus:border-ditto-purple transition-colors"
            >
              <option v-for="role in roleOptions" :key="role" :value="role">{{ role }}</option>
            </select>
          </div>
        </div>

        <!-- Remove button (only for additional credits) -->
        <button
          v-if="index >= 4"
          @click="removeCredit(index)"
          class="w-8 h-8 rounded-full hover:bg-error/10 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5"
        >
          <svg class="w-4 h-4 text-ditto-subtext hover:text-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <!-- Required badge for mandatory credits -->
        <div v-else class="w-8 flex-shrink-0 flex flex-col items-center">
          <span class="text-[10px] text-ditto-subtext font-medium">Required</span>
          <svg v-if="!credit.firstName.trim() || !credit.lastName.trim()" class="w-3 h-3 text-warning mt-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Mandatory credit validation hint -->
    <p v-if="hasMissingMandatory" class="mt-2 text-xs text-warning flex items-center gap-1.5">
      <svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      Please add a first and last name for each required credit.
    </p>

    <!-- Add More -->
    <button
      v-if="credits.length < 24"
      @click="addCredit"
      class="mt-4 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-ditto-purple bg-ditto-light-grey hover:bg-ditto-purple/10 transition-colors"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Add more
    </button>
    <p v-if="credits.length >= 24" class="mt-3 text-xs text-ditto-subtext">Maximum of 24 credits reached (4 mandatory + 20 additional).</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { creditRoles } from '../../../data/videoMockData'

interface Credit {
  id: string
  firstName: string
  lastName: string
  role: string
}

const props = defineProps<{
  credits: Credit[]
}>()

const emit = defineEmits<{
  (e: 'update:credits', credits: Credit[]): void
}>()

const roleOptions = creditRoles

const hasMissingMandatory = computed(() => {
  return props.credits.slice(0, 4).some(c => !c.firstName.trim() || !c.lastName.trim())
})

let nextId = props.credits.length + 1

const updateCredit = (index: number, field: keyof Credit, value: string) => {
  const updated = [...props.credits]
  updated[index] = { ...updated[index], [field]: value }
  emit('update:credits', updated)
}

const addCredit = () => {
  if (props.credits.length < 24) {
    nextId++
    const updated = [...props.credits, { id: `c${nextId}`, firstName: '', lastName: '', role: 'Composer' }]
    emit('update:credits', updated)
  }
}

const removeCredit = (index: number) => {
  if (index >= 4) {
    const updated = props.credits.filter((_, i) => i !== index)
    emit('update:credits', updated)
  }
}
</script>
