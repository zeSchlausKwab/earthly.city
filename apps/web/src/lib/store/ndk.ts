import NDK, { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';

class NDKStore {
    private ndk: NDK;

    constructor() {
        this.ndk = new NDK({
            explicitRelayUrls: [
                'wss://purplepag.es',
                'wss://relay.nostr.band',
                'wss://nos.lol',
                'wss://bouncer.nostree.me',
                'wss://nostr.land/',
                'wss://purplerelay.com/',
            ],
        });
    }

    async connect(): Promise<void> {
        await this.ndk.connect();
    }

    getNDK(): NDK {
        return this.ndk;
    }

    async fetchEvents(filter: NDKFilter): Promise<NDKEvent[]> {
        const events = await this.ndk.fetchEvents(filter);
        return Array.from(events);
    }
}

export const ndkStore = new NDKStore();