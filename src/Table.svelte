<script>
  export let fetchedData = []

  $: console.log(JSON.stringify(items, null, 4))
</script>

{#each fetchedData as item}
  <h3>{item.location}</h3>
  <table>
    <tr>
      <th>Name</th>
      <th>Date</th>
    </tr>
    {#each item.leads as lead}
      <tr>
        <td>{lead.name}</td>
        <td>{lead.date}</td>
      </tr>
    {/each}
  </table>
{/each}

<style>
  h3 {
    margin-bottom: 1rem;
  }
  table {
    margin: auto;
    margin-bottom: 2rem;
  }
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
  td {
    padding: 1em;
  }
</style>
