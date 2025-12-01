<script setup lang="ts">
import NavigationBar from "@/components/NavigationBar.vue";
import { ref } from 'vue'
import NewTask from "@/components/TasksDashboard/NewTask.vue";
import TasksList from "@/components/TasksDashboard/TasksList.vue";

const currentView = ref<'list' | 'new' | 'edit'>('list');

const views = {
  list: TasksList,
  new: NewTask,
  edit: NewTask,
};

function handleNavSelect(view: 'list' | 'new' | 'edit') {
  currentView.value = view;
}

</script>

<template>
  <div class="container">
    <NavigationBar class="nav-bar" @select="handleNavSelect"/>

    <main>
      <!-- keep-alive + dynamic component -->
      <keep-alive>
        <component :is="views[currentView]" />
      </keep-alive>
    </main>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  padding: var(--space-1);
}

main {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-2);
  margin-top: var(--space-2);
  border: 1px solid var(--color-border);
}
</style>