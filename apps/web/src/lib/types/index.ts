// src/types/index.ts
import { FeatureCollection } from 'geojson';

export interface DiscoveredFeature {
    id: string;
    naddr: string;
    pubkey: string;
    createdAt: number;
    featureCollection: FeatureCollection;
    name?: string;
    description?: string;
}

export interface ExtendedFeatureCollection extends FeatureCollection {
    naddr?: string;
    name: string;
    description: string;
}

export interface User {
    pubkey: string;
    name?: string;
    about?: string;
    picture?: string;
}

export type { Feature, FeatureCollection, Geometry } from 'geojson';