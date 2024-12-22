import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { NDKUser } from '@nostr-dev-kit/ndk'
import { ndkAtom } from '../lib/store'

interface UserInfoProps {
    pubkey: string
}

const UserInfo: React.FC<UserInfoProps> = ({ pubkey }) => {
    const ndk = useAtomValue(ndkAtom)

    const fetchUserInfo = async () => {
        if (!ndk) throw new Error('NDK not initialized')

        const user = ndk.getUser({ pubkey })
        await user.fetchProfile()
        return user
    }

    const {
        data: user,
        isLoading,
        error,
    } = useQuery<NDKUser, Error>({
        queryKey: ['userInfo', pubkey],
        queryFn: fetchUserInfo,
        enabled: !!ndk,
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>
    if (!user) return <div>No user data</div>

    return (
        <div className="flex items-center space-x-4">
            <img
                src={user.profile?.image || 'https://via.placeholder.com/50'}
                alt={user.profile?.name || 'User avatar'}
                className="w-12 h-12 rounded-full"
            />
            <div>
                <h3 className="font-bold">{user.profile?.name || 'Anonymous'}</h3>
                <p className="text-sm text-gray-500">{user.profile?.nip05 || 'No NIP-05'}</p>
            </div>
        </div>
    )
}

export default UserInfo
