<template>
  <!-- Mobile Header -->
  <header class="mobile-header">
    <!-- Shop Icon -->
    <button class="mobile-header__icon-btn">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    </button>

    <!-- Centered Logo -->
    <img src="/img/logo-2048-black.svg" alt="Ditto" class="mobile-header__logo" />

    <!-- Hamburger Menu -->
    <button class="mobile-header__icon-btn">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
  </header>

  <!-- Desktop Header -->
  <header class="desktop-header">
    <!-- Logo and Nav -->
    <div class="desktop-header__left">
      <img src="/img/logo-2048-black.svg" alt="Ditto" class="desktop-header__logo" />

      <!-- Nav Items -->
      <nav class="desktop-nav">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="item.href"
          :class="[
            'desktop-nav__link',
            { 'desktop-nav__link--active': item.active }
          ]"
        >
          {{ item.label }}
        </a>
      </nav>
    </div>

    <!-- Right side actions -->
    <div class="desktop-header__actions">
      <button class="btn-upgrade">
        Upgrade
      </button>

      <button class="action-icon-btn">
        <IconHelp />
      </button>

      <button class="action-icon-btn">
        <IconCalendar />
      </button>

      <button class="btn-create">
        <span>&#127925;</span>
        Create
      </button>

      <!-- User Avatar -->
      <button class="avatar-btn">
        <img src="/img/avatar.jpg" alt="User" class="avatar-btn__img" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { IconHelp, IconCalendar } from '../icons'

const navItems = [
  { id: 'artists', label: 'Artists', href: '#', active: false },
  { id: 'music', label: 'Music', href: '#', active: true },
  { id: 'videos', label: 'Videos', href: '#', active: false },
  { id: 'royalties', label: 'Royalties', href: '#', active: false },
  { id: 'analytics', label: 'Analytics', href: '#', active: false },
  { id: 'promotion', label: 'Promotion', href: '#', active: false },
  { id: 'publishing', label: 'Publishing', href: '#', active: false },
]
</script>

<style lang="scss" scoped>
// ──────────────────────────────────────
// Mobile Header
// ──────────────────────────────────────
.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem; // h-16
  padding: 0 1rem;
  border-bottom: 1px solid var(--brand-border);
  background-color: #fff;

  @include md {
    display: none;
  }

  &__icon-btn {
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--blue);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  &__logo {
    height: 1.75rem; // h-7
  }
}

// ──────────────────────────────────────
// Desktop Header
// ──────────────────────────────────────
.desktop-header {
  display: none;

  @include md {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 74px;
    padding: 0 1.5rem;
    border-bottom: 1px solid var(--brand-border);
    background-color: #fff;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 2rem; // gap-8
  }

  &__logo {
    height: 1.5rem; // h-6
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 1rem; // gap-4
  }
}

// ──────────────────────────────────────
// Desktop Navigation Links
// ──────────────────────────────────────
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem; // gap-6

  &__link {
    font-size: 0.875rem;
    font-weight: 500;
    transition: color 0.15s ease;
    color: var(--blue);
    text-decoration: none;

    &:hover {
      color: var(--brand-primary);
    }

    &--active {
      color: var(--brand-primary);
    }
  }
}

// ──────────────────────────────────────
// Action Buttons (right side)
// ──────────────────────────────────────
.btn-upgrade {
  padding: 0.375rem 1rem; // py-1.5 px-4
  background-color: var(--success);
  color: var(--ditto-black);
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.9;
  }
}

.action-icon-btn {
  width: 2.25rem; // w-9
  height: 2.25rem; // h-9
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ditto-grey);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;

  &:hover {
    color: var(--blue);
  }
}

.btn-create {
  padding: 0.375rem 1rem; // py-1.5 px-4
  background-color: var(--brand-primary);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem; // gap-2
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.9;
  }
}

.avatar-btn {
  width: 2.25rem; // w-9
  height: 2.25rem; // h-9
  border-radius: 9999px;
  background-color: var(--lighter-grey);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  padding: 0;

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
