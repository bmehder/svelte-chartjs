<script>
  import Spinner from './Spinner.svelte'
  import DatePicker from './DatePicker.svelte'
  import Select from './Select.svelte'
  import Refresher from './Refresher.svelte'
  import Chart from './Chart.svelte'

  const today = new Date().toISOString().slice(0, 10)

  let startDate = '2021-07-18'
  let endDate = today
  let type = 'bar'

  $: startDate
  $: endDate

  let apiRoute = () => {
    return `api/get.json?startDate=${startDate}&endDate=${endDate}`
  }

  let fetchedData = null
  let isLoading = false
  let isDarkMode = false

  $: config = {
    type,
    data: fetchedData,
  }

  const getData = async url => {
    isLoading = true

    const res = await fetch(url)
    !res.ok && (isLoading = false)

    const data = await res.json()

    fetchedData = data

    isLoading = false
  }

  const printToConsole = () => {
    console.clear()
    console.log('%c\nStart Date   End Date', 'font-weight: bold;')
    console.log(startDate + '   ' + endDate + '\n\n')
    console.log('%cRequest:', 'font-weight: bold;')
    console.log(window.location.href + apiRoute() + '\n\n')
    console.log('%cResponse:', 'font-weight: bold;')
    console.log(JSON.stringify(fetchedData, null, 4))
  }

  const promise = getData(apiRoute()).then(() => printToConsole())

  const refreshData = () => getData(apiRoute()).then(() => printToConsole())
</script>

<svelte:window on:keypress={e => e.key === 'Enter' && refreshData()} />

<main class:dark={isDarkMode}>
  {#await promise}
    <Spinner />
  {:then _}
    <Chart {config} />
  {:catch err}
    <p>💩<br />{err}</p>
  {/await}
</main>

<footer on:dblclick={() => (isDarkMode = !isDarkMode)}>
  <Select bind:type />
  <DatePicker bind:value={startDate} />
  <DatePicker bind:value={endDate} />
  <Refresher on:click={refreshData} {isLoading} />
</footer>

<style>
  main {
    height: 85vh;
    display: grid;
    place-items: center;
    padding: 0 2rem;
    background: white;
  }
  p {
    font-size: 10vw;
    text-align: center;
  }
  footer {
    height: 15vh;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background-color: #323232;
  }
  .dark {
    background-color: #424242;
  }

  :global(*) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  :global(body) {
    color: #333;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  }
</style>
