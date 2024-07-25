import React from 'react';
import DiscoveredFeatures from './DiscoveredFeatures';
import DiscoveredCollections from './DiscoveredCollections';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const DiscoverySidebar: React.FC = () => {
    return (
        <Tabs defaultValue="features">
            <TabsList>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="collections">Collections</TabsTrigger>
            </TabsList>
            <TabsContent value="features">
                <DiscoveredFeatures />
            </TabsContent>
            <TabsContent value="collections">
                <DiscoveredCollections />
            </TabsContent>
        </Tabs>
    );
};

export default DiscoverySidebar;
