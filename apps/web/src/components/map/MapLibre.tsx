'use client'

import { featuresErrorAtom, isLoadingFeaturesAtom, ndkAtom } from '@/lib/store'
import { useFeatureCollection } from '@/lib/store/featureCollection'
import { useFeatureDiscovery } from '@/lib/store/featureDiscovery'
import '@maplibre/maplibre-gl-leaflet'
import { Feature } from 'geojson'
import { useAtom } from 'jotai'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from 'react'
import Map, { Layer, LayerProps, MapRef, Popup, Source, useControl } from 'react-map-gl/maplibre'
import maplibregl from 'maplibre-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

import ErrorBoundary from '../ErrorBoundary'
import LoadingSpinner from '../LoadingSpinner'
import { MaplibreGeomanControl } from './MaplibreGeomanControl'
import { MapboxGLDraw } from './MapboxGLDraw'

// const SetMapInstance: React.FC = () => {
//     const map = useMap()
//     const { setMap } = useFeatureCollection()

//     useEffect(() => {
//         setMap(map)
//     }, [map, setMap])

//     return null
// }

export const dataLayer: LayerProps = {
    id: 'data',
    type: 'fill',
    paint: {
        'fill-color': {
            type: 'interval',
            property: 'percentile',
            stops: [
                [0, '#3288bd'],
                [1, '#66c2a5'],
                [2, '#abdda4'],
                [3, '#e6f598'],
                [4, '#ffffbf'],
                [5, '#fee08b'],
                [6, '#fdae61'],
                [7, '#f46d43'],
                [8, '#d53e4f'],
            ],
        },
        'fill-opacity': 0.8,
    },
}

const MapContent = () => {
    const { discoveredFeatures, startSubscription, stopSubscription } = useFeatureDiscovery()
    const { loadFeatureCollection, zoomToFeatureBounds, isEditing } = useFeatureCollection()
    const [ndk] = useAtom(ndkAtom)
    const [isLoadingFeatures] = useAtom(isLoadingFeaturesAtom)
    const [featuresError] = useAtom(featuresErrorAtom)
    const [popupInfo, setPopupInfo] = useState<Feature | null>(null)

    useEffect(() => {
        if (ndk) {
            startSubscription()
            return () => stopSubscription()
        }
    }, [ndk, startSubscription, stopSubscription])

    if (isLoadingFeatures) {
        return <LoadingSpinner />
    }

    if (featuresError) {
        return <div>Error loading features: {featuresError}</div>
    }

    const renderLayer = (feature: Feature) => {
        if (!feature.geometry) return null

        const baseStyle = {
            'fill-opacity': 0.5,
            'line-width': 2,
            'line-opacity': 0.8,
        }

        switch (feature.geometry.type) {
            case 'Polygon':
            case 'MultiPolygon':
                return (
                    <Layer
                        key={feature.id}
                        type="fill"
                        paint={{
                            'fill-color': feature.properties?.color || '#3388ff',
                            'fill-opacity': baseStyle['fill-opacity'],
                        }}
                    />
                )
            case 'LineString':
            case 'MultiLineString':
                return (
                    <Layer
                        key={feature.id}
                        type="line"
                        paint={{
                            'line-color': feature.properties?.color || '#3388ff',
                            'line-width': baseStyle['line-width'],
                            'line-opacity': baseStyle['line-opacity'],
                        }}
                    />
                )
            case 'Point':
            case 'MultiPoint':
                return (
                    <Layer
                        key={feature.id}
                        type="circle"
                        paint={{
                            'circle-color': feature.properties?.color || '#3388ff',
                        }}
                    />
                )
            default:
                return null
        }
    }

    return (
        <Map
            mapLib={maplibregl}
            maplibreLogo
            initialViewState={{
                latitude: 51.2884,
                longitude: 0.156,
                zoom: 9,
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="https://tiles.openfreemap.org/styles/positron"
        >
            {discoveredFeatures.map((feature) => (
                <Source key={feature.id} type="geojson" data={feature.featureCollection}>
                    {feature.featureCollection.features.map((innerFeature) => renderLayer(innerFeature))}
                </Source>
            ))}

            {/* <DrawControl
                position="top-left"
                displayControlsDefault={false}
                controls={{
                    polygon: true,
                    trash: true,
                }}
            /> */}
            <MaplibreGeomanControl position="topleft" enabled={isEditing} />
        </Map>
    )
}

const MapLibre = () => (
    <ErrorBoundary fallback={<div>Something went wrong with the map. Please try refreshing the page.</div>}>
        <MapContent />
    </ErrorBoundary>
)

export default MapLibre
