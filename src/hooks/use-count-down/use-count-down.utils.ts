import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { HOURS_PER_DAY, MINUTES_PER_HOUR, SECONDS_PER_MINUTE } from './use-count-down.const';

export const formattedNumber = (number: number) => {
  // Handle negative numbers by treating them as 0
  const safeNumber = Math.max(0, number);
  if (safeNumber < 10) return `0${safeNumber}`;
  return safeNumber.toString();
};

export const convertTimeCountDown = (finishTime: Date, startTime: Date) => {
  // Prevent negative countdown values when finishTime has passed
  if (finishTime <= startTime) {
    return ['00', '00', '00', '00'];
  }

  const days = formattedNumber(differenceInDays(finishTime, startTime));
  const hours = formattedNumber(differenceInHours(finishTime, startTime) % HOURS_PER_DAY);
  const minutes = formattedNumber(differenceInMinutes(finishTime, startTime) % MINUTES_PER_HOUR);
  const seconds = formattedNumber(differenceInSeconds(finishTime, startTime) % SECONDS_PER_MINUTE);

  return [days.toString(), hours.toString(), minutes.toString(), seconds.toString()];
};
