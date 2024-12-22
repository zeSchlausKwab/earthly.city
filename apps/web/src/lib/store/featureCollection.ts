'use client'

import { generateRandomColor } from '@earthly-land/common'
import { Feature, FeatureCollection, GeoJsonProperties } from 'geojson'
import { atom, useAtom } from 'jotai'
import type { Map as LeafletMap } from 'leaflet'
import { v4 as uuidv4 } from 'uuid'
import { ndkAtom } from '.'
import { publishFeatureCollection, updateFeatureCollection } from '../api/ndk'
import { DiscoveredFeature, ExtendedFeatureCollection } from '../types'

const featureCollectionAtom = atom<ExtendedFeatureCollection | null>(null)

const unsavedChangesAtom = atom<boolean>(false)
const isEditingAtom = atom<boolean>(false)
const mapInstanceAtom = atom<LeafletMap | null>(null)

export const useFeatureCollection = () => {
    const [unsavedChanges, setUnsavedChanges] = useAtom(unsavedChangesAtom)
    const [isEditing, setIsEditing] = useAtom(isEditingAtom)
    const [mapInstance, setMapInstance] = useAtom(mapInstanceAtom)
    const [featureCollection, setFeatureCollection] = useAtom(featureCollectionAtom)
    const [ndk] = useAtom(ndkAtom)

    const setMap = (map: LeafletMap) => {
        setMapInstance(map)
    }

    const createNewFeatureCollection = () => {
        setFeatureCollection({
            id: uuidv4(),
            type: 'FeatureCollection',
            features: [],
            name: 'New Feature Collection',
            description: 'Description of the new feature collection',
        })
        setUnsavedChanges(true)
        startEditing()
    }

    const zoomToFeatureBounds = (feature: DiscoveredFeature) => {
        if (typeof window !== 'undefined' && mapInstance && feature.featureCollection) {
            const L = require('leaflet')
            const bounds = L.geoJSON(feature.featureCollection).getBounds()
            mapInstance.flyToBounds(bounds, {
                padding: [50, 50],
                maxZoom: 14,
                duration: 0.5,
            })
        }
    }

    const loadFeatureCollection = (feature: DiscoveredFeature, editMode: boolean) => {
        setFeatureCollection({
            ...feature.featureCollection,
            naddr: feature.naddr,
            name: feature.name || '',
            description: feature.description || '',
        })
        setIsEditing(editMode)
    }

    const createFeature = (geoJSON: Feature) => {
        if (!featureCollection) return null

        const newFeatureIndex = featureCollection.features.length

        const newFeature: Feature = {
            ...geoJSON,
            properties: {
                ...geoJSON.properties,
                id: uuidv4(),
                name: `Feature ${newFeatureIndex + 1}`,
                description: `Description for feature ${newFeatureIndex + 1}`,
                color: generateRandomColor(),
            },
        }

        setFeatureCollection((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                features: [...prev.features, newFeature],
            }
        })
        setUnsavedChanges(true)

        return newFeature
    }

    const editFeature = (id: string, updatedProperties: Partial<GeoJsonProperties>) => {
        setFeatureCollection((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                features: prev.features.map((feature) => {
                    if (feature.properties?.id === id) {
                        return {
                            ...feature,
                            properties: {
                                ...feature.properties,
                                ...updatedProperties,
                            },
                        }
                    }
                    return feature
                }),
            }
        })
        setUnsavedChanges(true)
    }

    const updateFeature = (updatedFeature: Feature) => {
        setFeatureCollection((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                features: prev.features.map((feature) =>
                    feature.properties?.id === updatedFeature.properties?.id ? updatedFeature : feature
                ),
            }
        })
        setUnsavedChanges(true)
    }

    const deleteFeature = (id: string) => {
        setFeatureCollection((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                features: prev.features.filter((feature) => feature.properties?.id !== id),
            }
        })
        setUnsavedChanges(true)
    }

    const updateCollectionMetadata = (metadata: Partial<Pick<ExtendedFeatureCollection, 'name' | 'description'>>) => {
        setFeatureCollection((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                ...metadata,
            }
        })
        setUnsavedChanges(true)
    }

    const publishFeatureEvent = async () => {
        if (!ndk || !featureCollection) return false

        console.log('publishing feature collection', featureCollection)

        try {
            await publishFeatureCollection(ndk, featureCollection)
            return true
        } catch (error) {
            console.error('Error publishing feature collection:', error)
            return false
        }
    }

    const saveChanges = async () => {
        if (!ndk || !featureCollection) return false

        try {
            await updateFeatureCollection(ndk, featureCollection)
            return true
        } catch (error) {
            console.error('Error updating feature collection:', error)
            return false
        }
    }

    const startEditing = () => {
        setIsEditing(true)
    }

    const stopEditing = () => {
        setIsEditing(false)
        setFeatureCollection(null)
        setUnsavedChanges(false)
    }

    return {
        featureCollection,
        createNewFeatureCollection,
        createFeature,
        updateFeature,
        deleteFeature,
        editFeature,
        updateCollectionMetadata,
        saveChanges,
        publishFeatureEvent,
        loadFeatureCollection,
        unsavedChanges,
        isEditing,
        startEditing,
        stopEditing,
        setMap,
        zoomToFeatureBounds,
    }
}
