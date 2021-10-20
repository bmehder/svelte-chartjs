<script>
  import { chartType, myOptions } from './settings'

  import Spinner from './Spinner.svelte'
  import Select from './Select.svelte'
  import Refresher from './Refresher.svelte'
  import Chart from './Chart.svelte'

  const API_ROUTE = './api/get.json'

  let type = chartType
  let fetchedData
  let isDarkMode = false

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

  const promise = getData(API_ROUTE)

  const refreshData = () => getData(API_ROUTE)
</script>

<header on:dblclick={() => (isDarkMode = !isDarkMode)}>
  <Select bind:type />
  <Refresher on:click={refreshData} />
</header>

<main class:dark={isDarkMode}>
  {#await promise}
    <Spinner />
  {:then _dataReceived}
    <Chart {config} />
  {/await}
</main>

<style>
  header {
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: baseline;
    gap: 1rem;
    padding: 1.5rem;
    padding-left: 60px;
    background-color: #323232;
  }
  main {
    height: 90vh;
    display: grid;
    place-items: center;
    padding: 2rem;
    background: white;
  }
  .dark {
    background-color: #424242;
  }
</style>
