export const currentDateTime = (): Date => {
  return new Date(
    new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
    }),
  );
};

// *** date nees to be in YYYY-MM-DD format
export const getQuarter = (date: Date): number => {
  const dateString = String(date);
  const month = parseInt(dateString.substring(5, 7));

  if (month >= 1 && month <= 3) {
    return 1;
  } else if (month >= 4 && month <= 6) {
    return 2;
  } else if (month >= 7 && month <= 9) {
    return 3;
  } else {
    return 4;
  }
};

// *** date nees to be in YYYY-MM-DD format
export const getYear = (date: Date): string => {
  const dateString = String(date);
  return dateString.substring(0, 4);
};