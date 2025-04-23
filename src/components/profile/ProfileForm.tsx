
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/auth";

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
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await onSubmit(formData);
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
  );
};
