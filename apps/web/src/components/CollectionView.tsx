import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { Button } from './ui/button'
import { getCollection } from '@/lib/api/collection'
import { ndkAtom } from '@/lib/store'

interface CollectionViewProps {
  collectionId: string
}

const CollectionView: React.FC<CollectionViewProps> = ({ collectionId }) => {
  const [ndk] = useAtom(ndkAtom)

  const {
    data: collection,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['collection', collectionId],
    queryFn: () => (ndk ? getCollection(ndk, collectionId) : Promise.reject('NDK not initialized')),
    enabled: !!ndk,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.toString()}</div>
  if (!collection) return <div>Collection not found</div>

  return (
    <div>
      <h2>{collection.name}</h2>
      <p>{collection.description}</p>
      <h3>Feature Collections:</h3>
      {collection.featureCollections.map((fc) => (
        <div key={fc.id}>
          <h4>{fc.name}</h4>
          <p>{fc.description}</p>
        </div>
      ))}
      <Button>Add Feature Collection</Button>
    </div>
  )
}

export default CollectionView
