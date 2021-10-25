<script>
  import { chartTypes } from './chartTypes'
  import { reports } from './reports'

  import Spinner from './Spinner.svelte'
  import DatePicker from './DatePicker.svelte'
  import Select from './Select.svelte'
  import Refresher from './Refresher.svelte'
  import Chart from './Chart.svelte'

  const today = new Date().toISOString().slice(0, 10)

  let startDate = '2021-07-18'
  let endDate = today
  let chartType = 'bar'
  let report = 'report-1'

  sessionStorage.getItem('report') &&
    (report = sessionStorage.getItem('report'))

  sessionStorage.getItem('chartType') &&
    (chartType = sessionStorage.getItem('chartType'))

  sessionStorage.getItem('startDate') &&
    (startDate = sessionStorage.getItem('startDate'))

  sessionStorage.getItem('endDate') &&
    (endDate = sessionStorage.getItem('endDate'))

  $: sessionStorage.setItem('report', report)
  $: sessionStorage.setItem('chartType', chartType)
  $: sessionStorage.setItem('startDate', startDate)
  $: sessionStorage.setItem('endDate', endDate)

  $: endDate > today && (endDate = today)

  let apiRoute = () => {
    return `api/get.json?report=${report}&startDate=${startDate}&endDate=${endDate}`
  }

  let fetchedData = null
  let isLoading = false
  let isDarkMode = false

  $: config = {
    type: chartType,
    data: fetchedData,
  }

  const isValidDateRange = () => endDate > startDate

  const showInvalidDateMessage = () =>
    alert(
      'The end date is before the start date, and my T.A.R.D.I.S. is in the shop. 🤡'
    )

  const getData = async url => {
    if (!isValidDateRange()) {
      showInvalidDateMessage()
      return
    }

    isLoading = true

    try {
      const res = await fetch(url)

      if (!res.ok) {
        isLoading = false
        return
      }

      const data = await res.json()

      fetchedData = data
    } catch (err) {
      isLoading = false
      throw Error('Failed to fetch')
    }

    isLoading = false
  }

  const printToConsole = () => {
    console.clear()
    queueMicrotask(
      console.log.bind(
        console,
        '%c\nStart Date | End Date',
        'font-weight: bold;'
      )
    )
    queueMicrotask(
      console.log.bind(console, startDate + '   ' + endDate + '\n\n')
    )
    queueMicrotask(console.log.bind(console, '%cRequest', 'font-weight: bold;'))
    queueMicrotask(
      console.log.bind(console, window.location.href + apiRoute() + '\n\n')
    )
    queueMicrotask(
      console.log.bind(console, '%cResponse', 'font-weight: bold;')
    )
    queueMicrotask(
      console.log.bind(console, JSON.stringify(fetchedData, null, 4))
    )
  }

  const promise = getData(apiRoute()).then(() => printToConsole())

  const refreshData = () => getData(apiRoute()).then(() => printToConsole())
</script>

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
  <Select bind:type={report} types={reports} on:change={refreshData} />
  <Select bind:type={chartType} types={chartTypes} />
  <DatePicker bind:value={startDate} />
  <DatePicker bind:value={endDate} />
  <Refresher on:click={refreshData} {isLoading} />
</footer>

<svelte:window on:keypress={e => e.key === 'Enter' && refreshData()} />

<style>
  main {
    height: 85vh;
    display: grid;
    place-items: center;
    padding: 0 2rem;
    background: white;
    text-align: center;
    font-size: 10vw;
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
