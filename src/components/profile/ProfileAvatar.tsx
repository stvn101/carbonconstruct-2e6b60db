
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  avatarUrl?: string | null;
  fullName?: string | null;
  userEmail?: string;
  size?: "sm" | "md" | "lg";
}

export const ProfileAvatar = ({ 
  avatarUrl, 
  fullName, 
  userEmail,
  size = "md" 
}: ProfileAvatarProps) => {
  const getInitials = () => {
    if (fullName) {
      return fullName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();
    }
    return userEmail?.charAt(0).toUpperCase() || '?';
  };

  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-20 w-20"
  };

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={avatarUrl || undefined} alt={fullName || "User"} />
      <AvatarFallback className="text-lg bg-carbon-200 text-carbon-800 dark:bg-carbon-700 dark:text-carbon-300">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
};
