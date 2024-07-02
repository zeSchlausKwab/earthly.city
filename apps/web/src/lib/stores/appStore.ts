import { writable } from 'svelte/store'

export const discoveryItems = writable([])
export const focusedCollections = writable([])
export const editingFeature = writable(null)
export const features = writable([])
export const drawnFeature = writable(null)
