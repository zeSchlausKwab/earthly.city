// lib/store/ndk-store.ts
import NDK, { NDKNip07Signer } from '@nostr-dev-kit/ndk';

class NDKStore {
    private ndk: NDK | null = null;

    async initialize() {
        // Initialize with a NIP-07 signer (browser extension)
        const signer = new NDKNip07Signer();

        this.ndk = new NDK({
            explicitRelayUrls: [
                'wss://relay.earthly.land',
                // 'wss://relay.damus.io',
                // 'wss://relay.nostr.band',
                // 'wss://nos.lol',
            ],
            signer
        });

        await this.ndk.connect();
    }

    getNDK() {
        if (!this.ndk) {
            throw new Error('NDK not initialized');
        }
        return this.ndk;
    }
}

export const ndkStore = new NDKStore();