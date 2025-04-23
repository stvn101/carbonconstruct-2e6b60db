
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProfileAvatar } from "./ProfileAvatar";

interface ProfileHeaderProps {
  fullName: string;
  email: string;
  avatarUrl?: string | null;
}

export const ProfileHeader = ({ fullName, email, avatarUrl }: ProfileHeaderProps) => {
  return (
    <CardHeader className="pb-2 md:pb-6">
      <div className="flex items-center gap-4">
        <ProfileAvatar
          avatarUrl={avatarUrl}
          fullName={fullName}
          userEmail={email}
        />
        <div>
          <CardTitle className="dark:text-carbon-300">{fullName || email}</CardTitle>
          <CardDescription className="dark:text-carbon-400">{email}</CardDescription>
        </div>
      </div>
    </CardHeader>
  );
};
