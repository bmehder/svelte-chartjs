export const printToConsole = data => {
  console.clear()
  queueMicrotask(
    console.log.bind(console, '%c\nStart Date | End Date', 'font-weight: bold;')
  )
  queueMicrotask(
    console.log.bind(console, data.startDate + '   ' + data.endDate + '\n\n')
  )
  queueMicrotask(console.log.bind(console, '%cRequest', 'font-weight: bold;'))
  queueMicrotask(
    console.log.bind(console, window.location.href + data.apiRoute() + '\n\n')
  )
  queueMicrotask(console.log.bind(console, '%cResponse', 'font-weight: bold;'))
  queueMicrotask(
    console.log.bind(console, JSON.stringify(data.fetchedData, null, 4))
  )
}
