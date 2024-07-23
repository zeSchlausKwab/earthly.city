import { PathOptions } from 'leaflet';

export function getFeatureStyle(properties: any): PathOptions {
    return {
        color: properties.color || '#3388ff',
        weight: properties.weight || 3,
        opacity: properties.opacity || 1,
        fillOpacity: properties.fillOpacity || 0.2
    };
}