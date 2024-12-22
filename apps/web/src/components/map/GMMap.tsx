import { FeatureData, GeoJsonImportFeature, Geoman } from '@geoman-io/maplibre-geoman-free'
import '@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import ml from 'maplibre-gl'
import React, { useEffect, useRef } from 'react'
import mapStyle from './map-libre-styles'
import { useFeatureDiscovery } from '@/lib/store/featureDiscovery'
import { useAtom } from 'jotai'
import { ndkAtom } from '@/lib/store'
import { useFeatureCollection } from '@/lib/store/featureCollection'
import { Feature } from 'geojson'

export interface GmEvent {
    feature?: FeatureData
    enabled?: boolean
    type: string
    shape?: string
    [key: string]: unknown
}

export interface GmEventData {
    id?: string | number
    enabled?: boolean
    timestamp: string
    type: string
    shape?: string
    geojson?: string
}

interface GmMapProps {
    handleEvent: (event: GmEvent) => void
}

const gmOptions = {
    controls: {
        helper: {
            snapping: {
                uiEnabled: true,
                active: true,
            },
        },
    },
}

const GmMap: React.FC<GmMapProps> = ({ handleEvent }) => {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstance = useRef<ml.Map | null>(null)
    const geomanInstance = useRef<Geoman | null>(null)
    const { discoveredFeatures, startSubscription, stopSubscription } = useFeatureDiscovery()
    const { loadFeatureCollection, zoomToFeatureBounds, isEditing, createFeature, updateFeature, deleteFeature } = useFeatureCollection()

    useEffect(() => {
        if (mapRef.current) {
            const map = new ml.Map({
                container: mapRef.current,
                style: mapStyle,
                center: [0, 51],
                zoom: 5,
                fadeDuration: 50,
            })

            mapInstance.current = map
            const geoman = new Geoman(map, gmOptions)
            geomanInstance.current = geoman

            // Load discovered features
            const loadDiscoveredFeatures = () => {
                if (!geomanInstance.current) {
                    console.warn('Geoman not loaded yet')
                    return
                }

                discoveredFeatures.forEach((shapeGeoJson) => {
                    shapeGeoJson.featureCollection.features.forEach((feature) => {
                        geomanInstance.current!.features.importGeoJsonFeature(feature as GeoJsonImportFeature)
                    })
                })

                console.log('Shapes loaded', discoveredFeatures)
            }

            map.on('gm:loaded', () => {
                console.log('Geoman loaded', geoman)
                // Enable drawing tools
                geoman.enableDraw('line')
                // Load discovered features
                loadDiscoveredFeatures()
            })

            // Handle feature creation
            map.on('gm:create', (e: { feature: Feature }) => {
                console.log('pm:create event fired:', e)
                if (!e.feature) {
                    console.warn('No feature in create event')
                    return
                }

                const feature = e.feature
                if (!feature.properties) {
                    feature.properties = {}
                }
                if (!feature.properties.id) {
                    feature.properties.id = crypto.randomUUID()
                }

                console.log('Creating feature with properties:', feature.properties)
                console.log('Feature geometry:', feature.geometry)

                createFeature(feature)
            })

            // Handle feature updates
            map.on('gm:edit', (e: { feature: Feature }) => {
                if (!e.feature) return

                const feature = e.feature
                if (!feature.properties?.id) {
                    feature.properties = {
                        ...feature.properties,
                        id: crypto.randomUUID(),
                    }
                }

                console.log('updating feature', feature)
                updateFeature(feature)
            })

            // Handle feature deletion
            map.on('gm:remove', (e: { feature: Feature }) => {
                if (!e.feature?.properties?.id) return
                console.log('deleting feature', e.feature)
                deleteFeature(e.feature.properties.id)
            })

            // Mode events
            map.on('gm:globaldrawmodetoggled', handleEvent)
            map.on('gm:globaleditmodetoggled', handleEvent)
            map.on('gm:globalremovemodetoggled', handleEvent)
            map.on('gm:globalrotatemodetoggled', handleEvent)
            map.on('gm:globaldragmodetoggled', handleEvent)
            map.on('gm:globalcutmodetoggled', handleEvent)
            map.on('gm:globalsnappingmodetoggled', handleEvent)

            // Drawing events
            map.on('gm:draw', handleEvent)

            // Edit events
            map.on('gm:editstart', handleEvent)
            map.on('gm:editend', handleEvent)

            // Rotate events
            map.on('gm:rotatestart', handleEvent)
            map.on('gm:rotateend', handleEvent)

            // Drag events
            map.on('gm:dragstart', handleEvent)
            map.on('gm:dragend', handleEvent)

            // Cut events
            map.on('gm:cut', handleEvent)

            // Helper and control events
            map.on('gm:helper', handleEvent)
            map.on('gm:control', handleEvent)

            // Cleanup function
            return () => {
                if (mapInstance.current) {
                    mapInstance.current.remove()
                }
            }
        }
    }, [handleEvent, discoveredFeatures, createFeature, updateFeature, deleteFeature])

    return (
        <div id="dev-map" ref={mapRef} style={{ flex: '1 1 auto', width: '100%' }}>
            {/* MapLibre Geoman container */}
        </div>
    )
}

export default GmMap
