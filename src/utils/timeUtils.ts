import { Timezone } from "@/types/timezone";

// Format time based on timezone offset
export const formatTimeForTimezone = (
  timezone: Timezone,
  currentTime: Date,
  is24HourFormat: boolean,
  showSeconds: boolean
) => {
  const date = new Date(currentTime);
  const localOffset = date.getTimezoneOffset() * 60000;
  const targetOffset = timezone.offset * 3600000;
  const targetTime = new Date(date.getTime() + localOffset + targetOffset);

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: !is24HourFormat,
  };

  if (showSeconds) {
    options.second = "numeric";
  }

  return targetTime.toLocaleTimeString([], options);
};

// Format date for a timezone
export const formatDateForTimezone = (
  timezone: Timezone,
  currentTime: Date
) => {
  const date = new Date(currentTime);
  const localOffset = date.getTimezoneOffset() * 60000;
  const targetOffset = timezone.offset * 3600000;
  const targetTime = new Date(date.getTime() + localOffset + targetOffset);

  return targetTime.toLocaleDateString([], {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Get flag emoji based on country code
export const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};
