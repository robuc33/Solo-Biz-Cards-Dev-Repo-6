
import React from 'react';
import { FormComponentProps } from '@/types/businessCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Linkedin, Twitter, Facebook, Instagram, Youtube } from 'lucide-react';

export function SocialForm({ card, onUpdate }: FormComponentProps) {
  const handleInputChange = (field: string, value: string) => {
    // Auto-prepend base URL if user enters just username
    let fullUrl = value;
    
    if (value && !value.startsWith('http')) {
      switch (field) {
        case 'linkedin':
          fullUrl = `https://linkedin.com/in/${value}`;
          break;
        case 'twitter':
          fullUrl = `https://twitter.com/${value}`;
          break;
        case 'facebook':
          fullUrl = `https://facebook.com/${value}`;
          break;
        case 'instagram':
          fullUrl = `https://instagram.com/${value}`;
          break;
        case 'youtube':
          fullUrl = `https://youtube.com/channel/${value}`;
          break;
        case 'tiktok':
          fullUrl = `https://tiktok.com/@${value}`;
          break;
      }
    }

    const updatedCard = {
      ...card,
      social: {
        ...card.social,
        [field]: fullUrl
      }
    };
    onUpdate(updatedCard);
  };

  // Helper function to extract username from full URL for display
  const getDisplayValue = (field: string, fullUrl: string) => {
    if (!fullUrl) return '';
    
    // If it's already a username (no http), return as is
    if (!fullUrl.startsWith('http')) return fullUrl;
    
    // Extract username from full URL
    switch (field) {
      case 'linkedin':
        return fullUrl.replace('https://linkedin.com/in/', '');
      case 'twitter':
        return fullUrl.replace('https://twitter.com/', '');
      case 'facebook':
        return fullUrl.replace('https://facebook.com/', '');
      case 'instagram':
        return fullUrl.replace('https://instagram.com/', '');
      case 'youtube':
        return fullUrl.replace('https://youtube.com/channel/', '');
      case 'tiktok':
        return fullUrl.replace('https://tiktok.com/@', '');
      default:
        return fullUrl;
    }
  };

  const socialPlatforms = [
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: Linkedin,
      placeholder: 'username',
      prefix: 'https://linkedin.com/in/'
    },
    {
      key: 'twitter',
      label: 'Twitter/X',
      icon: Twitter,
      placeholder: 'username',
      prefix: 'https://twitter.com/'
    },
    {
      key: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      placeholder: 'username',
      prefix: 'https://facebook.com/'
    },
    {
      key: 'instagram',
      label: 'Instagram',
      icon: Instagram,
      placeholder: 'username',
      prefix: 'https://instagram.com/'
    },
    {
      key: 'youtube',
      label: 'YouTube',
      icon: Youtube,
      placeholder: 'channel-id',
      prefix: 'https://youtube.com/channel/'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-6">
          Add your social media profiles to help people connect with you.
        </p>
        
        <div className="space-y-4">
          {socialPlatforms.map(({ key, label, icon: Icon, placeholder, prefix }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {label}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                  {prefix}
                </span>
                <Input
                  id={key}
                  type="text"
                  placeholder={placeholder}
                  className="pl-[180px]"
                  value={getDisplayValue(key, card.social[key as keyof typeof card.social] || '')}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                />
              </div>
            </div>
          ))}

          {/* TikTok */}
          <div className="space-y-2">
            <Label htmlFor="tiktok" className="flex items-center gap-2">
              <svg 
                className="h-4 w-4"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
              TikTok
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                https://tiktok.com/@
              </span>
              <Input
                id="tiktok"
                type="text"
                placeholder="username"
                className="pl-[140px]"
                value={getDisplayValue('tiktok', card.social.tiktok || '')}
                onChange={(e) => handleInputChange('tiktok', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
