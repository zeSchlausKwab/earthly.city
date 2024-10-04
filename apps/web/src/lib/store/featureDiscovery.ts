// src/lib/store/featureDiscovery.ts
import { useAtom } from 'jotai'
import { discoveredFeaturesAtom, featuresErrorAtom, isLoadingFeaturesAtom, ndkAtom } from '../store'
import { subscribeToFeatures } from '../api/ndk'
import { DiscoveredFeature } from '../types'
import { useRef, useCallback, useEffect } from 'react'
import { handleError } from '../utils/errorHandler'

export const useFeatureDiscovery = () => {
  const [discoveredFeatures, setDiscoveredFeatures] = useAtom(discoveredFeaturesAtom)
  const [ndk] = useAtom(ndkAtom)
  const [, setIsLoadingFeatures] = useAtom(isLoadingFeaturesAtom)
  const [, setFeaturesError] = useAtom(featuresErrorAtom)
  const subscriptionRef = useRef<(() => void) | null>(null)

  const startSubscription = useCallback(() => {
    if (!ndk || subscriptionRef.current) return

    setIsLoadingFeatures(true)
    setFeaturesError(null)

    try {
      subscriptionRef.current = subscribeToFeatures(ndk, (newFeature: DiscoveredFeature) => {
        console.log('newFeature', newFeature)
        setDiscoveredFeatures((prev) => {
          if (!prev.some((f) => f.id === newFeature.id)) {
            return [...prev, newFeature]
          }
          return prev
        })
      })
      setIsLoadingFeatures(false)
    } catch (error) {
      handleError(error)
      setFeaturesError('Failed to start feature subscription')
      setIsLoadingFeatures(false)
    }
  }, [ndk, setDiscoveredFeatures, setIsLoadingFeatures, setFeaturesError])

  const stopSubscription = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current()
      subscriptionRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => stopSubscription()
  }, [stopSubscription])

  return {
    discoveredFeatures,
    startSubscription,
    stopSubscription,
  }
}
