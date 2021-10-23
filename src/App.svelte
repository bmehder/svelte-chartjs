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
  let isLoading = false

  let apiRoute = `api/get.json?startDate=${startDate}&endDate=${endDate}`

  $: config = {
    type,
    data: fetchedData,
    options: myOptions,
  }

  const getData = async url => {
    isLoading = true
    printToConsole()
    const res = await fetch(url)
    const data = await res.json()

    fetchedData = data
    isLoading = false
  }

  const printToConsole = () => {
    console.clear()
    console.log('%c\nStart Date   End Date', 'font-weight: bold;')
    console.log(startDate + '   ' + endDate + '\n\n')
    console.log('%cRequest:', 'font-weight: bold;')
    console.log(window.location.href + apiRoute + '\n\n')
  }

  const promise = getData(apiRoute)

  const refreshData = () => {
    getData(apiRoute)
  }

  $: fetchedData && console.log('%cResponse:', 'font-weight: bold;')
  $: fetchedData && console.log(JSON.stringify(fetchedData, null, 4))
</script>

<main class:dark={isDarkMode}>
  {#await promise}
    <Spinner />
  {:then}
    <Chart {config} />
  {/await}
</main>

<footer on:dblclick={() => (isDarkMode = !isDarkMode)}>
  <Select bind:type />
  <DatePicker bind:value={startDate} />
  <DatePicker bind:value={endDate} />
  <Refresher on:click={refreshData} {isLoading} />
</footer>

<style>
  footer {
    height: 15vh;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    /* padding-left: 60px; */
    background-color: #323232;
  }
  main {
    height: 85vh;
    display: grid;
    place-items: center;
    padding: 2rem;
    background: white;
  }
  .dark {
    background-color: #424242;
  }
</style>
