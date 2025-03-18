"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { popularTimezones, allTimezones } from "@/data/timezones";
import { Timezone } from "@/types/timezone";
import TimezoneCard from "@/components/TimezoneCard";
import TimeSettings from "@/components/TimeSettings";
import TimezoneSearch from "@/components/TimezoneSearch";
import OptimalPostingTime from "@/components/OptimalPostingTime";
import SocialMediaSuggestions from "@/components/SocialMediaSuggestions";
import WorldMap from "@/components/WorldMap";
import { MoonStar, Sun, List, Grid, Filter, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const [selectedTimezones, setSelectedTimezones] = useState<Timezone[]>(
    popularTimezones.slice(0, 6)
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24HourFormat, setIs24HourFormat] = useState(false);
  const [showSeconds, setShowSeconds] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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
    if (selectedTimezones.some((tz) => tz.id === timezone.id)) {
      return; // Prevent duplicates
    }
    setSelectedTimezones((prev) => [...prev, timezone]);
  };

  // Remove a timezone from selected
  const removeTimezone = (timezoneId: string) => {
    setSelectedTimezones((prev) => prev.filter((tz) => tz.id !== timezoneId));
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 sm:mb-0"
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-gradient">
                World Clock
              </h1>
              <p className="text-muted-foreground">
                Track time across multiple regions
              </p>
            </motion.div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Filter className="h-4 w-4" />
              </Button>

              {isMounted && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  onClick={toggleTheme}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <MoonStar className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <TimezoneSearch
                allTimezones={allTimezones}
                selectedTimezones={selectedTimezones}
                onAddTimezone={addTimezone}
              />
            </div>
            <div className={showSettings ? "block" : "hidden md:block"}>
              <TimeSettings
                is24HourFormat={is24HourFormat}
                setIs24HourFormat={setIs24HourFormat}
                showSeconds={showSeconds}
                setShowSeconds={setShowSeconds}
              />
            </div>
          </div>
        </header>

        <Tabs defaultValue="dashboard" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-1.5"
            >
              <Grid className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="world" className="flex items-center gap-1.5">
              <Globe className="h-4 w-4" />
              <span>All Countries</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-0 space-y-6">
            {/* Social Media Suggestion Component */}
            {selectedTimezones.length > 0 && (
              <SocialMediaSuggestions
                selectedTimezones={selectedTimezones}
                currentTime={currentTime}
                is24HourFormat={is24HourFormat}
              />
            )}

            {/* Optimal Posting Time */}
            {selectedTimezones.length > 0 && (
              <OptimalPostingTime
                selectedTimezones={selectedTimezones}
                currentTime={currentTime}
                is24HourFormat={is24HourFormat}
              />
            )}

            {/* Selected Timezone Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
          </TabsContent>

          <TabsContent value="world" className="mt-0">
            <WorldMap
              allTimezones={allTimezones}
              currentTime={currentTime}
              is24HourFormat={is24HourFormat}
              selectedTimezones={selectedTimezones}
              onAddTimezone={addTimezone}
            />
          </TabsContent>
        </Tabs>

        <footer className="mt-12 text-center text-muted-foreground text-sm">
          <p>Created with Next.js, TypeScript, TailwindCSS & Framer Motion</p>
        </footer>
      </div>
    </div>
  );
}
