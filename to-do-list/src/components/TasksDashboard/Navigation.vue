<script setup lang="ts">
import {useUserStore} from "@/stores/user.store.ts";

const userSession = useUserStore();

</script>

<template>
  <nav class="navbar">
    <div class="nav-left">
      <router-link to="/tasks" class="nav-link">Home</router-link>
      <router-link to="/tasks/new" class="nav-link">New</router-link>
    </div>

    <div class="nav-right">
      <router-link
          v-if="userSession.isAuthenticated"
          :to="`/tasks/${userSession.claims.id}`"
          class="nav-link"
      >
        {{ userSession.claims.username }}
      </router-link>

      <router-link v-else to="/auth/sign-in" class="nav-link">
        Sign in
      </router-link>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--s-3) var(--s-5);
  background: var(--c-surface);
  border-bottom: 1px solid var(--c-border);
  position: sticky;
  top: 0;
  z-index: 10;

  .nav-left,
  .nav-right {
    display: flex;
    gap: var(--s-4);
  }

  .nav-link {
    font-weight: var(--f-weight);
    color: var(--c-text);
    text-decoration: none;
    padding: var(--s-1) var(--s-3);
    transition: background 0.25s, color 0.25s;

    &:hover {
      background: var(--c-primary-h);
      color: white;
    }
  }
}
</style>

