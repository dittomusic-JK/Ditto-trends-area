// Organisation name for Label / RLS accounts (agreed 30 Sep): optional in Account
// settings, asked for on the first invite if empty, and the identifier other people
// see in their account switcher. Separate from the account holder's name, which
// publishing ties to the writer name. Seeded empty so the first-invite prompt shows.
import { reactive } from 'vue'

export const accountOrganisation = reactive({ name: '' })
