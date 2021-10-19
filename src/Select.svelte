<script>
	import { types } from './types'
	
	export let type
</script>

<select bind:value={type}>
	{#each types as {value, name}}
		<option {value}>{name}</option>
	{/each}
</select>

<style>
	select {
		display: block;
		margin: 1rem auto;
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		outline: none;
	}
</style>