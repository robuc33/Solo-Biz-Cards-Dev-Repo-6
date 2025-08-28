import React from 'react';
import { FormComponentProps } from '@/types/businessCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { defaultBrandColors } from '@/utils/businessCard';

export function BrandColorSection({ card, onUpdate }: FormComponentProps) {
  const handleInputChange = (field: string, value: string) => {
    const keys = field.split('.');
    const updatedCard = { ...card };
    
    if (keys.length === 1) {
      (updatedCard as any)[keys[0]] = value;
    } else if (keys.length === 2) {
      (updatedCard as any)[keys[0]][keys[1]] = value;
    }
    
    onUpdate(updatedCard);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-foreground">Brand Color</Label>
      <div className="flex items-center gap-3">
        {/* Color Picker Input */}
        <input
          type="color"
          value={card.brandColor}
          onChange={(e) => handleInputChange('brandColor', e.target.value)}
          className="w-12 h-8 rounded border border-border flex-shrink-0 cursor-pointer"
        />
        
        {/* Hex Input */}
        <Input
          type="text"
          placeholder="#4299E1"
          value={card.brandColor}
          onChange={(e) => handleInputChange('brandColor', e.target.value)}
          className="w-28 font-mono text-sm flex-shrink-0"
        />
        
        {/* Color Palette */}
        <div className="flex gap-2 flex-wrap">
          {defaultBrandColors.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full border-2 flex-shrink-0 ${
                card.brandColor === color ? 'border-foreground ring-2 ring-offset-2 ring-primary' : 'border-border'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleInputChange('brandColor', color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}