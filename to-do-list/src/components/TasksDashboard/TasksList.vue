<script setup lang="ts">
import {useRoute} from "vue-router";
import {useRefreshStateStore} from "@/stores/refresh-state.store.ts";
import {onActivated} from "vue";

const route = useRoute()

function isActive(tab: string) {
  return route.path.endsWith(tab)
}

// console.log("Task Dashboard")

const refreshState = useRefreshStateStore();

onActivated(() => {
  if (refreshState.getModified) {
    console.log('Fetch API');
    refreshState.setModified(false);
  }
});

</script>

<template>
  <h2>Tasks</h2>

  <!-- Tab menu -->
  <nav class="tabs">
    <router-link to="/tasks/table" class="tab" :class="{ active: isActive('table') }">Table</router-link>
    <router-link to="/tasks/board" class="tab" :class="{ active: isActive('board') }">Board</router-link>
  </nav>

  <main id="tasks-content">
    <router-view/>
  </main>
</template>

<style scoped>
.tabs {
  flex-shrink: 0; /* tabs stay fixed height */
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-4);
  margin-bottom: var(--space-4);
}

.tab {
  padding: var(--space-2) var(--space-4);
  cursor: pointer;
  border-bottom: 3px solid var(--color-border);
  text-decoration: none;
  color: var(--color-text);
}

.tab.active {
  border-bottom-color: var(--color-primary-hover);
  color: var(--color-primary-hover);
  font-weight: bold;
}

.tab:hover {
  color: var(--color-primary-hover);
}

main {
  flex: 1; /* fill remaining height under tabs */
  display: flex;
  flex-direction: column;
  overflow: auto; /* scroll if content exceeds height */
}
</style>