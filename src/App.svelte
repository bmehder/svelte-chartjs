<script>
  import { chartType, myOptions } from './settings'

  import Select from './Select.svelte'
  import Refresher from './Refresher.svelte'
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

  const promise = getData('./api/get.json')

  const refresh = () => getData('./api/get.json')
</script>

<header>
  <Select bind:type />
  <Refresher on:click={refresh} />
</header>

{#await promise}
  <p>loading...</p>
{:then _dataReceived}
  <Chart {config} />
{/await}

<style>
  header {
    display: flex;
    justify-content: center;
    align-items: baseline;
    gap: 1rem;
  }
</style>
