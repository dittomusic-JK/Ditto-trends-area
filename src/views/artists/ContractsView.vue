<template>
  <div class="p-6 lg:p-8 space-y-8">
    <!-- Hero Banner -->
    <div class="relative bg-gradient-to-r from-[#141414] to-ditto-purple rounded-xl p-6 lg:p-8 overflow-hidden">
      <div class="relative z-10 max-w-lg">
        <h1 class="text-2xl lg:text-3xl font-bold text-white mb-2">Music Agreements Made Easy</h1>
        <p class="text-white/80 text-sm lg:text-base">
          Purchase contracts and licenses to protect your music, simplify collaborations, and secure your rights.
        </p>
      </div>
      <!-- Hero Image -->
      <div class="absolute -right-4 top-1/2 -translate-y-1/2 hidden lg:block">
        <img 
          src="/images/contracts-heroimage.webp" 
          alt="Contracts" 
          class="h-48 w-auto"
        />
      </div>
    </div>
    
    <!-- Available Contracts -->
    <section>
      <h2 :class="['text-xl font-semibold mb-4', isDarkMode ? 'text-white' : 'text-gray-900']">Available Contracts</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ContractTypeCard 
          v-for="contract in availableContracts" 
          :key="contract.id"
          :contract="contract"
          :is-dark-mode="isDarkMode"
          @select="handleContractSelect"
        />
      </div>
    </section>
    
    <!-- Your Contracts -->
    <section>
      <h2 :class="['text-xl font-semibold mb-4', isDarkMode ? 'text-white' : 'text-gray-900']">Your Contracts</h2>
      
      <div :class="['rounded-xl overflow-hidden', isDarkMode ? 'bg-[#141414]' : 'bg-white']">
        <!-- Table Header -->
        <div :class="['hidden lg:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium uppercase tracking-wider', isDarkMode ? 'bg-[#0F0E0E] text-gray-500' : 'bg-white text-gray-500']">
          <div class="col-span-5">Name</div>
          <div class="col-span-2">Status</div>
          <div class="col-span-3">Date Created</div>
          <div class="col-span-2">Actions</div>
        </div>
        
        <!-- Table Body -->
        <div :class="['divide-y', isDarkMode ? 'divide-gray-700/30' : 'divide-gray-100']">
          <div 
            v-for="contract in userContracts" 
            :key="contract.id"
            :class="['grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-4 px-4 lg:px-6 py-4 transition-colors', isDarkMode ? 'hover:bg-[#0F0E0E]/50' : 'hover:bg-ditto-light-grey']"
          >
            <!-- Name -->
            <div class="lg:col-span-5 flex items-center">
              <span :class="['font-medium', isDarkMode ? 'text-white' : 'text-gray-900']">{{ contract.name }}</span>
            </div>
            
            <!-- Status -->
            <div class="lg:col-span-2 flex items-center">
              <span 
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getStatusClass(contract.status)
                ]"
              >
                {{ contract.status }}
              </span>
            </div>
            
            <!-- Date Created -->
            <div class="lg:col-span-3 flex items-center">
              <span :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-500']">{{ contract.dateCreated }}</span>
            </div>
            
            <!-- Actions Dropdown -->
            <div class="lg:col-span-2 flex items-center relative">
              <div class="relative">
                <button 
                  @click="toggleActionsMenu(contract.id)"
                  :class="['flex items-center gap-2 px-3 py-1.5 border rounded-full text-sm transition-colors', isDarkMode ? 'border-gray-600 text-gray-300 hover:border-ditto-purple hover:text-ditto-purple' : 'border-gray-300 text-gray-600 hover:border-ditto-purple hover:text-ditto-purple']"
                >
                  Actions
                  <IconChevronDown class="w-4 h-4" :class="{ 'rotate-180': openMenuId === contract.id }" />
                </button>
                
                <!-- Dropdown Menu -->
                <div 
                  v-if="openMenuId === contract.id"
                  :class="['absolute right-0 top-full mt-1 w-48 border rounded-lg shadow-lg z-20 py-1', isDarkMode ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-gray-200']"
                >
                  <!-- View - for all statuses -->
                  <button
                    @click="handleView(contract)"
                    :class="['w-full px-3 py-2 text-sm text-left flex items-center gap-2', isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-ditto-light-grey']"
                  >
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    View
                  </button>
                  
                  <!-- Edit - only for Draft -->
                  <button
                    v-if="contract.status === 'Draft'"
                    @click="handleEdit(contract)"
                    :class="['w-full px-3 py-2 text-sm text-left flex items-center gap-2', isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-ditto-light-grey']"
                  >
                    <IconEdit class="w-4 h-4" />
                    Edit
                  </button>
                  
                  <!-- Resend to Email - for Ready status -->
                  <button
                    v-if="contract.status === 'Ready'"
                    @click="handleResend(contract)"
                    :class="['w-full px-3 py-2 text-sm text-left flex items-center gap-2', isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-ditto-light-grey']"
                  >
                    <IconMail class="w-4 h-4" />
                    Resend to Email
                  </button>
                  
                  <!-- Delete - only for Draft -->
                  <button
                    v-if="contract.status === 'Draft'"
                    @click="handleDelete(contract)"
                    :class="['w-full px-3 py-2 text-sm text-left text-error flex items-center gap-2', isDarkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-50']"
                  >
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="userContracts.length === 0" class="px-6 py-12 text-center">
          <p class="text-gray-500">You don't have any contracts yet</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { AvailableContract, UserContract, ContractStatus } from './artistTypes'
import ContractTypeCard from '../../components/artists/ContractTypeCard.vue'
import { IconMail, IconChevronDown, IconEdit } from '../../components/icons/artistIcons'


defineProps<{
  availableContracts: AvailableContract[]
  userContracts: UserContract[]
  isDarkMode?: boolean
}>()

const emit = defineEmits<{
  (e: 'select-contract', contract: AvailableContract): void
  (e: 'edit-contract', contract: UserContract): void
  (e: 'delete-contract', contract: UserContract): void
  (e: 'view-contract', contract: UserContract): void
  (e: 'resend-contract', contract: UserContract): void
}>()

const openMenuId = ref<string | null>(null)

const toggleActionsMenu = (contractId: string) => {
  openMenuId.value = openMenuId.value === contractId ? null : contractId
}

const closeMenu = () => {
  openMenuId.value = null
}

const handleContractSelect = (contract: AvailableContract) => {
  emit('select-contract', contract)
}

const handleEdit = (contract: UserContract) => {
  emit('edit-contract', contract)
  closeMenu()
}

const handleDelete = (contract: UserContract) => {
  emit('delete-contract', contract)
  closeMenu()
}

const handleView = (contract: UserContract) => {
  emit('view-contract', contract)
  closeMenu()
}

const handleResend = (contract: UserContract) => {
  emit('resend-contract', contract)
  closeMenu()
}

// Close menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const getStatusClass = (status: ContractStatus): string => {
  switch (status) {
    case 'Ready':
      return 'bg-success/15 text-success'
    case 'Processing':
      return 'bg-warning/15 text-warning'
    case 'Draft':
      return 'bg-gray-100 text-gray-600'
    case 'Ended':
      return 'bg-blue-100 text-blue-600'
    case 'Removed':
      return 'bg-red-100 text-error'
    default:
      return 'bg-ditto-light-grey text-ditto-subtext'
  }
}
</script>
