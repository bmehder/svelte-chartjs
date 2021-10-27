<script>
  import { chartTypes } from './chartTypes'
  import { reports } from './reports'
  import { printToConsole } from './console'
  import { scale } from 'svelte/transition'

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

  $: endPoint = `https://restoreosteo.com/?report=${report}&startDate=${startDate}&endDate=${endDate}`

  let isLoading = false
  let isDarkMode = false
  let isShowTotal = false
  let fetchedData = null

  const totalAppointments = (node, fetchedData) =>
    (node.textContent = fetchedData.datasets[0].data.reduce(
      (total, next) => (total += next)
    ))

  $: chartConfig = {
    type: chartType,
    data: fetchedData,
  }

  const isInvalidDateRange = () => {
    if (endDate < startDate) {
      alert('The end date cannot be before the start date.')
      return false
    }
  }

  const getData = async url => {
    if (isInvalidDateRange()) return

    isShowTotal = false
    isLoading = true

    try {
      const res = await fetch(url)
      const data = await res.json()
      fetchedData = data
    } catch (err) {
      isLoading = false
      console.error(err)
      throw Error('Failed to fetch')
    }

    isLoading = false
  }

  $: consoleData = {
    startDate,
    endDate,
    endPoint,
    fetchedData,
  }

  const makeAPIRequest = () =>
    getData(endPoint).then(() => printToConsole(consoleData))
</script>

<svelte:window on:keypress={e => e.key === 'Enter' && makeAPIRequest()} />

<main class:dark={isDarkMode}>
  {#await makeAPIRequest()}
    <Spinner />
  {:then _}
    {#if fetchedData?.length === 0}
      <p>👎<br />No report yet</p>
    {/if}

    {#if fetchedData && Object.keys(fetchedData).length !== 0}
      <Chart
        config={chartConfig}
        on:dblclick={() => (isShowTotal = !isShowTotal)}
      />
    {/if}

    {#if isShowTotal}
      <aside
        use:totalAppointments={fetchedData}
        transition:scale
        on:dblclick={() => (isShowTotal = false)}
      />
    {/if}
  {:catch err}
    <p>💩<br />{err}</p>
  {/await}
</main>

<footer on:dblclick={() => (isDarkMode = !isDarkMode)}>
  <Select bind:value={report} options={reports} on:change={makeAPIRequest} />
  <Select bind:value={chartType} options={chartTypes} />
  <DatePicker bind:value={startDate} />
  <DatePicker bind:value={endDate} />
  <Refresher on:click={makeAPIRequest} {isLoading} />
</footer>

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

  aside {
    position: absolute;
    user-select: none;
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
