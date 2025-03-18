import React, { useState, useEffect, useRef } from "react";
import { Search, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Timezone } from "@/types/timezone";

interface TimezoneSearchProps {
  allTimezones: Timezone[];
  selectedTimezones: Timezone[];
  onAddTimezone: (timezone: Timezone) => void;
}

const TimezoneSearch: React.FC<TimezoneSearchProps> = ({
  allTimezones,
  selectedTimezones,
  onAddTimezone,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTimezones, setFilteredTimezones] = useState<Timezone[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Filter timezones based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredTimezones([]);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();

    const filtered = allTimezones
      .filter(
        (tz) => !selectedTimezones.some((selected) => selected.id === tz.id)
      )
      .filter(
        (tz) =>
          tz.name.toLowerCase().includes(searchTermLower) ||
          tz.formattedName.toLowerCase().includes(searchTermLower) ||
          tz.countryCode.toLowerCase().includes(searchTermLower)
      )
      // Sort results by relevance
      .sort((a, b) => {
        // Exact matches should come first
        const aNameExact = a.name.toLowerCase() === searchTermLower;
        const bNameExact = b.name.toLowerCase() === searchTermLower;

        if (aNameExact && !bNameExact) return -1;
        if (!aNameExact && bNameExact) return 1;

        // Then sort by whether the search term is at the start of the name
        const aNameStart = a.name.toLowerCase().startsWith(searchTermLower);
        const bNameStart = b.name.toLowerCase().startsWith(searchTermLower);

        if (aNameStart && !bNameStart) return -1;
        if (!aNameStart && bNameStart) return 1;

        // Then alphabetically
        return a.name.localeCompare(b.name);
      })
      .slice(0, 10); // Show more results but not too many

    setFilteredTimezones(filtered);
  }, [searchTerm, selectedTimezones, allTimezones]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        resultsRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get flag emoji
  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const handleAddTimezone = (timezone: Timezone) => {
    onAddTimezone(timezone);
    setSearchTerm("");
    setIsFocused(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  return (
    <Card className="border bg-card/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search for a city or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              className="pl-10 pr-4 py-6 bg-background border-input text-foreground shadow-sm focus-visible:ring-2 focus-visible:ring-offset-0"
            />
          </div>

          <AnimatePresence>
            {isFocused && filteredTimezones.length > 0 && (
              <motion.div
                ref={resultsRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 mt-1 w-full bg-popover rounded-md shadow-lg max-h-80 overflow-auto"
              >
                {filteredTimezones.map((timezone) => (
                  <motion.div
                    key={timezone.id}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    className="px-4 py-3 cursor-pointer hover:bg-muted flex items-center justify-between"
                    onClick={() => handleAddTimezone(timezone)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {getFlagEmoji(timezone.countryCode)}
                      </span>
                      <div>
                        <div className="font-medium">{timezone.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {timezone.formattedName}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full"
                    >
                      <Plus size={16} />
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimezoneSearch;
