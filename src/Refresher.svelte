<script>
  export let isLoading = false
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
</svelte:head>

<i class="fas fa-2x fa-sync" class:isLoading on:click />

<style>
  i {
    color: #f4f4f4;
    cursor: pointer;
  }
  .isLoading {
    animation: spin 2s infinite;
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
