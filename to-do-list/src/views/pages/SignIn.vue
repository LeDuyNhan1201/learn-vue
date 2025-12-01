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

<style scoped lang="scss">
.auth-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--s-4);

  .auth-form {
    width: 320px;
    padding: var(--s-6);
    background: var(--c-bg);
    border: 1px solid var(--c-border);

    /* Title */
    .auth-title {
      text-align: start;
      margin-bottom: var(--s-6);
    }

    /* Label */
    label {
      display: block;
      margin-bottom: var(--s-1);
      font-weight: var(--f-weight);
    }

    /* Inputs */
    input {
      width: 100%;
      padding: var(--s-2);
      margin-bottom: var(--s-4);
      border: 1px solid var(--c-border);
      background: var(--c-bg);
      outline: none;

      &:focus {
        border-color: var(--c-primary-h);
      }

      &:last-of-type {
        margin-bottom: 0;
      }
    }

    /* Button */
    button {
      width: 100%;
      margin-top: var(--s-3);
      background-color: var(--c-primary);
      color: white;

      &:hover {
        font-weight: var(--f-weight);
      }
    }

    /* Link */
    a {
      display: block;
      text-align: end;
      font-size: smaller;
      margin-top: var(--s-3);
      color: var(--c-primary);

      &:hover {
        color: var(--c-primary-h);
      }
    }
  }
}
</style>

<script setup lang="ts">
</script>