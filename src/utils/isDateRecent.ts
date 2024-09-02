export const isDateRecent = ({ date, days }: { date: string, days: number }): boolean => {
  if (!date) return false;

  const postDateInMs = new Date(date).getTime();
  const currentDateInMs = new Date().getTime();
  const elapsedTimeInMs = currentDateInMs - postDateInMs;
  const elapsedDays = elapsedTimeInMs / (1000 * 3600 * 24);

  return elapsedDays <= days;
};
