'use client'

import { useFeatureCollection } from '@/lib/store/featureCollection'
import { useFeatureDiscovery } from '@/lib/store/featureDiscovery'
import { featuresErrorAtom, isLoadingFeaturesAtom, ndkAtom } from '@/lib/store'
import { Feature, GeoJsonProperties, Geometry } from 'geojson'
import { useAtom } from 'jotai'
import { useEffect, useCallback, useRef, useState } from 'react'
import Map, { Layer, Source, Popup, NavigationControl, useMap } from 'react-map-gl/maplibre'
import type { Map as MaplibreMap } from 'maplibre-gl'
import { Geoman } from '@geoman-io/maplibre-geoman-free'
import '@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import ErrorBoundary from '../ErrorBoundary'
import LoadingSpinner from '../LoadingSpinner'

// Extend MapLibre's Map type to include Geoman properties
declare module 'maplibre-gl' {
    interface Map {
        pm: any
    }
}

const GeomanControls: React.FC = () => {
    const { current: map } = useMap()
    const { createFeature, updateFeature, deleteFeature } = useFeatureCollection()
    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const geomanRef = useRef<any>(null)

    useEffect(() => {
        if (!map) return

        const mapInstance = map.getMap() as MaplibreMap
        if (!mapInstance) return

        const handleLoad = () => {
            try {
                // Initialize Geoman only if it hasn't been initialized
                if (!mapInstance.pm) {
                    const geomanInstance = new Geoman(mapInstance)
                    geomanRef.current = geomanInstance
                    mapInstance.pm = geomanInstance
                }

                // Enable drawing controls with only the basic features
                mapInstance.pm.addControls({
                    position: 'topleft',
                    drawMarker: true,
                    drawPolyline: true,
                    drawPolygon: true,
                    editMode: true,
                    dragMode: false,
                    removalMode: true,
                    drawCircle: false,
                    drawRectangle: false,
                    drawCircleMarker: false,
                    cutPolygon: false,
                    rotateMode: false,
                })

                setIsMapLoaded(true)
                console.log('Geoman initialized successfully')
            } catch (error) {
                console.error('Error initializing Geoman:', error)
            }
        }

        if (mapInstance.loaded()) {
            handleLoad()
        } else {
            mapInstance.on('load', handleLoad)
        }

        return () => {
            if (mapInstance && mapInstance.loaded()) {
                mapInstance.off('load', handleLoad)
                if (mapInstance.pm) {
                    try {
                        mapInstance.pm.removeControls()
                    } catch (error) {
                        console.error('Error removing Geoman controls:', error)
                    }
                }
            }
        }
    }, [map])

    useEffect(() => {
        if (!map || !isMapLoaded || !geomanRef.current) return

        const mapInstance = map.getMap() as MaplibreMap
        if (!mapInstance || !mapInstance.pm) return

        try {
            // Event handlers
            const handleCreate = (e: any) => {
                if (!e.feature) return
                // Add ID to feature if missing
                if (!e.feature.properties) {
                    e.feature.properties = {}
                }
                if (!e.feature.properties.id) {
                    e.feature.properties.id = crypto.randomUUID()
                }
                console.log('Created feature:', e.feature)
                createFeature(e.feature)
            }

            const handleEdit = (e: any) => {
                if (!e.feature) return
                // Ensure feature has ID
                if (!e.feature.properties?.id) {
                    e.feature.properties = {
                        ...e.feature.properties,
                        id: crypto.randomUUID(),
                    }
                }
                console.log('Edited feature:', e.feature)
                updateFeature(e.feature)
            }

            const handleRemove = (e: any) => {
                if (!e.feature || !e.feature.properties?.id) return
                console.log('Removed feature:', e.feature)
                deleteFeature(e.feature.properties.id)
            }

            // Attach event listeners
            mapInstance.on('pm:create', handleCreate)
            mapInstance.on('pm:edit', handleEdit)
            mapInstance.on('pm:remove', handleRemove)

            return () => {
                mapInstance.off('pm:create', handleCreate)
                mapInstance.off('pm:edit', handleEdit)
                mapInstance.off('pm:remove', handleRemove)
            }
        } catch (error) {
            console.error('Error setting up Geoman events:', error)
        }
    }, [map, isMapLoaded, createFeature, updateFeature, deleteFeature])

    return null
}

const MapContent = () => {
    const { discoveredFeatures, startSubscription, stopSubscription } = useFeatureDiscovery()
    const { loadFeatureCollection, zoomToFeatureBounds, isEditing } = useFeatureCollection()
    const [ndk] = useAtom(ndkAtom)
    const [isLoadingFeatures] = useAtom(isLoadingFeaturesAtom)
    const [featuresError] = useAtom(featuresErrorAtom)
    const [popupInfo, setPopupInfo] = useState<{
        feature: Feature
        parent: any
        lngLat: [number, number]
    } | null>(null)

    useEffect(() => {
        if (ndk) {
            console.log('Starting subscription with NDK:', ndk)
            startSubscription()
            return () => stopSubscription()
        }
    }, [ndk, startSubscription, stopSubscription])

    const handleClick = useCallback((event: any, feature: Feature, parent: any) => {
        if (!event.features?.length) return

        const clickedFeature = event.features[0]
        const coordinates = event.lngLat
        if (!coordinates) return

        setPopupInfo({
            feature: clickedFeature,
            parent,
            lngLat: [coordinates.lng, coordinates.lat],
        })
    }, [])

    const renderLayer = useCallback((feature: Feature<Geometry, GeoJsonProperties>, sourceId: string) => {
        const color = feature.properties?.color || '#3388ff'
        const featureId = feature.properties?.id

        // If feature is missing ID, generate one
        if (!featureId && feature.properties) {
            feature.properties.id = crypto.randomUUID()
        }

        // Skip rendering if still no feature ID
        if (!feature.properties?.id) {
            console.warn('Feature missing ID:', feature)
            return null
        }

        // Validate geometry
        if (!feature.geometry) {
            console.warn('Missing geometry in feature:', feature)
            return null
        }

        // Skip GeometryCollection for now
        if (feature.geometry.type === 'GeometryCollection') {
            console.warn('GeometryCollection not supported:', feature)
            return null
        }

        const layerIdBase = `${feature.properties.id}-${feature.geometry.type.toLowerCase()}`
        console.log('Rendering layer:', { layerIdBase, sourceId, feature })

        switch (feature.geometry.type) {
            case 'Point':
                return (
                    <Layer
                        key={layerIdBase}
                        id={layerIdBase}
                        source={sourceId}
                        type="circle"
                        layout={{
                            visibility: 'visible',
                        }}
                        paint={{
                            'circle-radius': 6,
                            'circle-color': color,
                            'circle-stroke-width': 2,
                            'circle-stroke-color': '#ffffff',
                        }}
                    />
                )
            case 'LineString':
            case 'MultiLineString':
                return (
                    <Layer
                        key={layerIdBase}
                        id={layerIdBase}
                        source={sourceId}
                        type="line"
                        layout={{
                            visibility: 'visible',
                            'line-cap': 'round',
                            'line-join': 'round',
                        }}
                        paint={{
                            'line-color': color,
                            'line-width': 3,
                        }}
                    />
                )
            case 'Polygon':
            case 'MultiPolygon':
                return (
                    <>
                        <Layer
                            key={`${layerIdBase}-fill`}
                            id={`${layerIdBase}-fill`}
                            source={sourceId}
                            type="fill"
                            layout={{
                                visibility: 'visible',
                            }}
                            paint={{
                                'fill-color': color,
                                'fill-opacity': 0.5,
                            }}
                        />
                        <Layer
                            key={`${layerIdBase}-outline`}
                            id={`${layerIdBase}-outline`}
                            source={sourceId}
                            type="line"
                            layout={{
                                visibility: 'visible',
                                'line-cap': 'round',
                                'line-join': 'round',
                            }}
                            paint={{
                                'line-color': color,
                                'line-width': 2,
                            }}
                        />
                    </>
                )
            default:
                console.warn('Unsupported geometry type:', feature.geometry.type)
                return null
        }
    }, [])

    if (isLoadingFeatures) return <LoadingSpinner />
    if (featuresError) return <div>Error loading features: {featuresError}</div>

    console.log('Discovered features:', discoveredFeatures)

    return (
        <Map
            initialViewState={{
                longitude: -0.005493,
                latitude: 51.270937,
                zoom: 11,
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="https://tiles.openfreemap.org/styles/positron"
            interactiveLayerIds={discoveredFeatures.flatMap((f) =>
                f.featureCollection.features.map((feat) => `${feat.properties?.id}-${feat.geometry.type.toLowerCase()}`)
            )}
            onClick={(e) => {
                const feature = e.features?.[0]
                if (feature) {
                    const parent = discoveredFeatures.find((f) =>
                        f.featureCollection.features.some((feat) => feat.properties?.id === feature.properties?.id)
                    )
                    if (parent) {
                        handleClick(e, feature, parent)
                    }
                }
            }}
        >
            <NavigationControl />

            {/* {isEditing && <GeomanControls />} */}

            <GeomanControls />

            {discoveredFeatures.map((feature) => {
                console.log('Rendering feature collection:', feature)
                return (
                    <Source key={feature.id} id={`source-${feature.id}`} type="geojson" data={feature.featureCollection}>
                        {feature.featureCollection.features.map((feat) => {
                            console.log('Rendering feature:', feat)
                            return renderLayer(feat, `source-${feature.id}`)
                        })}
                    </Source>
                )
            })}

            {popupInfo && (
                <Popup longitude={popupInfo.lngLat[0]} latitude={popupInfo.lngLat[1]} onClose={() => setPopupInfo(null)} closeButton={true}>
                    <div className="p-2">
                        <h3 className="text-lg font-bold">{popupInfo.feature.properties?.name || 'Unnamed Feature'}</h3>
                        <p>{popupInfo.feature.properties?.description || 'No description'}</p>
                        {Object.entries(popupInfo.feature.properties || {}).map(
                            ([key, value]) =>
                                key !== 'name' &&
                                key !== 'description' && (
                                    <p key={key}>
                                        <strong>{key}:</strong> {String(value)}
                                    </p>
                                )
                        )}
                        <div className="flex flex-row gap-2 mt-2">
                            <button
                                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                    loadFeatureCollection(popupInfo.parent, true)
                                    zoomToFeatureBounds(popupInfo.parent)
                                    setPopupInfo(null)
                                }}
                            >
                                Edit
                            </button>
                            <button
                                className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                onClick={() => {
                                    loadFeatureCollection(popupInfo.parent, false)
                                    zoomToFeatureBounds(popupInfo.parent)
                                    setPopupInfo(null)
                                }}
                            >
                                View
                            </button>
                        </div>
                    </div>
                </Popup>
            )}
        </Map>
    )
}

const MapWrapper = () => (
    <ErrorBoundary fallback={<div>Something went wrong with the map. Please try refreshing the page.</div>}>
        <MapContent />
    </ErrorBoundary>
)

export default MapWrapper
