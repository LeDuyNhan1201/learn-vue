<script setup lang="ts"></script>

<template>
  <div class="container">
    <form>
      <input
        type="email"
        required
      />
      <input
        type="password"
        required
      />
    </form>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

form {
  background-color: red;
  padding: 20px;
  border-radius: 10px;
}
</style>
