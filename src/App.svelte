<script>
  import { chartType, myOptions } from './settings'

  import Select from './Select.svelte'
  import Chart from './Chart.svelte'

  let type = chartType
  let fetchedData

  $: config = {
    type,
    data: fetchedData,
    options: myOptions,
  }

  const getData = async url => {
    const res = await fetch(url)
    const data = await res.json()

    fetchedData = data
  }

  const promise = getData('./api.json')
</script>

<Select bind:type />

{#await promise}
  <p>loading...</p>
{:then}
  <Chart {config} />
{/await}
