import { Feature, FeatureCollection, GeoJsonProperties } from 'geojson'

export interface DiscoveredFeature {
    id: string
    naddr: string
    pubkey: string
    createdAt: number
    featureCollection: FeatureCollection
    name?: string
    description?: string
}

export interface ExtendedFeatureCollection extends Omit<FeatureCollection, 'features'> {
    naddr?: string
    name: string
    description: string
    features: (Feature | OsmLinkFeature)[]
}

export interface GeoJSONFeature extends Feature {
    properties: GeoJsonProperties & {
        name?: string
        description?: string
        color?: string
    }
}

export interface OsmLinkFeature {
    type: 'FeatureLink'
    properties: {
        name: string
        description?: string
        osmId: string
    }
    geometry: null
}

export interface User {
    pubkey: string
    name?: string
    about?: string
    picture?: string
}
