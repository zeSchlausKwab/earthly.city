import NDK, { NDKEvent, NDKFilter, NDKKind, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk'
import { v4 as uuidv4 } from 'uuid'
import { FeatureCollection } from './schema'
import { DiscoveredFeature } from './types'

export interface PublishFeatureOptions {
    longformNote?: {
        title?: string
        content: string
        images?: string[]
    }
}

export const subscribeToFeatures = (ndk: NDK, callback: (feature: DiscoveredFeature) => void) => {
    const filter: NDKFilter = { kinds: [37515 as NDKKind] }
    const subscription = ndk.subscribe(filter, { closeOnEose: false })

    subscription.on('event', (event: NDKEvent) => {
        try {
            const content = JSON.parse(event.content)
            if (content.type === 'FeatureCollection') {
                const newFeature: DiscoveredFeature = {
                    id: event.id,
                    pubkey: event.pubkey,
                    naddr: 'event.naddr',
                    createdAt: event.created_at ?? 0,
                    featureCollection: content,
                    name: event.tagValue('name'),
                    description: event.tagValue('description'),
                }
                callback(newFeature)
            }
        } catch (error) {
            console.error('Error parsing feature event:', error)
        }
    })

    return () => {
        subscription.stop()
    }
}

export const publishFeatureCollection = async (
    ndk: NDK,
    featureCollection: FeatureCollection,
    options?: PublishFeatureOptions
): Promise<NDKEvent | null> => {
    let longformEvent: NDKEvent | null = null
    const now = Math.floor(Date.now() / 1000)

    if (options?.longformNote) {
        longformEvent = new NDKEvent(ndk)
        longformEvent.kind = 30023
        longformEvent.content = options.longformNote.content
        longformEvent.tags = [
            ['d', uuidv4() || 'default'],
            ['title', options.longformNote.title || 'Unnamed Collection'],
            ['published_at', now.toString()],
        ]

        options.longformNote.images?.forEach((img) => {
            longformEvent?.tags.push(['image', img])
        })

        try {
            await longformEvent.publish()
        } catch (error) {
            console.error('Error publishing longform note:', error)
            return null
        }
    }

    const event = new NDKEvent(ndk)
    event.kind = 37515
    event.content = JSON.stringify(featureCollection)
    event.created_at = now
    event.tags = [
        ['d', uuidv4()],
        ['name', options?.longformNote?.title || 'Unnamed Collection'],
        ['description', options?.longformNote?.content || ''],
        ['published_at', now.toString()],
    ]

    if (longformEvent) {
        event.tags.push(['e', longformEvent.id, 'longform'])
    }

    try {
        await event.publish()
        return event
    } catch (error) {
        console.error('Error publishing feature collection event:', error)
        return null
    }
}

export const updateFeatureCollection = async (ndk: NDK, featureCollection: FeatureCollection): Promise<NDKEvent | null> => {
    return publishFeatureCollection(ndk, featureCollection)
}
