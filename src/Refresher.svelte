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

<i class="fas fa-2x fa-sync" on:click class:isLoading />

<style>
  i {
    color: #f1f1f1;
    cursor: pointer;
  }
  .isLoading {
    animation: spin 2s infinite forwards ease-in-out;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(1440deg);
    }
  }
</style>
