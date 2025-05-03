
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProfileFormProps {
  profile: UserProfile;
  onSubmit: (formData: ProfileFormData) => Promise<void>;
}

export interface ProfileFormData {
  full_name: string;
  company_name: string;
  website: string;
  avatar_url: string;
}

export const ProfileForm = ({ profile, onSubmit }: ProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: profile.full_name || '',
    company_name: profile.company_name || '',
    website: profile.website || '',
    avatar_url: profile.avatar_url || ''
  });
  
  // Update form data when profile changes
  useEffect(() => {
    setFormData({
      full_name: profile.full_name || '',
      company_name: profile.company_name || '',
      website: profile.website || '',
      avatar_url: profile.avatar_url || ''
    });
  }, [profile]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = "Please enter a valid website URL";
    }
    
    if (formData.avatar_url && !isValidUrl(formData.avatar_url)) {
      newErrors.avatar_url = "Avatar URL must be a valid URL";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const isValidUrl = (url: string): boolean => {
    if (!url) return true;
    
    try {
      // For URLs without protocol, add a temporary one for validation
      const urlToValidate = url.match(/^https?:\/\//) ? url : `https://${url}`;
      new URL(urlToValidate);
      return true;
    } catch (error) {
      return false;
    }
  };

  const formatUrl = (url: string): string => {
    if (!url) return '';
    
    // If URL doesn't start with protocol, add https://
    return url.match(/^https?:\/\//) ? url : `https://${url}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Format URLs before submission
    const formattedData = {
      ...formData,
      website: formData.website ? formatUrl(formData.website) : '',
      avatar_url: formData.avatar_url ? formatUrl(formData.avatar_url) : '',
    };
    
    setIsLoading(true);
    try {
      await onSubmit(formattedData);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          autoComplete="name"
          aria-invalid={!!errors.full_name}
        />
        {errors.full_name && <div className="form-error text-red-500 text-sm mt-1">{errors.full_name}</div>}
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
          autoComplete="organization"
          aria-invalid={!!errors.company_name}
        />
        {errors.company_name && <div className="form-error text-red-500 text-sm mt-1">{errors.company_name}</div>}
      </div>
      
      <div className="form-field">
        <Label htmlFor="website" className="form-label">Website</Label>
        <Input 
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="example.com"
          className="form-input dark:bg-gray-700 dark:text-carbon-300 dark:border-gray-600"
          tabIndex={3}
          autoComplete="url"
          aria-invalid={!!errors.website}
        />
        {errors.website && <div className="form-error text-red-500 text-sm mt-1">{errors.website}</div>}
        <p className="text-xs text-gray-500 mt-1">Enter with or without https://</p>
      </div>
      
      <div className="form-field">
        <Label htmlFor="avatar_url" className="form-label">Avatar URL</Label>
        <Input 
          id="avatar_url"
          name="avatar_url"
          value={formData.avatar_url}
          onChange={handleChange}
          placeholder="example.com/avatar.jpg"
          className="form-input dark:bg-gray-700 dark:text-carbon-300 dark:border-gray-600"
          tabIndex={4}
          autoComplete="off"
          aria-invalid={!!errors.avatar_url}
        />
        {errors.avatar_url && <div className="form-error text-red-500 text-sm mt-1">{errors.avatar_url}</div>}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-carbon-600 hover:bg-carbon-700 dark:text-carbon-300"
        disabled={isLoading}
        tabIndex={5}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
          </>
        ) : (
          'Update Profile'
        )}
      </Button>
    </form>
  );
};
