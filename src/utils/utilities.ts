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
