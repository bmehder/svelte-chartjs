<script context="module">
  import Chart from 'chart.js/auto'
  import { scale } from 'svelte/transition'
</script>

<script>
  export let config

  let canvasEl
  let dataURL

  const handleChart = (element, config) => {
    let theChart = new Chart(element, config)

    return {
      update(config) {
        theChart.destroy()
        theChart = new Chart(element, config)
      },
      destroy() {
        theChart.destroy()
      },
    }
  }

  const saveChart = () => (dataURL = canvasEl?.toDataURL())
</script>

<canvas bind:this={canvasEl} use:handleChart={config} on:dblclick={saveChart} />

{#if dataURL}
  <aside transition:scale>
    <input value={dataURL} />
    <button on:click={() => (dataURL = null)}>X</button>
  </aside>
{/if}

<style>
  canvas {
    max-height: 80vh;
  }
  aside {
    position: absolute;
    padding: 1rem;
    display: flex;
    background-color: white;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.24);
  }
  input,
  button {
    padding: 1rem;
    z-index: 1;
    cursor: pointer;
  }
</style>
