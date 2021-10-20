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
    padding: 0.4rem 0.8rem;
    outline: none;
    border-radius: 0.8rem;
    font-weight: 600;
    cursor: pointer;
  }
</style>
