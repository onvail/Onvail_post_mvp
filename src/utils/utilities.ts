export const truncateText = (text: string, maxLength: number = 40): string => {
  return (
    text.substring(0, maxLength) + `${text.length > maxLength ? '...' : ''} `
  );
};

export const convertTimeToString = (timeObj: {
  hours: number;
  minutes: number;
  seconds: number;
}) => {
  const {hours, minutes, seconds} = timeObj;

  // Pad the numbers to ensure they are always two digits
  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  // Construct the time string in HH:mm:ss format
  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
};

export const formatDate = (date: Date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed, add 1 to adjust
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const secondsToMinutesAndSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60); // Divide by 60 to get minutes
  const remainingSeconds = Math.floor(seconds % 60); // Use modulo to get remaining seconds
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`; // Pad with zero if necessary
};
