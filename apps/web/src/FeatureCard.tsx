import React from 'react';
import { FeatureCollectionWithId } from "./components/DiscoverySidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FeatureCardProps {
    featureCollection: FeatureCollectionWithId;
    onEdit: (featureCollection: FeatureCollectionWithId) => void;
    onViewOnMap: (featureCollection: FeatureCollectionWithId) => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ featureCollection, onEdit, onViewOnMap }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Collection ID: {featureCollection.id.slice(0, 8)}...</h3>
                <div className='flex flex-row'>
                    <Button onClick={() => onViewOnMap(featureCollection)} className="mr-2">Zoom</Button>
                    <Button onClick={() => onEdit(featureCollection)}>Edit Collection</Button>
                </div>
            </div>
            <p className="text-sm mb-1">Type: {featureCollection.type}</p>
            <p className="text-sm mb-1">Features: {featureCollection.features.length}</p>

            {featureCollection.features.map((f, index) => (
                <Collapsible key={index} className="mt-2">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-gray-100 rounded">
                        <span>Feature {index + 1}: {f.geometry.type}</span>
                        <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-2 bg-gray-50">
                        <h4 className="font-semibold">Geometry:</h4>
                        <pre className="text-xs overflow-x-auto">
                            {JSON.stringify(f.geometry, null, 2)}
                        </pre>

                        <h4 className="font-semibold mt-2">Properties:</h4>
                        {Object.entries(f.properties || {}).map(([key, value]) => (
                            <p key={key} className="text-sm">
                                <strong>{key}:</strong> {JSON.stringify(value)}
                            </p>
                        ))}
                    </CollapsibleContent>
                </Collapsible>
            ))}

            {featureCollection.bbox && (
                <p className="text-sm mt-2">Bounding Box: [{featureCollection.bbox.join(', ')}]</p>
            )}
        </div>
    );
};

export default FeatureCard;