// Remove useState and useEffect if not being used
import React from 'react'
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Timezone } from "@/types/timezone";

interface TimezoneCardProps {
  timezone: Timezone;
  is24HourFormat: boolean;
  showSeconds: boolean;
  onRemove: (id: string) => void;
  currentTime: Date;
}

const TimezoneCard: React.FC<TimezoneCardProps> = ({
  timezone,
  is24HourFormat,
  showSeconds,
  onRemove,
  currentTime,
}) => {
  // Get time for this timezone
  const getTimezoneTime = () => {
    // Create a new date object based on the current time
    const utc = new Date(currentTime);

    // Convert to UTC by adding the local time offset
    utc.setMinutes(utc.getMinutes() + utc.getTimezoneOffset());

    // Create a new date object with the target timezone offset applied
    const targetTime = new Date(utc);
    targetTime.setHours(utc.getHours() + timezone.offset);

    return targetTime;
  };

  const timezoneTime = getTimezoneTime();
  const hours = timezoneTime.getHours();

  // Determine if it's day or night
  const isDaytime = hours >= 6 && hours < 18;

  // Format time based on settings
  const formatTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: !is24HourFormat,
    };

    if (showSeconds) {
      options.second = "numeric";
    }

    return timezoneTime.toLocaleTimeString([], options);
  };

  // Format date
  const formatDate = () => {
    return timezoneTime.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Get country flag emoji
  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  // Get time difference relative to local time
  const getTimeDifference = () => {
    const localTime = new Date(currentTime);
    const localHours = localTime.getHours();
    const timeDiff = Math.round(
      timezone.offset + localTime.getTimezoneOffset() / 60
    );

    if (timeDiff === 0) return "Same as local time";

    const sign = timeDiff > 0 ? "+" : "";
    return `${sign}${timeDiff} hours from local`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card
        className={`h-full hover-lift relative overflow-hidden ${
          isDaytime ? "day-indicator" : "night-indicator"
        }`}
      >
        <div className="absolute inset-0 opacity-10 z-0"></div>
        <CardContent className="p-6 relative h-full flex flex-col z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(timezone.id)}
            className="absolute top-2 right-2 h-8 w-8 rounded-full text-foreground/60 hover:text-foreground hover:bg-background/10"
          >
            <X size={16} />
          </Button>

          <div className="flex items-center mb-4 gap-2">
            <span className="text-2xl">
              {getFlagEmoji(timezone.countryCode)}
            </span>
            <div>
              <h3 className="font-medium text-lg">{timezone.name}</h3>
              <p className="text-xs text-muted-foreground">
                {timezone.formattedName}
              </p>
            </div>
          </div>

          <div className="text-center flex-grow flex flex-col justify-center">
            <motion.div
              key={formatTime()} // Re-animate when time changes
              initial={{ opacity: 0.5, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="text-3xl md:text-4xl font-bold time-display"
            >
              {formatTime()}
            </motion.div>
            <div className="text-sm mt-1 text-foreground/80">
              {formatDate()}
            </div>

            <div className="mt-4">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isDaytime
                    ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                }`}
              >
                {isDaytime ? "Day" : "Night"} • {getTimeDifference()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TimezoneCard;
