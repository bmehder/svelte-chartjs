<script>
  export let fetchedData = []
  export let isDataGroupedByLabel

  let totalOfDataByDatasets = []
  let totalOfAllData

  const sumAllDataByDataset = node => {
    totalOfDataByDatasets = []
    for (let i = 0; i < fetchedData.labels.length; i++) {
      totalOfDataByDatasets = [
        ...totalOfDataByDatasets,
        fetchedData.datasets
          .map(dataset => dataset.data[i])
          .reduce((total, next) => (total += next)),
      ]
    }
    return {
      destroy() {
        totalOfDataByDatasets = []
      },
    }
  }

  const sumAllData = (node, fetchedData) => {
    const getSumOfAllData = () => {
      totalOfAllData = fetchedData.datasets.map(dataset =>
        dataset.data.reduce((total, next) => (total += next))
      )
      if (totalOfAllData.length) {
        totalOfAllData = totalOfAllData.reduce((total, next) => (total += next))
      }
    }

    getSumOfAllData()

    return {
      update(fetchedData) {
        getSumOfAllData()
      },
      destroy() {
        totalOfAllData = 0
      },
    }
  }
</script>

{#if isDataGroupedByLabel}
  <aside use:sumAllDataByDataset>
    {#each totalOfDataByDatasets as totalOfDataByDataset}
      <li>{totalOfDataByDataset}</li>
    {/each}
  </aside>
{/if}

<aside use:sumAllData={fetchedData}>
  {`${totalOfAllData} total`}
</aside>

<style>
  aside {
    width: 100%;
    display: flex;
    justify-content: space-around;
    padding-left: 24px;
    font-size: 2vw;
  }

  li {
    list-style-type: none;
  }
</style>
