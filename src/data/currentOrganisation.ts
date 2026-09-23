import { reactive } from 'vue'
import { organisations, type Organisation } from './accountPermissionsMockData'

export const currentOrganisation = reactive<Organisation>({ ...organisations[0] })
export const switchOrganisation = (org: Organisation) => Object.assign(currentOrganisation, org)
