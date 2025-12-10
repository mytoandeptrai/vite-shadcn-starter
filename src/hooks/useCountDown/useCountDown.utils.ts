import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import { HOURS_PER_DAY, MINUTES_PER_HOUR, SECONDS_PER_MINUTE } from "./useCountDown.const";

export const formattedNumber = (number: number) => {
  if (number < 10) return `0${number}`;
  return number.toString();
};

export const convertTimeCountDown = (finishTime: Date, startTime: Date) => {
  const days = formattedNumber(differenceInDays(finishTime, startTime));
  const hours = formattedNumber(differenceInHours(finishTime, startTime) % HOURS_PER_DAY);
  const minutes = formattedNumber(differenceInMinutes(finishTime, startTime) % MINUTES_PER_HOUR);
  const seconds = formattedNumber(differenceInSeconds(finishTime, startTime) % SECONDS_PER_MINUTE);

  return [days.toString(), hours.toString(), minutes.toString(), seconds.toString()];
};
