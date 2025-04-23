
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from 'sonner';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from '@/contexts/auth';
import ErrorBoundaryWrapper from "@/components/error/ErrorBoundaryWrapper";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm, ProfileFormData } from "@/components/profile/ProfileForm";

const UserProfile = () => {
  const { user, profile, updateProfile } = useAuth();

  const handleProfileUpdate = async (formData: ProfileFormData) => {
    try {
      if (!user?.id || !profile) {
        throw new Error('User ID or profile not found');
      }
      
      const updatedProfile = {
        ...profile,
        ...formData
      };
      
      await updateProfile(updatedProfile);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error("Failed to update profile");
    }
  };

  // Show loading state if user data is not yet available
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-carbon-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carbon-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-carbon-50 dark:bg-gray-900">
      <Helmet>
        <title>My Profile | CarbonConstruct</title>
        <meta 
          name="description" 
          content="Manage your CarbonConstruct account profile."
        />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow content-top-spacing px-4 pb-12">
        <ErrorBoundaryWrapper feature="User Profile">
          <div className="container mx-auto max-w-3xl">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 dark:text-carbon-300">
              My Profile
            </h1>
            
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <ProfileHeader
                fullName={profile?.full_name || ''}
                email={user.email || ''}
                avatarUrl={profile?.avatar_url}
              />
              <CardContent>
                <ProfileForm 
                  profile={profile!}
                  onSubmit={handleProfileUpdate}
                />
              </CardContent>
            </Card>
          </div>
        </ErrorBoundaryWrapper>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
