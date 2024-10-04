// src/lib/store/ndk.ts
import { useAtom } from 'jotai'
import { ndkAtom } from '../store'
import NDK, { NDKNip07Signer, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk'

export const useNDK = () => {
  const [ndk, setNDK] = useAtom(ndkAtom)

  const initialize = async () => {
    if (ndk) return

    const privateKeySigner = new NDKPrivateKeySigner('beb8f6777d4379ac60b01d91fa84456bb23a2ef6b083f557b9ede311ae1ede53')

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
