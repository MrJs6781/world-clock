import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timezone } from "@/types/timezone";
import {
  formatTimeForTimezone,
  formatDateForTimezone,
  getFlagEmoji,
} from "@/utils/timeUtils";

interface TimeDisplayProps {
  timezone: Timezone;
  currentTime: Date;
  is24HourFormat: boolean;
  showSeconds: boolean;
  removeTimezone: (id: string) => void;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  timezone,
  currentTime,
  is24HourFormat,
  showSeconds,
  removeTimezone,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Card className="bg-gray-800 border-gray-700 h-full">
        <CardContent className="p-6">
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeTimezone(timezone.id)}
              className="h-6 w-6 p-0 rounded-full text-gray-400 hover:text-white hover:bg-gray-700"
            >
              ✕
            </Button>
          </div>

          <div className="flex items-center mb-3">
            <span className="text-2xl mr-2">
              {getFlagEmoji(timezone.countryCode)}
            </span>
            <h3 className="text-lg font-medium">{timezone.name}</h3>
          </div>

          <div className="text-center">
            <motion.div
              key={formatTimeForTimezone(
                timezone,
                currentTime,
                is24HourFormat,
                showSeconds
              )} // Re-animate when time changes
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-3xl font-bold mb-1"
            >
              {formatTimeForTimezone(
                timezone,
                currentTime,
                is24HourFormat,
                showSeconds
              )}
            </motion.div>
            <div className="text-gray-400 text-sm">
              {formatDateForTimezone(timezone, currentTime)}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TimeDisplay;
