<template>
  <div>
    <!-- Step Navigation Bar - Release Builder Style -->
    <div :class="['border-b px-6 lg:px-8 py-4', isDarkMode ? 'border-gray-700' : 'border-gray-200']">
      <div class="flex items-center">
        <div 
          v-for="(step, index) in steps" 
          :key="step.id"
          class="flex-1 relative"
        >
          <!-- Step indicator -->
          <button
            @click="goToStep(index)"
            :disabled="index > currentStep"
            :class="[
              'flex items-center gap-2 text-sm font-medium transition-colors',
              index <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'
            ]"
          >
            <span 
              :class="[
                'text-lg font-semibold',
                index < currentStep ? 'text-ditto-purple' : 
                index === currentStep ? 'text-ditto-purple' : isDarkMode ? 'text-gray-600' : 'text-gray-300'
              ]"
            >
              {{ index + 1 }}
            </span>
            <span 
              :class="[
                index < currentStep ? (isDarkMode ? 'text-white' : 'text-gray-900') : 
                index === currentStep ? 'text-ditto-purple' : 'text-gray-400'
              ]"
            >
              {{ step.label }}
            </span>
          </button>
          
          <!-- Progress line under step -->
          <div 
            :class="[
              'absolute bottom-[-17px] left-0 right-0 h-[3px] transition-colors',
              index < currentStep ? 'bg-ditto-purple' : 
              index === currentStep ? 'bg-ditto-purple' : 'bg-transparent'
            ]"
          />
        </div>
      </div>
    </div>
    
    <div class="p-6 lg:p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 :class="['text-2xl lg:text-3xl font-bold mb-2', isDarkMode ? 'text-white' : 'text-gray-900']">{{ contract.title }}</h1>
        <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ contract.description }}</p>
      </div>

    <!-- Step Content -->
    <div class="mb-6">
      <!-- Step 1: Record Label Details -->
      <div v-if="currentStep === 0" class="space-y-6">
        <h2 :class="['text-xl font-semibold mb-4', isDarkMode ? 'text-white' : 'text-gray-900']">Record Label Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label :class="labelClass">Record Label Name *</label>
            <input 
              v-model="formData.recordLabel.name"
              type="text"
              :class="inputClass"
              placeholder="Enter label name"
            />
          </div>
          
          <div>
            <label :class="labelClass">Email *</label>
            <input 
              v-model="formData.recordLabel.email"
              type="email"
              :class="inputClass"
              placeholder="label@email.com"
            />
          </div>
          
          <div class="md:col-span-2">
            <label :class="labelClass">Address *</label>
            <input 
              v-model="formData.recordLabel.address"
              type="text"
              :class="inputClass"
              placeholder="Street address"
            />
          </div>
          
          <div>
            <label :class="labelClass">City *</label>
            <input 
              v-model="formData.recordLabel.city"
              type="text"
              :class="inputClass"
              placeholder="City"
            />
          </div>
          
          <div>
            <label :class="labelClass">Country *</label>
            <input 
              v-model="formData.recordLabel.country"
              type="text"
              :class="inputClass"
              placeholder="Country"
            />
          </div>
          
          <div>
            <label :class="labelClass">Postcode *</label>
            <input 
              v-model="formData.recordLabel.postcode"
              type="text"
              :class="inputClass"
              placeholder="Postcode"
            />
          </div>
          
          <div>
            <label :class="labelClass">Phone Number</label>
            <input 
              v-model="formData.recordLabel.phone"
              type="tel"
              :class="inputClass"
              placeholder="+44 123 456 7890"
            />
          </div>
        </div>
      </div>

      <!-- Step 2: Artist Details -->
      <div v-if="currentStep === 1" class="space-y-6">
        <div class="flex items-center justify-between mb-4">
          <h2 :class="['text-xl font-semibold', isDarkMode ? 'text-white' : 'text-gray-900']">Artist / Band Information</h2>
          <span :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-500']">{{ formData.artists.length }}/5 artists</span>
        </div>
        
        <!-- Artist Cards -->
        <div 
          v-for="(artist, index) in formData.artists" 
          :key="index"
          :class="['relative border rounded-xl p-5 mb-4', isDarkMode ? 'border-gray-700' : 'border-gray-200']"
        >
          <!-- Remove button (only if more than 1 artist) -->
          <button
            v-if="formData.artists.length > 1"
            @click="removeArtist(index)"
            class="absolute top-3 right-3 p-1 text-gray-400 hover:text-error transition-colors"
            title="Remove artist"
          >
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h3 :class="['text-sm font-medium mb-4', isDarkMode ? 'text-gray-300' : 'text-gray-700']">Artist {{ index + 1 }}</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label :class="labelClass">Artist / Band Name *</label>
              <input 
                v-model="artist.name"
                type="text"
                :class="inputClass"
                placeholder="Artist name"
              />
            </div>
            
            <div>
              <label :class="labelClass">Email *</label>
              <input 
                v-model="artist.email"
                type="email"
                :class="inputClass"
                placeholder="artist@email.com"
              />
            </div>
            
            <div class="md:col-span-2">
              <label :class="labelClass">Address *</label>
              <input 
                v-model="artist.address"
                type="text"
                :class="inputClass"
                placeholder="Street address"
              />
            </div>
            
            <div>
              <label :class="labelClass">City *</label>
              <input 
                v-model="artist.city"
                type="text"
                :class="inputClass"
                placeholder="City"
              />
            </div>
            
            <div>
              <label :class="labelClass">Country *</label>
              <input 
                v-model="artist.country"
                type="text"
                :class="inputClass"
                placeholder="Country"
              />
            </div>
            
            <div>
              <label :class="labelClass">Postcode *</label>
              <input 
                v-model="artist.postcode"
                type="text"
                :class="inputClass"
                placeholder="Postcode"
              />
            </div>
          </div>
        </div>
        
        <!-- Add Artist Button -->
        <button
          v-if="formData.artists.length < 5"
          @click="addArtist"
          :class="['w-full py-3 border-2 border-dashed rounded-xl text-sm font-medium hover:border-ditto-purple hover:text-ditto-purple transition-colors flex items-center justify-center gap-2', isDarkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500']"
        >
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Another Artist
        </button>
      </div>

      <!-- Step 3: Contract Terms -->
      <div v-if="currentStep === 2" class="space-y-6">
        <h2 :class="['text-xl font-semibold mb-4', isDarkMode ? 'text-white' : 'text-gray-900']">Contract Terms</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label :class="labelClass">Effective Date *</label>
            <input 
              v-model="formData.terms.effectiveDate"
              type="date"
              :class="inputClass"
            />
          </div>
          
          <div>
            <label :class="labelClass">Term (Duration) *</label>
            <input 
              v-model="formData.terms.term"
              type="text"
              :class="inputClass"
              placeholder="e.g. 2 years"
            />
          </div>
          
          <div>
            <label :class="labelClass">Service Start Date *</label>
            <input 
              v-model="formData.terms.serviceStartDate"
              type="date"
              :class="inputClass"
            />
          </div>
          
          <div>
            <label :class="labelClass">Service End Date *</label>
            <input 
              v-model="formData.terms.serviceEndDate"
              type="date"
              :class="inputClass"
            />
          </div>
          
          <div>
            <label :class="labelClass">Number of Full-Length Albums</label>
            <input 
              v-model="formData.terms.albumCount"
              type="number"
              min="1"
              :class="inputClass"
              placeholder="1"
            />
          </div>
          
          <div>
            <label :class="labelClass">Payment Structure *</label>
            <input 
              v-model="formData.terms.paymentStructure"
              type="text"
              :class="inputClass"
              placeholder="e.g. 50/50 split"
            />
          </div>
          
          <div>
            <label :class="labelClass">Cure Period (Days)</label>
            <input 
              v-model="formData.terms.curePeriod"
              type="text"
              :class="inputClass"
              placeholder="e.g. 30 days"
            />
          </div>
          
          <div>
            <label :class="labelClass">Governing Law *</label>
            <select 
              v-model="formData.terms.governingLaw"
              :class="[inputClass, 'bg-transparent']"
            >
              <option value="">Select jurisdiction</option>
              <option value="england-wales">England and Wales</option>
              <option value="scotland">Scotland</option>
              <option value="us-california">California, USA</option>
              <option value="us-new-york">New York, USA</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Step 4: Review & Sign -->
      <div v-if="currentStep === 3" class="space-y-6">
        <h2 :class="['text-xl font-semibold mb-4', isDarkMode ? 'text-white' : 'text-gray-900']">Review & Sign</h2>
        
        <!-- Summary -->
        <div :class="['rounded-lg p-4 space-y-4', isDarkMode ? 'bg-[#0F0E0E]' : 'bg-gray-50']">
          <h3 :class="['font-medium', isDarkMode ? 'text-white' : 'text-gray-900']">Contract Summary</h3>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Record Label</p>
              <p :class="['font-medium', isDarkMode ? 'text-white' : 'text-gray-900']">{{ formData.recordLabel.name || '—' }}</p>
            </div>
            <div>
              <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Artist(s)</p>
              <p :class="['font-medium', isDarkMode ? 'text-white' : 'text-gray-900']">{{ artistNames || '—' }}</p>
            </div>
            <div>
              <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Effective Date</p>
              <p :class="['font-medium', isDarkMode ? 'text-white' : 'text-gray-900']">{{ formData.terms.effectiveDate || '—' }}</p>
            </div>
            <div>
              <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Term</p>
              <p :class="['font-medium', isDarkMode ? 'text-white' : 'text-gray-900']">{{ formData.terms.term || '—' }}</p>
            </div>
          </div>
        </div>
        
        <!-- Record Label Signature -->
        <div>
          <h3 :class="['font-medium mb-3', isDarkMode ? 'text-white' : 'text-gray-900']">Record Label Signature</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label :class="labelClass">Signatory Name *</label>
              <input 
                v-model="formData.signatures.labelSignatory"
                type="text"
                :class="inputClass"
                placeholder="Full name"
              />
            </div>
            <div>
              <label :class="labelClass">Title *</label>
              <input 
                v-model="formData.signatures.labelTitle"
                type="text"
                :class="inputClass"
                placeholder="e.g. CEO, Manager"
              />
            </div>
            <div>
              <label :class="labelClass">Email *</label>
              <input 
                v-model="formData.signatures.labelEmail"
                type="email"
                :class="inputClass"
                placeholder="signatory@label.com"
              />
            </div>
          </div>
        </div>
        
        <!-- Artist Signature -->
        <div>
          <h3 :class="['font-medium mb-3', isDarkMode ? 'text-white' : 'text-gray-900']">Artist / Band Signature</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label :class="labelClass">Signatory Name *</label>
              <input 
                v-model="formData.signatures.artistSignatory"
                type="text"
                :class="inputClass"
                placeholder="Full name"
              />
            </div>
            <div>
              <label :class="labelClass">Title *</label>
              <input 
                v-model="formData.signatures.artistTitle"
                type="text"
                :class="inputClass"
                placeholder="e.g. Artist"
              />
            </div>
            <div>
              <label :class="labelClass">Email *</label>
              <input 
                v-model="formData.signatures.artistEmail"
                type="email"
                :class="inputClass"
                placeholder="artist@email.com"
              />
            </div>
          </div>
        </div>
        
        <!-- Agreement checkbox -->
        <label class="flex items-start gap-3 cursor-pointer">
          <input 
            v-model="agreedToTerms"
            type="checkbox"
            :class="['mt-1 w-4 h-4 rounded text-ditto-purple focus:ring-ditto-purple', isDarkMode ? 'border-gray-600 bg-[#0F0E0E]' : 'border-gray-300']"
          />
          <span :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
            I confirm that all information provided is accurate and I agree to the terms of this contract. 
            The contract will be sent to all signatories for electronic signature.
          </span>
        </label>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="flex items-center justify-center gap-4 pt-6">
      <button 
        @click="currentStep > 0 ? previousStep() : $emit('back')"
        :class="['px-8 py-2.5 text-sm font-medium transition-colors border rounded-full', isDarkMode ? 'text-gray-400 hover:text-white border-gray-600' : 'text-gray-600 hover:text-gray-900 border-gray-300']"
      >
        Back
      </button>
      
      <button 
        v-if="currentStep < steps.length - 1"
        @click="nextStep"
        class="px-8 py-2.5 bg-ditto-purple text-white text-sm font-medium rounded-full hover:opacity-90 transition-opacity shadow-md shadow-ditto-purple/25"
      >
        Next
      </button>
      
      <button 
        v-else
        @click="submitContract"
        :disabled="!agreedToTerms"
        :class="[
          'px-8 py-2.5 text-sm font-medium rounded-full transition-all shadow-md',
          agreedToTerms 
            ? 'bg-ditto-purple text-white hover:opacity-90 shadow-ditto-purple/25' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
        ]"
      >
        Add to Basket
      </button>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { AvailableContract, Artist } from './artistTypes'

const props = defineProps<{
  contract: AvailableContract
  artist?: Artist
  isDarkMode?: boolean
}>()

// Computed classes for dark mode support
const labelClass = computed(() => [
  'block text-xs mb-1',
  props.isDarkMode ? 'text-gray-400' : 'text-gray-500'
])

const inputClass = computed(() => [
  'w-full py-2 text-sm border-b focus:border-ditto-purple focus:outline-none transition-colors',
  props.isDarkMode ? 'text-white border-gray-700 bg-transparent placeholder-gray-500' : 'text-gray-900 border-gray-200'
])

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'submit', data: typeof formData): void
}>()

const currentStep = ref(0)
const agreedToTerms = ref(false)

const steps = [
  { id: 'label', label: 'Record Label' },
  { id: 'artist', label: 'Artist Info' },
  { id: 'terms', label: 'Contract Terms' },
  { id: 'review', label: 'Review & Sign' }
]

const today = new Date().toISOString().split('T')[0]

interface ArtistEntry {
  name: string
  email: string
  address: string
  city: string
  country: string
  postcode: string
}

const createEmptyArtist = (): ArtistEntry => ({
  name: '',
  email: '',
  address: '',
  city: '',
  country: '',
  postcode: ''
})

const formData = reactive({
  recordLabel: {
    name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    postcode: '',
    phone: ''
  },
  artists: [createEmptyArtist()] as ArtistEntry[],
  terms: {
    effectiveDate: today,
    term: '',
    serviceStartDate: today,
    serviceEndDate: '',
    albumCount: '',
    paymentStructure: '',
    curePeriod: '',
    governingLaw: ''
  },
  signatures: {
    labelSignatory: '',
    labelTitle: '',
    labelEmail: '',
    artistSignatory: '',
    artistTitle: '',
    artistEmail: ''
  }
})

const artistNames = computed(() => {
  return formData.artists
    .map(a => a.name)
    .filter(name => name.trim())
    .join(', ')
})

const addArtist = () => {
  if (formData.artists.length < 5) {
    formData.artists.push(createEmptyArtist())
  }
}

const removeArtist = (index: number) => {
  if (formData.artists.length > 1) {
    formData.artists.splice(index, 1)
  }
}

onMounted(() => {
  // Prepopulate artist info if available
  if (props.artist) {
    formData.artists[0].name = props.artist.name
    formData.signatures.artistSignatory = props.artist.name
    formData.signatures.artistTitle = 'Artist'
  }
})

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const goToStep = (index: number) => {
  if (index <= currentStep.value) {
    currentStep.value = index
  }
}

const submitContract = () => {
  if (!agreedToTerms.value) return
  emit('submit', formData)
}
</script>
