'use client'

import { featuresErrorAtom, isLoadingFeaturesAtom, ndkAtom } from '@/lib/store'
import { useFeatureCollection } from '@/lib/store/featureCollection'
import { useFeatureDiscovery } from '@/lib/store/featureDiscovery'
import '@maplibre/maplibre-gl-leaflet'
import { Feature, GeoJsonObject, Point } from 'geojson'
import { useAtom } from 'jotai'
import L, { Layer, PathOptions } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useEffect } from 'react'
import ReactDOMServer from 'react-dom/server'
import { GeoJSON, MapContainer, useMap } from 'react-leaflet'
import ErrorBoundary from '../ErrorBoundary'
import LoadingSpinner from '../LoadingSpinner'
import Events from './Events'
import { GeomanControl } from './GeomanControl'
import { GeoSearchControlComponent } from './GeoSearch'
import { MapLibreTileLayer } from './MapLibreTileLayer'
import OsmPolygons from './OsmPolygons'

const svgIcon = L.divIcon({
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `,
    className: 'svg-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
})

const SetMapInstance: React.FC = () => {
    const map = useMap()
    const { setMap } = useFeatureCollection()

    useEffect(() => {
        setMap(map)
    }, [map, setMap])

    return null
}

const MapContent = () => {
    const { discoveredFeatures, startSubscription, stopSubscription } = useFeatureDiscovery()
    const { loadFeatureCollection, zoomToFeatureBounds, isEditing } = useFeatureCollection()
    const [ndk] = useAtom(ndkAtom)
    const [isLoadingFeatures] = useAtom(isLoadingFeaturesAtom)
    const [featuresError] = useAtom(featuresErrorAtom)

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

    const getFeatureStyle = (feature: GeoJsonObject | undefined): PathOptions => {
        if (!feature) {
            return {}
        }
        if (feature.type === 'Feature' && feature.properties && feature.properties.color) {
            return {
                color: feature.properties.color,
                weight: 3,
                opacity: 1,
                fillOpacity: 0.7,
            }
        }
        return {
            color: '#3388ff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.7,
        }
    }

    const onEachFeature = (feature: Feature, layer: Layer, parent: any) => {
        if (feature.properties) {
            const popupContent = ReactDOMServer.renderToString(
                <div>
                    <h3 className="text-lg font-bold">{feature.properties.name || 'Unnamed Feature'}</h3>
                    <p>{feature.properties.description || 'No description'}</p>
                    {Object.entries(feature.properties).map(
                        ([key, value]) =>
                            key !== 'name' &&
                            key !== 'description' && (
                                <p key={key}>
                                    <strong>{key}:</strong> {String(value)}
                                </p>
                            )
                    )}
                    <div className="flex flex-row gap-2">
                        <button className="edit-button">Edit</button>
                        <button className="view-button">View</button>
                    </div>
                </div>
            )

            const popup = L.popup().setContent(popupContent)
            layer.bindPopup(popup)

            layer.on('popupopen', () => {
                const popupElement = layer.getPopup()?.getElement()
                const editButton = popupElement?.querySelector('.edit-button')
                const viewButton = popupElement?.querySelector('.view-button')

                if (editButton) {
                    editButton.addEventListener('click', () => {
                        loadFeatureCollection(parent, true)
                        zoomToFeatureBounds(parent)
                    })
                }
                if (viewButton) {
                    viewButton.addEventListener('click', () => {
                        loadFeatureCollection(parent, false)
                        zoomToFeatureBounds(parent)
                    })
                }
            })
        }
    }

    const pointToLayer = (feature: Feature<Point, any>, latlng: L.LatLng) => {
        return new L.Marker(latlng, {
            icon: svgIcon,
            opacity: 1,
        })
    }

    return (
        <MapContainer center={[51.270937, -0.005493]} zoom={11} scrollWheelZoom={true} style={{ width: '100%', height: '100%', zIndex: 0 }}>
            <MapLibreTileLayer
                attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                url="https://tiles.openfreemap.org/styles/positron"
            />
            <SetMapInstance />
            {isEditing && <GeomanControl position="topleft" oneBlock />}
            <Events />

            <OsmPolygons />

            {/* <MarkerClusterGroup chunkedLoading> */}
            {discoveredFeatures.map((feature) => (
                <GeoJSON
                    key={feature.id}
                    data={feature.featureCollection}
                    pmIgnore={true}
                    style={getFeatureStyle}
                    pointToLayer={pointToLayer}
                    onEachFeature={(innerFeature, layer) => onEachFeature(innerFeature, layer, feature)}
                />
            ))}
            {/* </MarkerClusterGroup> */}

            <GeoSearchControlComponent />
        </MapContainer>
    )
}

const Map = () => (
    <ErrorBoundary fallback={<div>Something went wrong with the map. Please try refreshing the page.</div>}>
        <MapContent />
    </ErrorBoundary>
)

export default Map
