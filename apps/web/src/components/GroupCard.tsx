import React from 'react';
import { Group } from "@/lib/store/group-discovery";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from 'lucide-react';

const GroupCard: React.FC<{ group: Group }> = ({ group }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
            <p className="text-sm mb-1">Kind: {group.kind}</p>
            {group.about && <p className="text-sm mb-1">{group.about}</p>}
            <p className="text-sm">Associated Features: {group.featureIds.length}</p>

            <Collapsible className="mt-2">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-gray-100 rounded">
                    <span>Associated Feature IDs</span>
                    <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-2 bg-gray-50">
                    {group.featureIds.map((id, index) => (
                        <p key={index} className="text-sm">{id}</p>
                    ))}
                </CollapsibleContent>
            </Collapsible>

            {group.picture && (
                <img src={group.picture} alt={group.name} className="mt-2 w-full h-auto rounded" />
            )}
        </div>
    );
};

export default GroupCard;