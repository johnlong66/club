<template>
  <NuxtRouteAnnouncer />
  <nav class="nav">
    <NuxtLink to="/" class="nav-link">Personen</NuxtLink>
    <NuxtLink to="/statistik" class="nav-link">Statistik</NuxtLink>
  </nav>
  <NuxtPage />
</template>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f9fafb; color: #111827; min-height: 100dvh;
}
</style>

<style scoped>
.nav {
  display: flex;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  max-width: 640px;
  margin: 0 auto;
}
.nav-link {
  padding: 0.35rem 0.85rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #6b7280;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}
.nav-link:hover { background: #f3f4f6; color: #111827; }
.nav-link.router-link-active { background: #eef2ff; color: #4f46e5; }
</style>
