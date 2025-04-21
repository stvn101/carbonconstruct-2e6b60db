
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NotificationBellProps {
  unreadCount: number;
}

const NotificationBell = ({ unreadCount }: NotificationBellProps) => {
  return (
    <Link to="/notifications" className="relative">
      <Button variant="ghost" size="icon">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 bg-red-500 text-white"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
};

export default NotificationBell;
