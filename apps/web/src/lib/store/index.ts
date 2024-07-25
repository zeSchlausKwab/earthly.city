import { atom } from 'jotai';
import NDK from '@nostr-dev-kit/ndk';
import { FeatureCollection } from 'geojson';
import { DiscoveredFeature } from '../types';

export const ndkAtom = atom<NDK | null>(null);
export const userAtom = atom<{ pubkey: string } | null>(null);
export const featureCollectionAtom = atom<FeatureCollection | null>(null);
export const discoveredFeaturesAtom = atom<DiscoveredFeature[]>([]);

export const isLoadingNdkAtom = atom(false);
export const isLoadingFeaturesAtom = atom(false);
export const isLoadingFeatureCollectionAtom = atom(false);

export const ndkErrorAtom = atom<string | null>(null);
export const featuresErrorAtom = atom<string | null>(null);
export const featureCollectionErrorAtom = atom<string | null>(null);

export const discoveredCollectionsAtom = atom<Collection[]>([]);

export const isLoadingCollectionsAtom = atom(false);
export const collectionsErrorAtom = atom<string | null>(null);
