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

  const saveImageToClipboard = () => {
    dataURL = canvasEl?.toDataURL()
    navigator.clipboard.writeText(dataURL).then(() => alert('Copied'))
  }
</script>

<canvas
  bind:this={canvasEl}
  use:handleChart={config}
  on:dblclick={saveImageToClipboard}
/>

<style>
  canvas {
    max-height: 80vh;
  }
</style>
