<template>
  <div class="auth-container">
    <form class="auth-form">
      <h2 class="auth-title">Sign In</h2>

      <label>Email</label>
      <input type="email" required>

      <label>Password</label>
      <input type="password" required>

      <a class="link-right" href="/auth/forgot">Recover password</a>

      <button type="submit">Sign in</button>

      <a class="link-center" href="/auth/sign-up">Already have account? Sign up</a>
    </form>
  </div>
</template>

<style scoped>
/*
  auth-container: căn giữa form theo cả chiều ngang & dọc
  sử dụng màu và spacing từ CSS global
*/
.auth-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-4);
}

.auth-form {
  width: 320px;
  padding: var(--space-6);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
}

/* Title */
.auth-title {
  text-align: start;
  margin-bottom: var(--space-6);
}

/* Label */
.auth-form > label {
  display: block;
  margin-bottom: var(--space-1);
  font-weight: var(--font-weight-base);
}

/* Inputs */
.auth-form > input {
  width: 100%;
  padding: var(--space-2);
  margin-bottom: var(--space-4);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  outline: none;
}

.auth-form > input:focus {
  border-color: var(--color-primary-hover);
}

.auth-form > input:last-of-type {
  margin-bottom: 0;
}

/* Button */
.auth-form > button {
  width: 100%;
  margin-top: var(--space-3);
  background-color: var(--color-primary);
  color: white;
}

.auth-form > button:hover {
  font-weight: var(--font-weight-base);
}

.auth-form > a {
  display: block;
  text-align: end;
  font-size: smaller;
  margin-top: var(--space-3);
}
</style>
<script setup lang="ts">
</script>