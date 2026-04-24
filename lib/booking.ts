export function buildBookingDate(date: string, time: string) {
  const [timePart, meridiem] = time.split(' ')
  const [hoursRaw, minutesRaw] = timePart.split(':')
  let hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)

  if (Number.isNaN(hours) || Number.isNaN(minutes) || !meridiem) {
    return null
  }

  if (meridiem === 'PM' && hours !== 12) {
    hours += 12
  }

  if (meridiem === 'AM' && hours === 12) {
    hours = 0
  }

  const [year, month, day] = date.split('-').map(Number)
  if ([year, month, day].some((part) => Number.isNaN(part))) {
    return null
  }

  return new Date(year, month - 1, day, hours, minutes, 0, 0)
}
