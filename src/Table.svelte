<script>
  export let fetchedData = []

  let value = ''
  let isAuthorized = false

  sessionStorage.getItem('isAuthorized') &&
    (isAuthorized = JSON.parse(sessionStorage.getItem('isAuthorized')))

  $: sessionStorage.setItem('isAuthorized', JSON.stringify(isAuthorized))

  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      var intlCode = match[1] ? '+1 ' : ''
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
    }
    return null
  }

  function handleClick() {
    if (value === 'opensesame') {
      isAuthorized = true
    }
  }
</script>

<svelte:window on:keypress={e => e.key === 'Enter' && handleClick()} />

{#if !isAuthorized}
  <div>
    <input type="password" placeholder="Enter password..." bind:value />
    <button on:click={handleClick}>Login</button>
  </div>
{/if}

{#if isAuthorized}
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
        {#each data.leads as { submitted, name, requested, email, phone }}
          <tr>
            <td>{submitted}</td>
            <td>{name}</td>
            <td>{requested}</td>
            <td><a href="mailto:{email}" target="_blank">{email}</a></td>
            <td
              ><a href="tel:{phone}" target="_blank"
                >{formatPhoneNumber(phone)}</a
              ></td
            >
          </tr>
        {/each}
      </table>
    {/if}
  {/each}
{/if}

<style>
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    gap: 0.25rem;
  }
  input,
  button {
    padding: 1rem;
    border: 1px solid #777;
    border-radius: 0.25rem;
  }
  button {
    background-color: #016;
    color: #fff;
    border: none;
  }
  button:hover {
    background-color: #016d;
  }
  h3 {
    display: inline-block;
    margin-bottom: 1rem;
    color: #016;
    font-size: 2rem;
  }
  table {
    min-width: 80%;
    margin: auto;
    margin-bottom: 4rem;
    text-align: left;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border-collapse: collapse;
  }
  th {
    padding: 1rem;
    background-color: #188;
    color: white;
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
