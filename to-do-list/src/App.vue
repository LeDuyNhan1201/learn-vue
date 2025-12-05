<script setup lang="ts">
import { useAutoScrollDuringDrag } from "@/hooks/ui/auto-scroll.ts";

useAutoScrollDuringDrag({
  speed: 50,
  threshold: 20, // vùng nhạy
});
</script>

<template>
  <ConfirmDialog />
  <Toast />
  <router-view />
</template>

<style scoped></style>
