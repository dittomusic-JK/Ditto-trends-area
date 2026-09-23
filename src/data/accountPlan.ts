// The account's live subscription for the prototype. The Subscription page's demo
// switcher writes here; anything gated on plan (video distribution) reads from it.
import { reactive } from 'vue'
import { subscriptionDemoStates, type Subscription } from './subscriptionMockData'

export const accountPlan = reactive<Subscription>({ ...subscriptionDemoStates.label5 })

export const setAccountPlan = (sub: Subscription) => Object.assign(accountPlan, sub)
