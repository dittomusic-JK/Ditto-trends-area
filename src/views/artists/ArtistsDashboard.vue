<template>
  <div class="flex h-[calc(100vh-80px)]">
    <!-- Left Artist List Sidebar -->
    <ArtistListSidebar
      :artists="artists"
      :selected-artist="selectedArtist"
      :is-dark-mode="false"
      @select="selectArtist"
      @add="handleAddArtist"
      class="hidden lg:flex"
    />

    <!-- Main Content Area -->
    <div class="flex-1 min-w-0 overflow-y-auto">
      <!-- No Artist Selected -->
      <div v-if="!selectedArtist" class="p-8">
        <div class="max-w-2xl mx-auto text-center py-20">
          <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <IconPlus class="w-10 h-10 text-gray-400" />
          </div>
          <h2 class="text-2xl font-semibold text-ditto-text mb-2">Select an Artist</h2>
          <p class="text-ditto-subtext mb-6">Choose an artist from the sidebar or add a new one to get started.</p>
          <button @click="handleAddArtist" class="px-6 py-3 bg-ditto-purple text-white font-medium rounded-full hover:opacity-90 transition-opacity">
            Add New Artist
          </button>
        </div>
      </div>

      <!-- Artist Detail View -->
      <div v-else>
        <div class="sticky top-0 z-10 px-6 lg:px-8 py-4 border-b bg-white border-gray-200">
          <HorizontalTabNav :active-view="activeView" :is-dark-mode="false" @navigate="setActiveView" />
        </div>

        <div class="bg-white">
          <OverviewView v-if="activeView === 'overview'" :artist="selectedArtist" :top-songs="topSongs" :top-countries="topCountries" :integrations="integrations" :is-dark-mode="false" @edit-artist="handleEditArtist" />
          <ReleasesView v-else-if="activeView === 'releases'" :releases="releases" :is-dark-mode="false" />
          <ContributionsView v-else-if="activeView === 'contributions'" :contributions="contributions" :is-dark-mode="false" />
          <SmartlinksView v-else-if="activeView === 'smartlinks'" :smartlinks="smartlinks" :is-dark-mode="false" />
          <IntegrationsView v-else-if="activeView === 'integrations'" :integrations="integrations" :is-dark-mode="false" />
          <ContractsView v-else-if="activeView === 'contracts'" :available-contracts="availableContracts" :user-contracts="userContracts" :is-dark-mode="false" @select-contract="handleContractSelect" />
          <EditArtistView v-else-if="activeView === 'edit'" :artist="selectedArtist" @cancel="activeView = 'overview'" @save="handleSaveArtist" />
        </div>
      </div>
    </div>

    <!-- Edit Artist Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showEditModal = false">
      <div class="rounded-2xl max-w-5xl w-[90vw] max-h-[90vh] overflow-y-auto shadow-2xl bg-white">
        <EditArtistView :artist="isAddingNewArtist ? undefined : selectedArtist!" :is-new="isAddingNewArtist" :is-dark-mode="false" @cancel="showEditModal = false" @save="handleSaveArtist" />
      </div>
    </div>

    <!-- Contract Purchase Modal -->
    <div v-if="showContractModal && selectedContract" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showContractModal = false">
      <div class="rounded-2xl max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto shadow-2xl bg-white">
        <ContractPurchaseView :contract="selectedContract" :artist="selectedArtist ?? undefined" :is-dark-mode="false" @back="showContractModal = false" @submit="handleContractSubmit" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ArtistViewType, Artist, AvailableContract } from './artistTypes'

import ArtistListSidebar from '../../components/artists/ArtistListSidebar.vue'
import HorizontalTabNav from '../../components/artists/HorizontalTabNav.vue'
import OverviewView from './OverviewView.vue'
import ReleasesView from './ReleasesView.vue'
import ContributionsView from './ContributionsView.vue'
import SmartlinksView from './SmartlinksView.vue'
import IntegrationsView from './IntegrationsView.vue'
import ContractsView from './ContractsView.vue'
import EditArtistView from './EditArtistView.vue'
import ContractPurchaseView from './ContractPurchaseView.vue'
import { IconPlus } from '../../components/icons/artistIcons'

import {
  artists, topSongs, topCountries, releases, contributions,
  smartlinks, integrations, availableContracts, userContracts
} from '../../data/artistsMockData'

const selectedArtist = ref<Artist | null>(artists[0])
const activeView = ref<ArtistViewType>('overview')
const showEditModal = ref(false)
const isAddingNewArtist = ref(false)
const showContractModal = ref(false)
const selectedContract = ref<AvailableContract | null>(null)

const selectArtist = (artist: Artist) => { selectedArtist.value = artist; activeView.value = 'overview' }
const setActiveView = (view: ArtistViewType) => { activeView.value = view }
const handleAddArtist = () => { isAddingNewArtist.value = true; showEditModal.value = true }
const handleEditArtist = () => { isAddingNewArtist.value = false; showEditModal.value = true }
const handleSaveArtist = (_data: any) => { showEditModal.value = false }
const handleContractSelect = (contract: AvailableContract) => { selectedContract.value = contract; showContractModal.value = true }
const handleContractSubmit = (_data: any) => { showContractModal.value = false }
</script>
