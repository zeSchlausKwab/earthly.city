'use client'

import React from 'react'
import { Geoman, GmOptionsPartial } from '@geoman-io/maplibre-geoman-free'
import '@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import ml from 'maplibre-gl'
import { useFeatureCollection } from '@/lib/store/featureCollection'
import { useFeatureDiscovery } from '@/lib/store/featureDiscovery'
import { featuresErrorAtom, isLoadingFeaturesAtom, ndkAtom } from '@/lib/store'
import { Feature, GeoJsonProperties, Geometry } from 'geojson'
import { useAtom } from 'jotai'
import { useEffect, useCallback, useRef, useState } from 'react'
import Map, { Layer, Source, Popup, NavigationControl, useMap } from 'react-map-gl/maplibre'
import type { Map as MaplibreMap } from 'maplibre-gl'
import '@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import ErrorBoundary from '../ErrorBoundary'
import LoadingSpinner from '../LoadingSpinner'
import type { FilterSpecification } from 'maplibre-gl'

declare module 'maplibre-gl' {
    interface Map {
        pm: any
    }
}

interface GeomanOptions {
    drawMode?: boolean
    editMode?: boolean
    dragMode?: boolean
    cutMode?: boolean
    removalMode?: boolean
    rotateMode?: boolean
}

const GeomanControls: React.FC = () => {
    const { current: map } = useMap()
    const { createFeature, updateFeature, deleteFeature } = useFeatureCollection()
    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const geomanRef = useRef<Geoman | null>(null)

    useEffect(() => {
        if (!map) return

        const mapInstance = map.getMap() as MaplibreMap
        if (!mapInstance) return

        const handleLoad = () => {
            try {
                if (!mapInstance.pm) {
                    console.log('Initializing Geoman...')
                    // Initialize with minimal options
                    const gmOptions: GmOptionsPartial = {
                        drawMode: true,
                        editMode: true,
                        removalMode: true,
                        drawStyles: {
                            polygon: {
                                color: '#3388ff',
                                fillColor: '#3388ff',
                                fillOpacity: 0.2,
                            },
                            line: {
                                color: '#3388ff',
                                weight: 3,
                            },
                        },
                    }

                    // Initialize Geoman
                    const geomanInstance = new Geoman(mapInstance, gmOptions)
                    geomanRef.current = geomanInstance
                    mapInstance.pm = geomanInstance

                    // Add the toolbar
                    mapInstance.pm.Toolbar.createCustomControl({
                        name: 'drawPolygon',
                        block: 'draw',
                        title: 'Draw a polygon',
                        onClick: () => {
                            console.log('Starting polygon draw mode')
                            mapInstance.pm.Draw.start({ shape: 'Polygon' })
                        },
                    })

                    mapInstance.pm.Toolbar.createCustomControl({
                        name: 'drawLine',
                        block: 'draw',
                        title: 'Draw a line',
                        onClick: () => {
                            console.log('Starting line draw mode')
                            mapInstance.pm.Draw.start({ shape: 'Line' })
                        },
                    })

                    mapInstance.pm.Toolbar.createCustomControl({
                        name: 'drawMarker',
                        block: 'draw',
                        title: 'Place a marker',
                        onClick: () => {
                            console.log('Starting marker draw mode')
                            mapInstance.pm.Draw.start({ shape: 'Marker' })
                        },
                    })

                    // Add debug logging for Geoman events
                    mapInstance.on('pm:drawstart', (e) => console.log('Drawing started:', e))
                    mapInstance.on('pm:drawend', (e) => console.log('Drawing ended:', e))
                    mapInstance.on('pm:create', (e) => console.log('Feature created:', e))

                    console.log('Geoman initialized successfully')
                }

                setIsMapLoaded(true)
            } catch (error) {
                console.error('Error initializing Geoman:', error)
            }
        }

        if (mapInstance.loaded()) {
            console.log('Map already loaded, initializing immediately')
            handleLoad()
        } else {
            console.log('Map not loaded, waiting for load event')
            mapInstance.once('load', handleLoad)
        }

        return () => {
            if (mapInstance) {
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
            const handleCreate = (e: { feature: Feature }) => {
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
            }

            const handleEdit = (e: { feature: Feature }) => {
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
            }

            const handleRemove = (e: { feature: Feature }) => {
                if (!e.feature?.properties?.id) return
                console.log('deleting feature', e.feature)
                deleteFeature(e.feature.properties.id)
            }

            // Add event listeners
            mapInstance.on('pm:create', handleCreate)
            mapInstance.on('pm:edit', handleEdit)
            mapInstance.on('pm:remove', handleRemove)

            return () => {
                // Remove event listeners
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
        const featureFilter: FilterSpecification = ['==', ['get', 'id'], feature.properties.id]

        switch (feature.geometry.type) {
            case 'Point':
                return (
                    <Layer
                        key={layerIdBase}
                        id={layerIdBase}
                        source={sourceId}
                        type="circle"
                        filter={featureFilter}
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
                        filter={featureFilter}
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
                    <React.Fragment key={layerIdBase}>
                        <Layer
                            key={`${layerIdBase}-fill`}
                            id={`${layerIdBase}-fill`}
                            source={sourceId}
                            type="fill"
                            filter={featureFilter}
                            layout={{
                                visibility: 'visible',
                            }}
                            paint={{
                                'fill-color': color,
                                'fill-opacity': 0.3,
                            }}
                        />
                        <Layer
                            key={`${layerIdBase}-outline`}
                            id={`${layerIdBase}-outline`}
                            source={sourceId}
                            type="line"
                            filter={featureFilter}
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
                    </React.Fragment>
                )
            default:
                console.warn('Unsupported geometry type:', feature.geometry.type)
                return null
        }
    }, [])

    if (isLoadingFeatures) return <LoadingSpinner />
    if (featuresError) return <div>Error loading features: {featuresError}</div>

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

            {discoveredFeatures.map((feature, index) => {
                console.log('rendering feature', feature)
                return (
                    <Source key={index} id={`source-${feature.id}`} type="geojson" data={feature.featureCollection}>
                        {feature.featureCollection.features.map((feat) => {
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
