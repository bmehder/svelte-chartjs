<script>
  export let value
</script>

<input type="date" bind:value />

<style>
  input {
    -webkit-padding: 0.4em 0;
    padding: 0.4em;
    font-family: inherit;
    font-size: inherit;
    border: 1px solid #ccc;
    border-radius: 2px;
  }
  @media screen and (max-width: 600px) {
    input {
      min-width: 20%;
    }
  }
</style>
