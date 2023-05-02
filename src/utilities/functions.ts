export const currentDateTime = (): Date => {
  return new Date(
    new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
    }),
  );
};
