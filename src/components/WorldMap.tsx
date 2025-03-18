import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Globe } from "lucide-react";
import { Timezone } from "@/types/timezone";
import MiniTimezoneCard from "@/components/MiniTimezoneCard";

interface WorldMapProps {
  allTimezones: Timezone[];
  currentTime: Date;
  is24HourFormat: boolean;
  selectedTimezones: Timezone[];
  onAddTimezone: (timezone: Timezone) => void;
}

// Grouped regions for better organization
const REGIONS = {
  Americas: ["US", "CA", "MX", "BR", "AR", "CO", "PE", "CL"],
  Europe: [
    "GB",
    "DE",
    "FR",
    "IT",
    "ES",
    "NL",
    "SE",
    "CH",
    "BE",
    "AT",
    "PL",
    "PT",
    "NO",
    "DK",
    "FI",
    "GR",
    "IE",
    "IS",
    "TR",
  ],
  "Asia & Middle East": [
    "IN",
    "CN",
    "JP",
    "KR",
    "SG",
    "AE",
    "SA",
    "QA",
    "ID",
    "TH",
    "PH",
    "MY",
    "VN",
    "IL",
  ],
  "Africa & Oceania": ["AU", "NZ", "ZA", "EG", "NG", "KE"],
};

const WorldMap: React.FC<WorldMapProps> = ({
  allTimezones,
  currentTime,
  is24HourFormat,
  selectedTimezones,
  onAddTimezone,
}) => {
  const [openRegions, setOpenRegions] = useState<string[]>(["Americas"]);

  const toggleRegion = (region: string) => {
    setOpenRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };

  // Group timezones by region
  const getRegionTimezones = (region: string) => {
    const countryCodes = REGIONS[region as keyof typeof REGIONS];
    return allTimezones.filter((tz) => countryCodes.includes(tz.countryCode));
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
            <Globe className="h-5 w-5 text-primary" />
            World Map View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.keys(REGIONS).map((region) => (
              <Collapsible
                key={region}
                open={openRegions.includes(region)}
                onOpenChange={() => toggleRegion(region)}
                className="border rounded-md overflow-hidden"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-between p-4 text-left font-medium"
                  >
                    <span>{region}</span>
                    {openRegions.includes(region) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 pt-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {getRegionTimezones(region).map((timezone) => (
                      <MiniTimezoneCard
                        key={timezone.id}
                        timezone={timezone}
                        currentTime={currentTime}
                        is24HourFormat={is24HourFormat}
                        isSelected={selectedTimezones.some(
                          (tz) => tz.id === timezone.id
                        )}
                        onAdd={() => onAddTimezone(timezone)}
                      />
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WorldMap;
