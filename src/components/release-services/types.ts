// Types for the services components, ported 1:1 from the
// ditto-services project (ditto_royalty_splits).

export type Plan = 'Starter' | 'Pro' | 'Label' | 'DittoPlusRLS'
export type ServiceStatus = 'available' | 'active' | 'unavailable'
export type ModalStep = 'select' | 'add' | 'upgrade'

export interface LabelOption {
  name: string
  isBeatportLabel: boolean
}
