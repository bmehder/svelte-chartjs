<script>
  // Data and util functions
  import { chartTypes as chartOptions } from './chartTypes'
  import { reports as reportOptions } from './reports'
  import { items } from './fake'
  import { printToConsole } from './console'

  // Svelte components
  import Spinner from './Spinner.svelte'
  import DatePicker from './DatePicker.svelte'
  import Select from './Select.svelte'
  import Refresher from './Refresher.svelte'
  import Chart from './Chart.svelte'
  import Display from './Display.svelte'
  import Error from './Error.svelte'
  import Table from './Table.svelte'

  // App state
  const TODAY = new Date().toISOString().slice(0, 10)

  let startDate = '2021-07-18'
  let endDate = TODAY
  let chartType = 'bar'
  let report = 'report-1'
  let domain = 'restoreosteo'
  let isLoading = false
  let fetchedData = null
  let error = null

  $: chartConfig = {
    type: chartType,
    data: fetchedData,
  }

  $: consoleData = {
    startDate,
    endDate,
    endPoint,
    fetchedData,
  }

  $: domain = report === 'report-2' ? 'primeregen' : 'restoreosteo'

  $: endPoint = `https://${domain}.com/?report=${report}&startDate=${startDate}&endDate=${endDate}`

  // Getters for chart settings in session storage
  sessionStorage.getItem('report') &&
    (report = sessionStorage.getItem('report'))

  sessionStorage.getItem('chartType') &&
    (chartType = sessionStorage.getItem('chartType'))

  sessionStorage.getItem('startDate') &&
    (startDate = sessionStorage.getItem('startDate'))

  sessionStorage.getItem('endDate') &&
    (endDate = sessionStorage.getItem('endDate'))

  // Setters for chart settings in session storage
  $: sessionStorage.setItem('report', report)
  $: sessionStorage.setItem('chartType', chartType)
  $: sessionStorage.setItem('startDate', startDate)
  $: sessionStorage.setItem('endDate', endDate)

  // Keep dates within a logical range
  $: startDate < '2021-07-18' && (startDate = '2021-07-18')
  $: endDate < '2021-07-18' && (endDate = '2021-07-18')
  $: startDate > TODAY && (startDate = TODAY)
  $: endDate > TODAY && (endDate = TODAY)

  // Reactive bools
  $: isInvalidDateRange = endDate < startDate
  $: isShowDates = report === 'report-1' || report === 'report-4'
  $: isDataGroupedByLabel = report === 'report-3'

  const makeAPIRequest = (node, endPoint) => {
    if (isInvalidDateRange) {
      alert('The end date cannot be before the start date.')
      return
    }

    const getData = async endPoint => {
      error = null
      fetchedData = null

      isLoading = true

      try {
        const res = await fetch(endPoint)
        const data = await res.json()
        fetchedData = data
      } catch (err) {
        isLoading = false
        error = err
      }

      isLoading = false
    }

    getData(endPoint).then(() => printToConsole(consoleData))

    return {
      update(endPoint) {
        getData(endPoint).then(() => printToConsole(consoleData))
      },
    }
  }
</script>

<svelte:window
  on:keypress={e => e.key === 'Enter' && makeAPIRequest(null, endPoint)}
/>

<main use:makeAPIRequest={endPoint}>
  {#if !fetchedData && !error}
    <Spinner />
  {/if}

  {#if error && report !== 'report-4'}
    <Error {error} />
  {/if}

  {#if fetchedData}
    <Chart config={chartConfig} />
    <Display {fetchedData} {isDataGroupedByLabel} />
  {/if}

  {#if report === 'report-4' && error}
    <div>
      <Table {items} />
    </div>
  {/if}
</main>

<footer>
  {#key report}
    <Select bind:value={report} options={reportOptions} />
    {#if report !== 'report-4'}
      <Select bind:value={chartType} options={chartOptions} />
    {/if}
    {#if isShowDates}
      <DatePicker bind:value={startDate} />
      <DatePicker bind:value={endDate} />
    {/if}
    <Refresher on:click={() => makeAPIRequest(null, endPoint)} {isLoading} />
  {/key}
</footer>

<style>
  main {
    height: 85vh;
    display: grid;
    place-items: center;
    padding: 0 2rem;
    background: white;
    text-align: center;
  }

  div {
    width: 100%;
    height: 80vh;
    overflow-y: scroll;
  }

  footer {
    height: 15vh;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background-color: #323232;
    color: white;
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
