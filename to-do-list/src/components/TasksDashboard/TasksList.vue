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

<style scoped lang="scss">
.tabs {
  display: flex;
  gap: var(--s-4);
  margin: var(--s-4) 0;
  flex-shrink: 0;

  .tab {
    padding: var(--s-2) var(--s-4);
    cursor: pointer;
    text-decoration: none;
    color: var(--c-text);
    border-bottom: 3px solid var(--c-border);
    transition: color 0.2s ease, border-color 0.2s ease;

    &:hover {
      color: var(--c-primary-h);
    }

    &.active {
      border-bottom-color: var(--c-primary-h);
      color: var(--c-primary-h);
      font-weight: var(--f-bold);
    }
  }
}

#tasks-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>