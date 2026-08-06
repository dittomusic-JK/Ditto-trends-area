import { ref } from 'vue'

// Demo switch: view the dashboard as a brand-new user (empty states +
// onboarding) instead of the established Goldenboy account. Toggled from
// the user menu, persisted so the demo survives reloads.
const isNewUser = ref(localStorage.getItem('ditto-demo-new-user') === '1')

export function useDemoUser() {
  const toggleNewUser = () => {
    isNewUser.value = !isNewUser.value
    localStorage.setItem('ditto-demo-new-user', isNewUser.value ? '1' : '0')
  }
  return { isNewUser, toggleNewUser }
}
