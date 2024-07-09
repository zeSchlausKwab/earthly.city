// components/FeatureEdit.tsx
import React from 'react';
import { Feature } from 'geojson';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FeatureEditProps {
    feature: Feature;
    onPropertyChange: (key: string, value: string) => void;
}

export const FeatureEdit: React.FC<FeatureEditProps> = ({ feature, onPropertyChange, children }) => {
    const { properties, geometry } = feature;

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Input
                        value={properties?.name || ''}
                        onChange={(e) => onPropertyChange('name', e.target.value)}
                        placeholder="Feature Name"
                    />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={properties?.description || ''}
                            onChange={(e) => onPropertyChange('description', e.target.value)}
                            placeholder="Feature Description"
                        />
                    </div>
                    <div>
                        <Label htmlFor="color">Color</Label>
                        <Input
                            id="color"
                            type="color"
                            value={properties?.color || '#000000'}
                            onChange={(e) => onPropertyChange('color', e.target.value)}
                        />
                    </div>
                    <Collapsible>
                        <CollapsibleTrigger className="flex items-center">
                            Geometry Details {geometry.type}
                            <ChevronDown className="h-4 w-4 ml-2" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            {children}
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </CardContent>
        </Card>
    );
};