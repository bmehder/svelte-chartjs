<script>
  export let value
</script>

<input type="date" bind:value />

<style>
  @media screen and (max-width: 600px) {
    input {
      min-width: 20%;
    }
  }
</style>
