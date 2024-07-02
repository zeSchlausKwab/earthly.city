import { Feature } from 'geojson';

const API_URL = 'http://localhost:3000/api';

export async function getFeatures() {
    const response = await fetch(`${API_URL}/features`);
    return response.json();
}

export async function createFeature(feature) {
    const response = await fetch(`${API_URL}/features`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(feature),
    });
    return response.json();
}

export async function updateFeature(feature: Feature): Promise<Feature> {
    const response = await fetch(`${API_URL}/features/${feature.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(feature),
    });
    return response.json();
}