<script>
  // Data structures, util and transition functions
  import { chartTypes } from './chartTypes'
  import { reports } from './reports'
  import { printToConsole } from './console'

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
  $: startDate > today && (startDate = today)
  $: endDate > today && (endDate = today)

  // Predicate
  const isInvalidDateRange = () => {
    if (endDate < startDate) {
      alert('The end date cannot be before the start date.')
      return true
    }
  }

  const sumAllMonthlyAppointments = () => {
    let totalMonthlyAppointments = []
    for (let i = 0; i < fetchedData.labels.length; i++) {
      totalMonthlyAppointments = [
        ...totalMonthlyAppointments,
        fetchedData.datasets
          .map(dataset => dataset.data[i])
          .reduce((total, next) => (total += next)),
      ]
    }
    return totalMonthlyAppointments
  }

  const sumAllAppointments = (node, fetchedData) => {
    totalAppointments = fetchedData.datasets
      .map(dataset => dataset.data.reduce((total, next) => (total += next)))
      .reduce((total, next) => (total += next))

    return {
      update(fetchedData) {
        totalAppointments = fetchedData.datasets
          .map(dataset => dataset.data.reduce((total, next) => (total += next)))
          .reduce((total, next) => (total += next))
      },
      destroy() {
        totalAppointments = 0
      },
    }
  }

  const getData = async url => {
    if (isInvalidDateRange()) return

    fetchedData = null
    isLoading = true

    try {
      const res = await fetch(url)
      const data = await res.json()
      fetchedData = data
    } catch (err) {
      isLoading = false
      console.error("Don't panic, but... " + err)
    }

    isLoading = false
  }

  const makeAPIRequest = (node, endPoint) => {
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
  {#if !fetchedData}
    <Spinner />
  {:else}
    <Chart config={chartConfig} />
    {#if report === 'report-3'}
      <aside>
        {#each sumAllMonthlyAppointments() as monthlyAppointments}
          <li>{monthlyAppointments}</li>
        {/each}
      </aside>
    {/if}
    <aside use:sumAllAppointments={fetchedData}>
      {`${totalAppointments} total`}
    </aside>
  {/if}
</main>

<footer>
  {#key report}
    <Select bind:value={report} options={reports} />
    <Select bind:value={chartType} options={chartTypes} />
    {#if report !== 'report-3'}
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

  aside {
    width: 100%;
    display: flex;
    justify-content: space-around;
    font-size: 2vw;
  }

  li {
    list-style-type: none;
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
