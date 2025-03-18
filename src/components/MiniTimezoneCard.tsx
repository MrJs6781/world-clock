import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Timezone } from "@/types/timezone";

interface MiniTimezoneCardProps {
  timezone: Timezone;
  currentTime: Date;
  is24HourFormat: boolean;
  isSelected: boolean;
  onAdd: () => void;
}

const MiniTimezoneCard: React.FC<MiniTimezoneCardProps> = ({
  timezone,
  currentTime,
  is24HourFormat,
  isSelected,
  onAdd,
}) => {
  // Get time for this timezone (reusing the same logic from TimezoneCard)
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

  // Format time
  const formatTime = () => {
    return timezoneTime.toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
      hour12: !is24HourFormat,
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

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`
        rounded-md p-2 border flex items-center justify-between
        ${
          isDaytime
            ? "bg-amber-50 dark:bg-amber-950/20"
            : "bg-indigo-50 dark:bg-indigo-950/20"
        }
        ${isSelected ? "border-primary border-2" : "border-border"}
      `}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{getFlagEmoji(timezone.countryCode)}</span>
        <div>
          <p className="text-xs font-medium">{timezone.name}</p>
          <p className="text-sm font-bold">{formatTime()}</p>
        </div>
      </div>

      {!isSelected && (
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0 rounded-full"
          onClick={onAdd}
        >
          <Plus className="h-3 w-3" />
        </Button>
      )}
    </motion.div>
  );
};

export default MiniTimezoneCard;
