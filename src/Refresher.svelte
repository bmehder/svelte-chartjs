<script>
  import { scale } from 'svelte/transition'

  export let isLoading = false
</script>

<span
  class:isLoading
  on:click
  in:scale={{ delay: 400 }}
  out:scale={{ duration: 400 }}>&#x21bb;</span
>

<style>
  span {
    font-size: 3rem;
    color: #f4f4f4;
    cursor: pointer;
    user-select: none;
    max-width: 20%;
  }
  .isLoading {
    transform-origin: center;
    animation: spin 2s infinite;
    animation-delay: 200ms;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
