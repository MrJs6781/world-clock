"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { popularTimezones, allTimezones } from "@/data/timezones";
import { Timezone } from "@/types/timezone";
import TimezoneCard from "@/components/TimezoneCard";
import TimeSettings from "@/components/TimeSettings";
import TimezoneSearch from "@/components/TimezoneSearch";
import OptimalPostingTime from "@/components/OptimalPostingTime";
import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [selectedTimezones, setSelectedTimezones] = useState<Timezone[]>(
    popularTimezones.slice(0, 6)
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24HourFormat, setIs24HourFormat] = useState(false);
  const [showSeconds, setShowSeconds] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Theme needs to be client-side only
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Add a timezone to selected
  const addTimezone = (timezone: Timezone) => {
    setSelectedTimezones((prev) => [...prev, timezone]);
  };

  // Remove a timezone from selected
  const removeTimezone = (timezoneId: string) => {
    setSelectedTimezones((prev) => prev.filter((tz) => tz.id !== timezoneId));
  };

  // Toggle theme
  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 relative">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold text-gradient">World Clock</h1>
              <p className="text-muted-foreground">
                Track time across multiple regions for optimal posting
              </p>
            </motion.div>

            {isMounted && (
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={toggleTheme}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <MoonStar className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:flex-1">
              <TimezoneSearch
                allTimezones={allTimezones}
                selectedTimezones={selectedTimezones}
                onAddTimezone={addTimezone}
              />
            </div>
            <div className="flex-shrink-0">
              <TimeSettings
                is24HourFormat={is24HourFormat}
                setIs24HourFormat={setIs24HourFormat}
                showSeconds={showSeconds}
                setShowSeconds={setShowSeconds}
              />
            </div>
          </div>
        </header>

        {selectedTimezones.length > 0 && (
          <div className="mb-6">
            <OptimalPostingTime
              selectedTimezones={selectedTimezones}
              currentTime={currentTime}
              is24HourFormat={is24HourFormat}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedTimezones.map((timezone) => (
            <TimezoneCard
              key={timezone.id}
              timezone={timezone}
              is24HourFormat={is24HourFormat}
              showSeconds={showSeconds}
              onRemove={removeTimezone}
              currentTime={currentTime}
            />
          ))}
        </div>

        {selectedTimezones.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Search and add timezones to get started
            </p>
          </div>
        )}

        <footer className="mt-12 text-center text-muted-foreground text-sm">
          <p>Created with Next.js, TypeScript, TailwindCSS & Framer Motion</p>
        </footer>
      </div>
    </div>
  );
}
