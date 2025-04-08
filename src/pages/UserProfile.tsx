
import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { toast } from 'sonner';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

const UserProfile = () => {
  const { user, profile, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    company_name: profile?.company_name || '',
    website: profile?.website || '',
    avatar_url: profile?.avatar_url || ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(formData);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (formData.full_name) {
      return formData.full_name.split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || '?';
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col bg-carbon-50 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>My Profile | CarbonConstruct</title>
        <meta 
          name="description" 
          content="Manage your CarbonConstruct account profile."
        />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 dark:text-carbon-300">My Profile</h1>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={formData.avatar_url || undefined} alt={formData.full_name || "User"} />
                <AvatarFallback className="text-lg bg-carbon-200 text-carbon-800 dark:bg-carbon-700 dark:text-carbon-300">{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="dark:text-carbon-300">{formData.full_name || user?.email}</CardTitle>
                <CardDescription className="dark:text-carbon-400">{user?.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="dark:text-carbon-300">Full Name</Label>
                  <Input 
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="dark:bg-gray-700 dark:text-carbon-300 dark:border-gray-600"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="dark:text-carbon-300">Company / Organization</Label>
                  <Input 
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Your company or organization"
                    className="dark:bg-gray-700 dark:text-carbon-300 dark:border-gray-600"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website" className="dark:text-carbon-300">Website</Label>
                  <Input 
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    type="url"
                    className="dark:bg-gray-700 dark:text-carbon-300 dark:border-gray-600"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatar_url" className="dark:text-carbon-300">Avatar URL</Label>
                  <Input 
                    id="avatar_url"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    type="url"
                    className="dark:bg-gray-700 dark:text-carbon-300 dark:border-gray-600"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-carbon-600 hover:bg-carbon-700 dark:text-carbon-300"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default UserProfile;
