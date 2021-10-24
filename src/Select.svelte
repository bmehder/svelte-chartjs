<script>
  export let types
  export let type
</script>

<select bind:value={type}>
  {#each types as { value, name }}
    <option {value}>{name}</option>
  {/each}
</select>

<style>
  select {
    -webkit-padding: 0.5em 0;
    padding: 0.5rem;
    font-family: inherit;
    font-size: inherit;
    border: 1px solid #ccc;
    border-radius: 2px;
    outline: none;
    cursor: pointer;
    user-select: none;
  }
</style>
