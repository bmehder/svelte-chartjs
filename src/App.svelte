<script>
  // Data structures, util and transition functions
  import { chartTypes } from './chartTypes'
  import { reports } from './reports'
  import { printToConsole } from './console'
  import { scale } from 'svelte/transition'

  // Svelte components
  import Spinner from './Spinner.svelte'
  import DatePicker from './DatePicker.svelte'
  import Select from './Select.svelte'
  import Refresher from './Refresher.svelte'
  import Chart from './Chart.svelte'

  // App state
  const today = new Date().toISOString().slice(0, 10)
  let startDate = '2021-07-18'
  let endDate = today
  let chartType = 'bar'
  let report = 'report-1'
  let domain = 'restoreosteo'
  let isLoading = false
  let isDarkMode = false
  let isShowTotal = false
  let fetchedData = null
  let totalAppointments = 0

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

  $: domain = report === 'report-2' ? 'restoreosteo' : 'restoreosteo'

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
  $: startDate > today && (startDate = today)
  $: endDate > today && (endDate = today)

  // Predicate
  const isInvalidDateRange = () => {
    if (endDate < startDate) {
      alert('The end date cannot be before the start date.')
      return true
    }
  }

  // API request
  const getData = async url => {
    if (isInvalidDateRange()) return

    isLoading = true

    try {
      const res = await fetch(url)
      const data = await res.json()
      fetchedData = data
    } catch (err) {
      isLoading = false
      throw new Error(err)
    }

    isLoading = false
  }

  // Action
  const getSumOfAllApointments = (node, fetchedData) => {
    totalAppointments = fetchedData.datasets[0].data.reduce(
      (total, next) => (total += next)
    )
    return {
      update(fetchedData) {
        totalAppointments = fetchedData.datasets[0].data.reduce(
          (total, next) => (total += next)
        )
      },
    }
  }

  // Event handlers for page load, enter key, refresh btn, and report change
  const handleOnChange = () => {
    isShowTotal = false
    makeAPIRequest()
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
      <p>👎<br /><span>No report</span></p>
    {/if}

    {#if fetchedData && Object.keys(fetchedData).length !== 0}
      <Chart
        config={chartConfig}
        on:dblclick={() => (isShowTotal = !isShowTotal)}
      />
    {/if}

    {#if isShowTotal}
      <aside
        use:getSumOfAllApointments={fetchedData}
        transition:scale
        on:dblclick={() => (isShowTotal = false)}
      >
        {totalAppointments}
      </aside>
    {/if}
  {:catch err}
    <p>💩<br /><span>Don't panic!</span><br />{err.message}</p>
  {/await}
</main>

<footer on:dblclick={() => (isDarkMode = !isDarkMode)}>
  <Select bind:value={report} options={reports} on:change={handleOnChange} />
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

  span {
    color: red;
    font-weight: 900;
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
