import { atom } from 'jotai';

export const featuresAtom = atom<any[]>([]);
export const discoveryItemsAtom = atom<any[]>([]);
export const focusedCollectionsAtom = atom<any[]>([]);
export const editingFeatureAtom = atom<any | null>(null);