<script setup lang="ts">
import TasksLayout from "@/views/layouts/TasksLayout.vue";
import {useAutoScrollDuringDrag} from "@/hooks/ui/auto-scroll.ts";

useAutoScrollDuringDrag({
  speed: 50,
  threshold: 20, // vùng nhạy
})
</script>

<template>
  <TasksLayout />
</template>

<style scoped>

</style>
