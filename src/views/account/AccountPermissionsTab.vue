<template>
  <div>
    <!-- Intro row: who's here, and the invite action -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h2 class="font-satoshi font-black tracking-[-0.03em] text-xl text-ditto-text">Who has access</h2>
        <p class="text-[15px] text-ditto-subtext mt-1">{{ activeCount }} people can sign in to this account<template v-if="pendingCount"> · {{ pendingCount }} invite{{ pendingCount === 1 ? '' : 's' }} waiting</template>.</p>
      </div>
      <button v-if="!inviting" @click="openInvite()" class="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-ditto-purple btn-pop-purple text-white text-sm font-semibold hover:opacity-95 transition-opacity self-start sm:self-auto">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
        Invite someone
      </button>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-7 items-start">
      <div class="space-y-5">
        <!-- ── Invite / edit panel ── -->
        <div v-if="inviting" class="bg-white rounded-2xl border border-ditto-purple/40 p-6 lg:p-7 shadow-[0_8px_30px_-12px_rgba(95,31,255,0.25)]">
          <div class="flex items-start justify-between gap-4 mb-5">
            <div>
              <h3 class="font-satoshi font-black tracking-[-0.03em] text-lg text-ditto-text">{{ editing ? `Change ${editing.name}'s access` : 'Invite someone' }}</h3>
              <p class="text-sm text-ditto-subtext mt-0.5">{{ editing ? 'Changes apply the next time they sign in.' : "They'll get an email with a link to accept. Nothing changes until they do." }}</p>
            </div>
            <button @click="closeInvite" class="w-8 h-8 rounded-full hover:bg-ditto-light-grey flex items-center justify-center transition-colors flex-shrink-0" aria-label="Close">
              <svg class="w-4 h-4 text-ditto-subtext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <!-- Email -->
            <div>
              <label class="block text-[13px] font-medium text-ditto-subtext mb-1.5">Email address</label>
              <input v-model="form.email" :disabled="!!editing" type="email" placeholder="name@example.com" :class="[fieldClass, editing ? 'opacity-60' : '']" @input="form.touched = true" />
              <p v-if="emailError" class="text-xs text-error mt-1.5">{{ emailError }}</p>
            </div>

            <!-- Role -->
            <div>
              <label class="block text-[13px] font-medium text-ditto-subtext mb-1.5">Role</label>
              <div ref="roleWrap" class="relative">
                <button type="button" @click="roleOpen = !roleOpen" class="w-full flex items-center justify-between py-3 border-b border-gray-300 text-base text-ditto-text hover:border-ditto-purple transition-colors text-left">
                  <span>{{ roleById(form.role).name }}</span>
                  <svg :class="['w-4 h-4 text-ditto-subtext transition-transform', roleOpen ? 'rotate-180' : '']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <div v-if="roleOpen" class="absolute left-0 right-0 top-full mt-2 z-20 bg-white border border-gray-200 rounded-2xl shadow-xl p-1.5">
                  <button
                    v-for="r in roles"
                    :key="r.id"
                    type="button"
                    @click="pickRole(r.id)"
                    :class="['w-full text-left px-3.5 py-2.5 rounded-xl transition-colors', form.role === r.id ? 'bg-ditto-purple/[0.06]' : 'hover:bg-ditto-light-grey']"
                  >
                    <span class="flex items-center justify-between gap-3">
                      <span :class="['text-sm font-semibold', form.role === r.id ? 'text-ditto-purple' : 'text-ditto-text']">{{ r.name }}</span>
                      <svg v-if="form.role === r.id" class="w-3.5 h-3.5 text-ditto-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <span class="block text-xs text-ditto-subtext mt-0.5 leading-snug">{{ r.summary }}</span>
                  </button>
                </div>
              </div>
              <!-- What this role can do, right where you pick it -->
              <ul class="mt-3 space-y-1">
                <li v-for="cap in capabilities" :key="cap.id" class="flex items-center gap-2 text-xs" :class="roleById(form.role).can[cap.id] ? 'text-ditto-text' : 'text-ditto-subtext/60 line-through'">
                  <svg v-if="roleById(form.role).can[cap.id]" class="w-3.5 h-3.5 text-success flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <svg v-else class="w-3.5 h-3.5 text-ditto-subtext/50 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  {{ cap.label }}<span v-if="roleById(form.role).can[cap.id] === 'own'" class="text-ditto-subtext"> · their own split only</span>
                </li>
              </ul>
            </div>

            <!-- Scope -->
            <div class="md:col-span-2">
              <label class="block text-[13px] font-medium text-ditto-subtext mb-2">{{ form.role === 'artist' ? 'Which artist are they?' : 'Where does this apply?' }}</label>

              <!-- Artist role: exactly one Plan Artist -->
              <div v-if="form.role === 'artist'" class="flex flex-wrap gap-2">
                <button
                  v-for="a in artistOptions"
                  :key="a.id"
                  type="button"
                  @click="form.artistIds = [a.id]"
                  :class="['inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border text-sm transition-colors', form.artistIds[0] === a.id ? 'border-ditto-purple bg-ditto-purple/[0.06] text-ditto-purple font-semibold' : 'border-gray-200 text-ditto-text hover:border-ditto-purple/50']"
                >
                  <span class="w-6 h-6 rounded-full bg-ditto-text text-white text-[10px] font-bold flex items-center justify-center">{{ initials(a.name) }}</span>
                  {{ a.name }}
                </button>
              </div>

              <!-- Everyone else: whole account, or a set of artists -->
              <template v-else>
                <div class="flex flex-wrap gap-2 mb-3">
                  <button type="button" @click="form.scope = 'account'" :class="['px-3.5 py-1.5 rounded-full border text-sm transition-colors', form.scope === 'account' ? 'border-ditto-purple bg-ditto-purple/[0.06] text-ditto-purple font-semibold' : 'border-gray-200 text-ditto-text hover:border-ditto-purple/50']">Whole account</button>
                  <button type="button" @click="form.scope = 'artists'" :class="['px-3.5 py-1.5 rounded-full border text-sm transition-colors', form.scope === 'artists' ? 'border-ditto-purple bg-ditto-purple/[0.06] text-ditto-purple font-semibold' : 'border-gray-200 text-ditto-text hover:border-ditto-purple/50']">Selected artists only</button>
                </div>
                <div v-if="form.scope === 'artists'" class="flex flex-wrap gap-2">
                  <button
                    v-for="a in artistOptions"
                    :key="a.id"
                    type="button"
                    @click="toggleArtist(a.id)"
                    :class="['inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border text-sm transition-colors', form.artistIds.includes(a.id) ? 'border-ditto-purple bg-ditto-purple/[0.06] text-ditto-purple font-semibold' : 'border-gray-200 text-ditto-text hover:border-ditto-purple/50']"
                  >
                    <span class="w-6 h-6 rounded-full bg-ditto-text text-white text-[10px] font-bold flex items-center justify-center">{{ initials(a.name) }}</span>
                    {{ a.name }}
                  </button>
                </div>
              </template>
              <p v-if="scopeError" class="text-xs text-error mt-2">{{ scopeError }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 mt-6">
            <button @click="submitInvite" class="px-6 py-3 rounded-full bg-ditto-text text-white text-sm font-semibold hover:opacity-90 transition-opacity">{{ editing ? 'Save changes' : 'Send invite' }}</button>
            <button @click="closeInvite" class="px-5 py-3 rounded-full text-sm font-medium text-ditto-subtext hover:text-ditto-text transition-colors">Cancel</button>
          </div>
        </div>

        <!-- ── People ── -->
        <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div class="hidden md:grid grid-cols-[minmax(0,1.6fr)_120px_minmax(0,1fr)_120px_44px] gap-4 px-6 py-3 text-xs text-ditto-subtext border-b border-gray-100">
            <span>Person</span><span>Role</span><span>Access to</span><span>Status</span><span></span>
          </div>
          <div v-for="m in list" :key="m.id" :class="['grid grid-cols-1 md:grid-cols-[minmax(0,1.6fr)_120px_minmax(0,1fr)_120px_44px] gap-2 md:gap-4 px-6 py-4 items-center border-b border-gray-100 last:border-b-0', m.status === 'expired' ? 'bg-ditto-light-grey/40' : '']">
            <!-- Person -->
            <div class="flex items-center gap-3 min-w-0">
              <span :class="['w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0', m.status === 'owner' ? 'bg-ditto-purple text-white' : m.status === 'active' ? 'bg-ditto-text text-white' : 'bg-ditto-light-grey text-ditto-subtext border border-dashed border-gray-300']">{{ initials(m.name) }}</span>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-ditto-text truncate">{{ m.name }}<span v-if="m.status === 'owner'" class="ml-2 text-[10px] font-semibold uppercase tracking-wide text-ditto-purple">You</span></p>
                <p class="text-xs text-ditto-subtext truncate">{{ m.email }}</p>
              </div>
            </div>
            <!-- Role -->
            <div>
              <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold', rolePill(m.role)]">{{ m.role === 'owner' ? 'Owner' : roleById(m.role).name }}</span>
            </div>
            <!-- Scope -->
            <p class="text-sm text-ditto-text truncate" :title="scopeLabel(m)">{{ scopeLabel(m) }}</p>
            <!-- Status -->
            <div class="text-xs">
              <template v-if="m.status === 'owner' || m.status === 'active'">
                <span class="inline-flex items-center gap-1.5 text-ditto-text"><span class="w-1.5 h-1.5 rounded-full bg-success"></span>Active</span>
                <p class="text-ditto-subtext mt-0.5">{{ m.lastActive }}</p>
              </template>
              <template v-else-if="m.status === 'pending'">
                <span class="inline-flex items-center gap-1.5 text-[#92400e]"><span class="w-1.5 h-1.5 rounded-full bg-warning"></span>Invite sent</span>
                <p class="text-ditto-subtext mt-0.5">{{ m.invitedOn }}</p>
              </template>
              <template v-else>
                <span class="inline-flex items-center gap-1.5 text-error"><span class="w-1.5 h-1.5 rounded-full bg-error"></span>Invite expired</span>
                <p class="text-ditto-subtext mt-0.5">Sent {{ m.invitedOn }}</p>
              </template>
            </div>
            <!-- Actions -->
            <div class="relative justify-self-end" :ref="el => setMenuRef(m.id, el as HTMLElement | null)">
              <button v-if="m.status !== 'owner'" @click="menuFor = menuFor === m.id ? null : m.id" class="w-9 h-9 rounded-full hover:bg-ditto-light-grey flex items-center justify-center transition-colors" :aria-label="`Options for ${m.name}`">
                <svg class="w-4 h-4 text-ditto-subtext" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>
              </button>
              <svg v-else class="w-4 h-4 text-ditto-subtext/60 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" title="The account owner can't be changed here"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <div v-if="menuFor === m.id" class="absolute right-0 top-full mt-1 z-20 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl p-1.5">
                <button @click="openInvite(m)" class="w-full text-left px-3.5 py-2.5 rounded-xl text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors">Change role or access</button>
                <button v-if="m.status !== 'active'" @click="resend(m)" class="w-full text-left px-3.5 py-2.5 rounded-xl text-sm text-ditto-text hover:bg-ditto-light-grey transition-colors">Resend invite</button>
                <button @click="removeMember(m)" class="w-full text-left px-3.5 py-2.5 rounded-xl text-sm text-error hover:bg-error/5 transition-colors">{{ m.status === 'active' ? 'Remove access' : 'Cancel invite' }}</button>
              </div>
            </div>
          </div>
        </div>

        <p class="text-xs text-ditto-subtext px-1">Added by and when is kept for every change. The account owner always has full control and can't be removed.</p>
      </div>

      <!-- ── Roles at a glance ── -->
      <aside class="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 class="font-satoshi font-black tracking-[-0.03em] text-lg text-ditto-text mb-1">What each role can do</h3>
        <p class="text-sm text-ditto-subtext mb-5">Pick the smallest role that covers what they need. You can change it any time.</p>
        <div class="overflow-x-auto -mx-2">
          <table class="w-full text-xs min-w-[320px]">
            <thead>
              <tr class="text-ditto-subtext">
                <th class="text-left font-medium pb-2 pl-2"></th>
                <th v-for="r in roles" :key="r.id" class="font-semibold pb-2 text-ditto-text text-center px-1">{{ r.name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cap in capabilities" :key="cap.id" class="border-t border-gray-100">
                <td class="py-2.5 pl-2 pr-3 text-ditto-text leading-snug">{{ cap.label }}</td>
                <td v-for="r in roles" :key="r.id" class="py-2.5 text-center">
                  <template v-if="r.can[cap.id] === 'all'"><svg class="w-4 h-4 text-success inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></template>
                  <template v-else-if="r.can[cap.id] === 'own'"><span class="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded bg-ditto-purple/10 text-ditto-purple">Own</span></template>
                  <template v-else><span class="text-ditto-subtext/40">—</span></template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-[11px] text-ditto-subtext mt-4 leading-relaxed"><span class="font-semibold text-ditto-text">Own</span> means the artist's own releases and their own revenue split only. Managers and Reporters can be limited to selected artists when you invite them.</p>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { roles, capabilities, members as seedMembers, type Member, type RoleId } from '../../data/accountPermissionsMockData'
import { artists } from '../../data/artistsMockData'

const emit = defineEmits<{ (e: 'note', message: string): void }>()

const fieldClass = 'w-full px-0 py-3 border-0 border-b border-gray-300 text-base text-ditto-text bg-transparent placeholder:text-ditto-subtext focus:outline-none focus:border-ditto-purple transition-colors'

const list = reactive<Member[]>(seedMembers.map(m => ({ ...m, scope: Array.isArray(m.scope) ? [...m.scope] : m.scope })))
const activeCount = computed(() => list.filter(m => m.status === 'owner' || m.status === 'active').length)
const pendingCount = computed(() => list.filter(m => m.status === 'pending').length)

const roleById = (id: RoleId | 'owner') => roles.find(r => r.id === id) ?? roles[0]
const rolePill = (role: RoleId | 'owner') => ({
  owner: 'bg-ditto-purple text-white',
  admin: 'bg-ditto-text text-white',
  manager: 'bg-info/15 text-info',
  artist: 'bg-success/15 text-[#006633]',
  reporter: 'bg-ditto-light-grey text-ditto-text',
}[role])
const initials = (name: string) => name.split(' ').map(p => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()

// Artists on the account: Plan Artists first, then release artists
const artistOptions = computed(() => [...artists].sort((a, b) => Number(b.isPlanArtist) - Number(a.isPlanArtist)).slice(0, 10))
const artistName = (id: string) => artists.find(a => a.id === id)?.name ?? 'Unknown artist'
const scopeLabel = (m: Member) => {
  if (m.scope === 'account') return m.role === 'reporter' ? 'Whole account (read-only)' : 'Whole account'
  const names = m.scope.map(artistName)
  return names.length <= 2 ? names.join(', ') : `${names.slice(0, 2).join(', ')} +${names.length - 2}`
}

// ── Invite / edit ──
const inviting = ref(false)
const editing = ref<Member | null>(null)
const roleOpen = ref(false)
const roleWrap = ref<HTMLElement | null>(null)
const form = reactive({ email: '', role: 'manager' as RoleId, scope: 'account' as 'account' | 'artists', artistIds: [] as string[], touched: false, submitted: false })

const openInvite = (m?: Member) => {
  editing.value = m ?? null
  form.email = m?.email ?? ''
  form.role = (m && m.role !== 'owner' ? m.role : 'manager')
  form.scope = m && Array.isArray(m.scope) ? 'artists' : 'account'
  form.artistIds = m && Array.isArray(m.scope) ? [...m.scope] : []
  form.touched = false
  form.submitted = false
  menuFor.value = null
  inviting.value = true
}
const closeInvite = () => { inviting.value = false; editing.value = null; roleOpen.value = false }
const pickRole = (id: RoleId) => {
  form.role = id
  roleOpen.value = false
  if (id === 'artist') { form.scope = 'artists'; form.artistIds = form.artistIds.slice(0, 1) }
}
const toggleArtist = (id: string) => {
  const i = form.artistIds.indexOf(id)
  i > -1 ? form.artistIds.splice(i, 1) : form.artistIds.push(id)
}

const emailError = computed(() => {
  if (editing.value || (!form.touched && !form.submitted)) return ''
  if (!form.email.trim()) return form.submitted ? 'Enter an email address.' : ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'That doesn\'t look like an email address.'
  if (list.some(m => m.email.toLowerCase() === form.email.trim().toLowerCase())) return 'This person already has access.'
  return ''
})
const scopeError = computed(() => {
  if (!form.submitted) return ''
  if (form.role === 'artist' && form.artistIds.length !== 1) return 'Choose the artist this person is.'
  if (form.role !== 'artist' && form.scope === 'artists' && form.artistIds.length === 0) return 'Pick at least one artist, or choose Whole account.'
  return ''
})

let nextId = 100
const submitInvite = () => {
  form.submitted = true
  if (emailError.value || scopeError.value) return
  const scope: Member['scope'] = form.role === 'artist' || form.scope === 'artists' ? [...form.artistIds] : 'account'
  if (editing.value) {
    editing.value.role = form.role
    editing.value.scope = scope
    emit('note', `${editing.value.name} is now ${roleById(form.role).name.toLowerCase()} — applies next time they sign in`)
  } else {
    const email = form.email.trim()
    const guess = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    const name = form.role === 'artist' && form.artistIds[0] ? artistName(form.artistIds[0]) : guess
    list.splice(1, 0, { id: `m${nextId++}`, name, email, role: form.role, scope, status: 'pending', addedOn: '23 Sep 2026', addedBy: 'James Keane', invitedOn: 'Just now' })
    emit('note', `Invite sent to ${email} — they have 7 days to accept`)
  }
  closeInvite()
}

// ── Row actions ──
const menuFor = ref<string | null>(null)
const menuRefs = new Map<string, HTMLElement>()
const setMenuRef = (id: string, el: HTMLElement | null) => { el ? menuRefs.set(id, el) : menuRefs.delete(id) }
const resend = (m: Member) => {
  m.status = 'pending'
  m.invitedOn = 'Just now'
  menuFor.value = null
  emit('note', `Invite resent to ${m.email}`)
}
const removeMember = (m: Member) => {
  const i = list.findIndex(x => x.id === m.id)
  if (i > -1) list.splice(i, 1)
  menuFor.value = null
  emit('note', m.status === 'active' ? `${m.name} no longer has access` : `Invite to ${m.email} cancelled`)
}

const onDocClick = (e: MouseEvent) => {
  const t = e.target as Node
  if (roleWrap.value && !roleWrap.value.contains(t)) roleOpen.value = false
  if (menuFor.value) {
    const wrap = menuRefs.get(menuFor.value)
    if (wrap && !wrap.contains(t)) menuFor.value = null
  }
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>
