export function convertHourStringToMinutes(hourString: String) {
  const [hours, minutes] = hourString.split(':').map(Number);
  const minutesAmount = (hours*60) + minutes;
  return minutesAmount;
}

export function convertMinutesToHourString(minutesAmount: number) {
  let minutes = minutesAmount % 60;
  let hours = (minutesAmount-minutes) / 60;
  return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}`;
}