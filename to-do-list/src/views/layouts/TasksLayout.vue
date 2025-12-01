<script setup lang="ts">

import Navigation from "@/components/TasksDashboard/Navigation.vue";

</script>

<template>
  <div class="container">
    <Navigation class="nav-bar"/>

    <main>
      <router-view v-slot="{ Component }">
        <component :is="Component"/>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

main {
  /*overflow-y: auto;*/
  padding: var(--space-2) var(--space-4);
  margin-top: var(--space-2);
  border: 1px solid var(--color-border);
  flex: 1;          /* take remaining height below nav-bar */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* optional, prevents overflow scroll */
}
</style>