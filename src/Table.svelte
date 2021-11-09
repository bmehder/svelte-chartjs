<script>
  export let fetchedData = []
</script>

{#each fetchedData as data}
  <h3>{data.location}</h3>
  <table>
    <tr>
      <th>Name</th>
      <th>Date</th>
    </tr>
    {#each data.leads as lead}
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
