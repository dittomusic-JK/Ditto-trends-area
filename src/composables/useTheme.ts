import { ref } from 'vue'

// App-wide dark mode. The 'dark' class on <html> drives the Tailwind utility
// retargets in tailwind.css; App.vue mirrors the state onto the legacy
// data-ditto-colors-light-dark-mode attribute for the Anima token scope.
const isDark = ref(localStorage.getItem('ditto-theme') === 'dark')

const apply = () => {
  document.documentElement.classList.toggle('dark', isDark.value)
}
apply()

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('ditto-theme', isDark.value ? 'dark' : 'light')
    apply()
  }
  return { isDark, toggleTheme }
}
