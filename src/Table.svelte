<script>
  export let fetchedData = []

  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }
    return null
  }
</script>

{#each fetchedData as data}
  {#if data.leads.length !== 0}
    <h3>{data.location}</h3>
    <table>
      <tr>
        <th>Submitted</th>
        <th>Name</th>
        <th>Date Requested</th>
        <th>Email</th>
        <th>Phone</th>
      </tr>
      {#each data.leads as lead}
        <tr>
          <td>{lead.submitted}</td>
          <td>{lead.name}</td>
          <td>{lead.requested}</td>
          <td><a href="mailto:{lead.email}" target="_blank">{lead.email}</a></td
          >
          <td
            ><a href="tel:{lead.telephone}" target="_blank"
              >{formatPhoneNumber(lead.phone)}</a
            ></td
          >
        </tr>
      {/each}
    </table>
  {/if}
{/each}

<style>
  h3 {
    display: inline-block;
    margin-bottom: 2rem;
    color: #016;
    font-size: 2rem;
    border-bottom: 4px solid;
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
  a {
    color: #016;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
</style>
