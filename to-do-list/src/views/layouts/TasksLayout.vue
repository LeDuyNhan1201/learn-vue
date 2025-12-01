<script setup lang="ts">

import Navigation from "@/components/TasksDashboard/Navigation.vue";

</script>

<template>
  <div class="container">
    <Navigation class="nav-bar" />

    <main>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .nav-bar {
    flex-shrink: 0;
  }

  main {
    padding: var(--s-2) var(--s-4);
    margin-top: var(--s-2);

    flex: 1;
    display: flex;
    flex-direction: column;

    border: 1px solid var(--c-border);
    overflow: hidden;
  }
}
</style>