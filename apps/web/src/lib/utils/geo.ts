export async function getPolygonFromOsmId(osmId: string): Promise<GeoJSON.Feature | null> {
    const url = `https://nominatim.openstreetmap.org/lookup?osm_ids=R${osmId}&format=geojson&polygon_geojson=1`

    try {
        const response = await fetch(url)
        const data = await response.json()

        if (data && data.features && data.features.length > 0) {
            return data.features[0]
        } else {
            console.error('No polygon found for OSM ID:', osmId)
            return null
        }
    } catch (error) {
        console.error('Error fetching polygon:', error)
        return null
    }
}
