import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useParentPreferences } from "@/hooks/use-parent-preferences";
import { Settings, Bell, DollarSign, Shield } from "lucide-react";
import { toast } from "sonner";

const ParentSettings = () => {
  const { preferences, isLoading, updatePreferences, isUpdating } = useParentPreferences();
  
  const [localPreferences, setLocalPreferences] = useState({
    email_notifications: preferences?.email_notifications ?? true,
    class_reminders: preferences?.class_reminders ?? true,
    progress_reports: preferences?.progress_reports ?? true,
    spending_limit_per_child: preferences?.spending_limit_per_child ?? null,
  });

  const handleSave = () => {
    updatePreferences(localPreferences);
  };

  const handleSpendingLimitChange = (value: string) => {
    const numValue = value === "" ? null : parseFloat(value);
    setLocalPreferences({ ...localPreferences, spending_limit_per_child: numValue });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading preferences...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Parent Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your preferences and parental controls
        </p>
      </div>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose which notifications you'd like to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates and announcements via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={localPreferences.email_notifications}
              onCheckedChange={(checked) =>
                setLocalPreferences({ ...localPreferences, email_notifications: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="class-reminders">Class Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get reminders before upcoming classes
              </p>
            </div>
            <Switch
              id="class-reminders"
              checked={localPreferences.class_reminders}
              onCheckedChange={(checked) =>
                setLocalPreferences({ ...localPreferences, class_reminders: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="progress-reports">Progress Reports</Label>
              <p className="text-sm text-muted-foreground">
                Receive weekly progress updates for your children
              </p>
            </div>
            <Switch
              id="progress-reports"
              checked={localPreferences.progress_reports}
              onCheckedChange={(checked) =>
                setLocalPreferences({ ...localPreferences, progress_reports: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Spending Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Spending Controls
          </CardTitle>
          <CardDescription>
            Set limits and manage your family's spending
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="spending-limit">
              Monthly Spending Limit Per Child (₹)
            </Label>
            <Input
              id="spending-limit"
              type="number"
              placeholder="No limit"
              value={localPreferences.spending_limit_per_child ?? ""}
              onChange={(e) => handleSpendingLimitChange(e.target.value)}
              min="0"
              step="100"
            />
            <p className="text-sm text-muted-foreground">
              Set a maximum monthly spending amount per child. Leave empty for no limit.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Parental Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Parental Controls
          </CardTitle>
          <CardDescription>
            Additional safety and control features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>More parental control features coming soon:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Class category restrictions</li>
              <li>Screen time limits</li>
              <li>Communication monitoring</li>
              <li>Automatic class approval</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setLocalPreferences({
            email_notifications: preferences?.email_notifications ?? true,
            class_reminders: preferences?.class_reminders ?? true,
            progress_reports: preferences?.progress_reports ?? true,
            spending_limit_per_child: preferences?.spending_limit_per_child ?? null,
          })}
        >
          Reset
        </Button>
        <Button onClick={handleSave} disabled={isUpdating}>
          {isUpdating ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
};

export default ParentSettings;