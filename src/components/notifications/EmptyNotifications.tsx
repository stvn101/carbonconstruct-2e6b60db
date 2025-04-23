
import { Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const EmptyNotifications = () => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No notifications yet</h3>
        <p className="text-muted-foreground">
          You don't have any notifications at the moment.
        </p>
      </CardContent>
    </Card>
  );
};
