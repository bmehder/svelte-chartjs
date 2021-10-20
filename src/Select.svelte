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
    display: block;
    padding: 0.5rem 1rem;
    outline: none;
    border-radius: 1rem;
    font-weight: 600;
  }
</style>
