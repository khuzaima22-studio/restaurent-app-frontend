export const timeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [30, "day"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];

  let counter = seconds;
  let i = 0;
  while (i < intervals.length && counter >= intervals[i][0]) {
    counter = Math.floor(counter / intervals[i][0]);
    i++;
  }
  const label = intervals[i - 1][1];
  return `${counter} ${label}${counter !== 1 ? "s" : ""} ago`;
};
