import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Linkedin, Twitter, Instagram, Facebook, Users } from "lucide-react";
import { Timezone } from "@/types/timezone";

interface SocialMediaSuggestionsProps {
  selectedTimezones: Timezone[];
  currentTime: Date;
  is24HourFormat: boolean;
}

// Best posting times for different platforms based on research
const PLATFORM_PEAK_HOURS = {
  linkedin: { start: 9, end: 12, peakDay: [2, 3] }, // Tuesday, Wednesday
  twitter: { start: 8, end: 16, peakDay: [1, 3, 4] }, // Monday, Wednesday, Thursday
  instagram: { start: 11, end: 13, peakDay: [2, 4] }, // Tuesday, Thursday
  facebook: { start: 13, end: 16, peakDay: [3, 4] }, // Wednesday, Thursday
};

const SocialMediaSuggestions: React.FC<SocialMediaSuggestionsProps> = ({
  selectedTimezones,
  currentTime,
  is24HourFormat,
}) => {
  // Get optimal posting times for each platform
  const getOptimalPostingTimes = (
    platform: keyof typeof PLATFORM_PEAK_HOURS
  ) => {
    if (selectedTimezones.length === 0) return null;

    const platformData = PLATFORM_PEAK_HOURS[platform];
    const localOffset = currentTime.getTimezoneOffset() / -60;

    let bestHour = 0;
    let maxAudienceReach = 0;
    let bestCoverage = 0;
    let bestDay = 1; // Monday default

    // Loop through each possible posting hour
    for (let hour = 0; hour < 24; hour++) {
      // Loop through week days (0 = Sunday, 1 = Monday, etc)
      for (let day = 1; day <= 5; day++) {
        // Weekdays only
        let audienceReach = 0;

        for (const timezone of selectedTimezones) {
          const targetHour = (hour + timezone.offset - localOffset + 24) % 24;

          // Check if target hour is in the platform's peak hours
          if (
            targetHour >= platformData.start &&
            targetHour <= platformData.end
          ) {
            // Extra weight for peak days
            if (platformData.peakDay.includes(day)) {
              audienceReach += 1.5;
            } else {
              audienceReach += 1;
            }
          }
        }

        const coverage =
          (audienceReach / (selectedTimezones.length * 1.5)) * 100;

        if (audienceReach > maxAudienceReach) {
          maxAudienceReach = audienceReach;
          bestHour = hour;
          bestCoverage = coverage;
          bestDay = day;
        }
      }
    }

    // Format the optimal time
    const date = new Date();
    date.setHours(bestHour, 0, 0, 0);

    // Get day name
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return {
      time: date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric",
        hour12: !is24HourFormat,
      }),
      day: dayNames[bestDay],
      coverage: Math.min(Math.round(bestCoverage), 100),
    };
  };

  const platforms = [
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: <Linkedin className="h-4 w-4" />,
    },
    {
      id: "twitter",
      name: "X / Twitter",
      icon: <Twitter className="h-4 w-4" />,
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: <Instagram className="h-4 w-4" />,
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook className="h-4 w-4" />,
    },
  ];

  // Get color based on coverage percentage
  const getCoverageColor = (coverage: number) => {
    if (coverage >= 80) return "bg-green-500";
    if (coverage >= 60) return "bg-lime-500";
    if (coverage >= 40) return "bg-yellow-500";
    if (coverage >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Social Media Posting Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="linkedin" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              {platforms.map((platform) => (
                <TabsTrigger
                  key={platform.id}
                  value={platform.id}
                  className="flex items-center gap-1.5"
                >
                  {platform.icon}
                  <span className="hidden sm:inline">{platform.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {platforms.map((platform) => {
              const recommendation = getOptimalPostingTimes(
                platform.id as keyof typeof PLATFORM_PEAK_HOURS
              );

              if (!recommendation) return null;

              return (
                <TabsContent
                  key={platform.id}
                  value={platform.id}
                  className="mt-0"
                >
                  <div className="rounded-md border p-4">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-medium">
                          {platform.name} Best Posting Time
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Maximizes audience reach across your selected
                          timezones
                        </p>
                      </div>

                      <div className="space-y-2 md:text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Badge variant="outline" className="font-medium">
                            {recommendation.coverage}% reach
                          </Badge>
                          <span className="text-2xl font-bold">
                            {recommendation.time}
                          </span>
                        </div>
                        <p className="text-sm font-medium">
                          {recommendation.day}
                        </p>
                      </div>
                    </div>

                    {/* Visual progress bar */}
                    <div className="mt-4 space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        Audience reach
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getCoverageColor(
                            recommendation.coverage
                          )} rounded-full`}
                          style={{ width: `${recommendation.coverage}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-muted-foreground">
                      <p className="italic">
                        {platform.id === "linkedin" &&
                          "LinkedIn engagement is highest during business hours on weekdays."}
                        {platform.id === "twitter" &&
                          "X/Twitter sees high engagement throughout the day with peaks in the morning."}
                        {platform.id === "instagram" &&
                          "Instagram users are most active during lunch hours and evenings."}
                        {platform.id === "facebook" &&
                          "Facebook sees peak engagement in the afternoons."}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SocialMediaSuggestions;
