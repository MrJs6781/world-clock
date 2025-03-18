import React, { useState, useEffect } from "react";
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
    const date = new Date(currentTime);
    const localOffset = date.getTimezoneOffset() * 60000;
    const targetOffset = timezone.offset * 3600000;
    return new Date(date.getTime() + localOffset + targetOffset);
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
    const diffHours = hours - localHours;

    if (diffHours === 0) return "Same as local time";

    const sign = diffHours > 0 ? "+" : "";
    return `${sign}${diffHours} hours from local`;
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
        className={`h-full hover-lift ${
          isDaytime ? "day-indicator" : "night-indicator"
        } bg-opacity-5 border-2`}
      >
        <CardContent className="p-6 relative h-full flex flex-col">
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
                className={`status-badge ${
                  isDaytime ? "status-badge-green" : "status-badge-blue"
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
