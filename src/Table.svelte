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

  function sortTable(e, n, i) {
    var table,
      rows,
      switching,
      i,
      x,
      y,
      shouldSwitch,
      dir,
      switchcount = 0
    table = document.querySelector('.table' + i)
    switching = true
    // Set the sorting direction to ascending:
    dir = 'asc'
    /* Make a loop that will continue until
  no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false
      rows = table.rows
      /* Loop through all table rows (except the
    first, which contains table headers): */
      for (i = 1; i < rows.length - 1; i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false
        /* Get the two elements you want to compare,
      one from current row and one from the next: */
        x = rows[i].getElementsByTagName('TD')[n]
        y = rows[i + 1].getElementsByTagName('TD')[n]
        /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
        if (dir == 'asc') {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true
            break
          }
        } else if (dir == 'desc') {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true
            break
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
        switching = true
        // Each time a switch is done, increase this count by 1:
        switchcount++
      } else {
        /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == 'asc') {
          dir = 'desc'
          switching = true
        }
      }
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

{#if isAuthorized && fetchedData}
  <main>
    {#each fetchedData as data, i}
      {#if data.leads.length !== 0}
        <h3>{data.location}</h3>
        <table class={`table${i}`}>
          <tr>
            <th on:click={e => sortTable(e, 0, i)}>Submitted</th>
            <th on:click={e => sortTable(e, 1, i)}>Name</th>
            <th on:click={e => sortTable(e, 2, i)}>Date Requested</th>
            <th on:click={e => sortTable(e, 3, i)}>Email</th>
            <th on:click={e => sortTable(e, 4, i)}>Phone</th>
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
  </main>
{/if}

<style>
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    gap: 0.25rem;
  }
  main {
    width: 100%;
    height: 80vh;
    overflow-y: scroll;
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
  th:hover {
    text-decoration: underline;
    cursor: pointer;
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
