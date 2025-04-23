
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationsHeaderProps {
  hasUnreadNotifications: boolean;
  onMarkAllAsRead: () => void;
}

export const NotificationsHeader = ({
  hasUnreadNotifications,
  onMarkAllAsRead,
}: NotificationsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <Bell className="h-6 w-6 text-carbon-600" />
        <h1 className="text-2xl md:text-3xl font-bold">Notifications</h1>
      </div>
      
      {hasUnreadNotifications && (
        <Button
          variant="outline"
          onClick={onMarkAllAsRead}
        >
          <Check className="h-4 w-4 mr-2" />
          Mark all as read
        </Button>
      )}
    </div>
  );
};
