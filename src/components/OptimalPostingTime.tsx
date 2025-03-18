import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Globe, BarChart } from "lucide-react";
import { Timezone } from "@/types/timezone";

interface OptimalPostingTimeProps {
  selectedTimezones: Timezone[];
  currentTime: Date;
  is24HourFormat: boolean;
}

const OptimalPostingTime: React.FC<OptimalPostingTimeProps> = ({
  selectedTimezones,
  currentTime,
  is24HourFormat,
}) => {
  // Calculate optimal posting time (business hours overlap)
  const getOptimalPostingTime = () => {
    if (selectedTimezones.length === 0) return null;

    let bestHour = 0;
    let maxAwakeCount = 0;
    let bestCoverage = 0;

    for (let hour = 0; hour < 24; hour++) {
      let awakeCount = 0;

      for (const timezone of selectedTimezones) {
        const localOffset = new Date().getTimezoneOffset() / 60;
        const targetHour = (hour - localOffset + timezone.offset + 24) % 24;

        // Check if target hour is in business hours (9 AM - 5 PM)
        if (targetHour >= 9 && targetHour <= 17) {
          awakeCount++;
        }
      }

      const coverage = (awakeCount / selectedTimezones.length) * 100;

      if (awakeCount > maxAwakeCount) {
        maxAwakeCount = awakeCount;
        bestHour = hour;
        bestCoverage = coverage;
      }
    }

    // Format the optimal time
    const date = new Date();
    date.setHours(bestHour, 0, 0, 0);

    return {
      time: date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric",
        hour12: !is24HourFormat,
      }),
      coverage: Math.round(bestCoverage),
      activeCount: maxAwakeCount,
      totalCount: selectedTimezones.length,
    };
  };

  const optimal = getOptimalPostingTime();

  if (!optimal) {
    return null;
  }

  // Determine the quality of the coverage
  const getCoverageQuality = (coverage: number) => {
    if (coverage >= 75) return { color: "green", text: "Excellent" };
    if (coverage >= 50) return { color: "blue", text: "Good" };
    if (coverage >= 25) return { color: "yellow", text: "Fair" };
    return { color: "red", text: "Poor" };
  };

  const coverageQuality = getCoverageQuality(optimal.coverage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-time text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-full">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Optimal Posting Time</h3>
                <p className="text-sm text-white/80">
                  {optimal.activeCount} of {optimal.totalCount} regions in
                  business hours
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <div className="flex items-center gap-3 mb-1">
                <Badge
                  className={`bg-${coverageQuality.color}-500/20 text-white border-0`}
                >
                  {coverageQuality.text} ({optimal.coverage}%)
                </Badge>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-2xl font-bold">{optimal.time}</span>
                </div>
              </div>
              <p className="text-xs text-white/80">Based on your local time</p>
            </div>
          </div>

          {/* Visual indicator of coverage */}
          <div className="mt-4 bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${optimal.coverage}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OptimalPostingTime;
