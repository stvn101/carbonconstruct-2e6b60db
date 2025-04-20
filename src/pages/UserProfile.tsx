
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
import { useAuth } from '@/contexts/auth';

const UserProfile = () => {
  const { user, profile, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    company_name: profile?.company_name || '',
    website: profile?.website || '',
    avatar_url: profile?.avatar_url || ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.website && !formData.website.match(/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/)) {
      newErrors.website = "Please enter a valid website URL";
    }
    
    if (formData.avatar_url && !formData.avatar_url.match(/^(https?:\/\/)/)) {
      newErrors.avatar_url = "Avatar URL must start with http:// or https://";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Update to pass both userId and formData to updateProfile
      if (!user?.id) {
        throw new Error('User ID not found');
      }
      await updateProfile(user.id, formData);
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
      
      <main className="flex-grow content-top-spacing px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 dark:text-carbon-300">My Profile</h1>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2 md:pb-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={formData.avatar_url || undefined} alt={formData.full_name || "User"} />
                  <AvatarFallback className="text-lg bg-carbon-200 text-carbon-800 dark:bg-carbon-700 dark:text-carbon-300">{getInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="dark:text-carbon-300">{formData.full_name || user?.email}</CardTitle>
                  <CardDescription className="dark:text-carbon-400">{user?.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-field">
                  <Label htmlFor="full_name" className="form-label">Full Name</Label>
                  <Input 
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="form-input dark:bg-gray-700 dark:text-carbon-300 dark:border-gray-600"
                    tabIndex={1}
                  />
                  <div className="form-error">{errors.full_name || ''}</div>
                </div>
                
                <div className="form-field">
                  <Label htmlFor="company_name" className="form-label">Company / Organization</Label>
                  <Input 
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Your company or organization"
                    className="form-input dark:bg-gray-700 dark:text-carbon-300 dark:border-gray-600"
                    tabIndex={2}
                  />
                  <div className="form-error">{errors.company_name || ''}</div>
                </div>
                
                <div className="form-field">
                  <Label htmlFor="website" className="form-label">Website</Label>
                  <Input 
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    type="url"
                    className="form-input dark:bg-gray-700 dark:text-carbon-300 dark:border-gray-600"
                    tabIndex={3}
                  />
                  <div className="form-error">{errors.website || ''}</div>
                </div>
                
                <div className="form-field">
                  <Label htmlFor="avatar_url" className="form-label">Avatar URL</Label>
                  <Input 
                    id="avatar_url"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    type="url"
                    className="form-input dark:bg-gray-700 dark:text-carbon-300 dark:border-gray-600"
                    tabIndex={4}
                  />
                  <div className="form-error">{errors.avatar_url || ''}</div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-carbon-600 hover:bg-carbon-700 dark:text-carbon-300"
                  disabled={isLoading}
                  tabIndex={5}
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
