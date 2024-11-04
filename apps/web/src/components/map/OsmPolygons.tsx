import React, { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { useFeatureDiscovery } from '@/lib/store/featureDiscovery'
import { getPolygonFromOsmId } from '@/lib/utils/geo'

const OsmPolygons: React.FC = () => {
    const { discoveredFeatures } = useFeatureDiscovery()
    const map = useMap()

    useEffect(() => {
        const osmLayerGroup = L.layerGroup().addTo(map)

        async function fetchAndDisplayPolygon(osmId: string) {
            const polygon = await getPolygonFromOsmId(osmId)
            if (polygon) {
                L.geoJSON(polygon, {
                    style: {
                        color: '#ff7800',
                        weight: 2,
                        opacity: 0.65,
                    },
                }).addTo(osmLayerGroup)
            }
        }

        // Fetch polygons for all OsmLinkFeatures
        discoveredFeatures.forEach((feature) => {
            feature.featureCollection.features.forEach((subFeature) => {
                if (subFeature.type === 'FeatureLink') {
                    fetchAndDisplayPolygon(subFeature.properties.osmId)
                }
            })
        })

        // Cleanup function to remove the layer group when the component unmounts
        return () => {
            map.removeLayer(osmLayerGroup)
        }
    }, [discoveredFeatures, map])

    return null // This component doesn't render anything directly
}

export default OsmPolygons
