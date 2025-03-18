import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Timezone } from "@/types/timezone";
import { getFlagEmoji } from "@/utils/timeUtils";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredTimezones: Timezone[];
  addTimezone: (timezone: Timezone) => void;
  is24HourFormat: boolean;
  setIs24HourFormat: (value: boolean) => void;
  showSeconds: boolean;
  setShowSeconds: (value: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  filteredTimezones,
  addTimezone,
  is24HourFormat,
  setIs24HourFormat,
  showSeconds,
  setShowSeconds,
}) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search for a city or timezone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            {filteredTimezones.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredTimezones.map((timezone) => (
                  <motion.div
                    key={timezone.id}
                    whileHover={{ backgroundColor: "rgba(75, 85, 99, 1)" }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-600 flex items-center"
                    onClick={() => addTimezone(timezone)}
                  >
                    <span className="mr-2 text-xl">
                      {getFlagEmoji(timezone.countryCode)}
                    </span>
                    <span>{timezone.formattedName}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Switch
                id="format-switch"
                checked={is24HourFormat}
                onCheckedChange={setIs24HourFormat}
              />
              <Label htmlFor="format-switch">24h</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="seconds-switch"
                checked={showSeconds}
                onCheckedChange={setShowSeconds}
              />
              <Label htmlFor="seconds-switch">Seconds</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchBar;
