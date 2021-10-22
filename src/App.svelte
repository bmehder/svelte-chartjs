<script>
  import { chartType, myOptions } from './settings'

  import Spinner from './Spinner.svelte'
  import DatePicker from './DatePicker.svelte'
  import Select from './Select.svelte'
  import Refresher from './Refresher.svelte'
  import Chart from './Chart.svelte'

  const today = new Date().toISOString().slice(0, 10)

  let startDate = '2021-07-18'
  let endDate = today
  let type = chartType

  let fetchedData
  let isDarkMode = false

  let apiRoute = `/api/get.json?startDate=${startDate}&endDate=${endDate}`

  $: config = {
    type,
    data: fetchedData,
    options: myOptions,
  }

  const getData = async url => {
    console.log('Start: ' + startDate)
    console.log('End: ' + endDate)
    console.log('')

    const res = await fetch(url)
    const data = await res.json()

    fetchedData = data
  }

  const promise = getData(apiRoute)

  const refreshData = () => getData(apiRoute)

  $: console.log('Request:')
  $: console.log(window.location.href + apiRoute)
  $: console.log('')
  $: fetchedData &&
    console.log('Response: \n' + JSON.stringify(fetchedData, null, 4))
</script>

<header on:dblclick={() => (isDarkMode = !isDarkMode)}>
  <DatePicker bind:value={startDate} />
  <DatePicker bind:value={endDate} />
  <Select bind:type />
  <Refresher on:click={refreshData} />
</header>

<main class:dark={isDarkMode}>
  {#await promise}
    <Spinner />
  {:then}
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
