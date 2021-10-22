<script>
  import { types } from './types'

  export let type
</script>

<select bind:value={type}>
  {#each types as { value, name }}
    <option {value}>{name}</option>
  {/each}
</select>

<style>
  select {
    padding: 0.5rem;
    outline: none;
    cursor: pointer;
    user-select: none;
  }
</style>
