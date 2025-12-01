<script setup lang="ts">
import {useUserStore} from "@/stores/user.store.ts";

const userSession = useUserStore();

</script>

<template>
  <nav class="navbar">
    <div class="nav-left">
      <router-link class="nav-item" to="/tasks">Home</router-link>
      <router-link class="nav-item" to="/tasks/new">New</router-link>
    </div>

    <div class="nav-right">
      <a
          v-if="userSession.isAuthenticated"
          :href="`/tasks/${userSession.claims.id}`"
          class="nav-user"
      >
        {{ userSession.claims.username }}
      </a>

      <a v-else href="/auth/sign-in" class="nav-link">
        Sign in
      </a>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: var(--space-3) var(--space-5);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);

  position: sticky;
  top: 0;
  z-index: 10;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

/* Text button items */
.nav-item {
  cursor: pointer;
  font-weight: var(--font-weight-base);
  color: var(--color-text);
  transition: color 0.2s ease;
}

.nav-item:hover {
  color: var(--color-primary-hover);
}

/* Link buttons */
.nav-link,
.nav-user {
  color: var(--color-text);
  text-decoration: none;
  font-weight: var(--font-weight-base);
  padding: var(--space-1) var(--space-3);
  transition: background .25s ease, color .25s ease;
}

.nav-link:hover,
.nav-user:hover {
  background: var(--color-primary-hover);
  color: white;
}
</style>