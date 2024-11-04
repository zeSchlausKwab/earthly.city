// src/lib/store/ndk.ts
import { useAtom } from 'jotai'
import { ndkAtom } from '../store'
import NDK, { NDKNip07Signer, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk'

export const useNDK = () => {
    const [ndk, setNDK] = useAtom(ndkAtom)

    const initialize = async () => {
        if (ndk) return

        const privateKeySigner = new NDKPrivateKeySigner('d762129bfd0d6a927efec9b34bb90abaa07dd85437b24d0251e73803ecdcbd4b')

        const signer = new NDKNip07Signer()
        const newNDK = new NDK({
            explicitRelayUrls: [
                'ws://localhost:3334',
                // 'wss://relay.earthly.land',
                // "wss://nostr-relay.wlvs.space",
                // "wss://relay.damus.io",
                // "wss://nostr-pub.wellorder.net",
                // "wss://relay.nostr.info",
                // "wss://nostr.bitcoiner.social",
                // "wss://nostr.onsats.org",
                // "wss://nostr.oxtr.dev",
                // "wss://nostr.fmt.wiz.biz",
                // "wss://nproxy.zerologin.com",
            ],
            signer: privateKeySigner,
        })

        await newNDK.connect()
        setNDK(newNDK)
    }

    return { ndk, initialize }
}
