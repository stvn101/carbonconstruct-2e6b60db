
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";
import { Notification } from "@/types/notifications";

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
  getNotificationColor: (type: string) => string;
}

export const NotificationCard = ({
  notification,
  onMarkAsRead,
  onDelete,
  formatDate,
  getNotificationColor,
}: NotificationCardProps) => {
  return (
    <Card 
      className={notification.read ? 'opacity-75' : 'border-l-4 border-l-carbon-600'}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{notification.title}</CardTitle>
            <CardDescription className="text-xs">
              {formatDate(notification.created_at)}
            </CardDescription>
          </div>
          <Badge className={getNotificationColor(notification.type)}>
            {notification.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{notification.message}</p>
        <div className="flex justify-end mt-4 gap-2">
          {!notification.read && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
            >
              <Check className="h-4 w-4 mr-1" />
              Mark as read
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(notification.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
