import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface TimeSettingsProps {
  is24HourFormat: boolean;
  setIs24HourFormat: (value: boolean) => void;
  showSeconds: boolean;
  setShowSeconds: (value: boolean) => void;
}

const TimeSettings: React.FC<TimeSettingsProps> = ({
  is24HourFormat,
  setIs24HourFormat,
  showSeconds,
  setShowSeconds,
}) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center space-x-2">
            <Switch
              id="format-switch"
              checked={is24HourFormat}
              onCheckedChange={setIs24HourFormat}
            />
            <Label htmlFor="format-switch" className="text-white">
              24-hour format
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="seconds-switch"
              checked={showSeconds}
              onCheckedChange={setShowSeconds}
            />
            <Label htmlFor="seconds-switch" className="text-white">
              Show seconds
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSettings;
