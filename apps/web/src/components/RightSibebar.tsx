'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { useFeatureCollection } from '@/lib/store/featureCollection'
import { Feature } from 'geojson'
import React, { useState } from 'react'
import GeometryEditor from './geometry-editors/GeometryEditor'
import { PlateEditor } from './PlateEditor'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useToast } from './ui/use-toast'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInput,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
    useSidebar,
} from '@/components/ui/sidebar'
import CollectionForm from './CollectionForm'
import CollectionView from './CollectionView'
import { Plus } from 'lucide-react'
import { Calendars } from './calendars'
import { DatePicker } from './date-picker'
import { NavUser } from './nav-user'

const RightSidebar: React.FC = () => {
    const {
        featureCollection,
        updateFeature,
        createNewFeatureCollection,
        updateCollectionMetadata,
        saveChanges,
        publishFeatureEvent,
        unsavedChanges,
        isEditing,
        startEditing,
        stopEditing,
    } = useFeatureCollection()
    const { toast } = useToast()

    const [showCollectionForm, setShowCollectionForm] = useState(false)
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null)

    const handleCreateNew = (type: string) => {
        if (type === 'feature') {
            createNewFeatureCollection()
        } else if (type === 'collection') {
            setShowCollectionForm(true)
        }
    }

    const handleFeatureChange = (updatedFeature: Feature) => {
        if (isEditing) {
            updateFeature(updatedFeature)
        }
    }

    const handleCollectionMetadataChange = (key: 'name' | 'description', value: string) => {
        if (isEditing) {
            updateCollectionMetadata({ [key]: value })
        }
    }

    const handleSaveChanges = async () => {
        let success = false

        if (featureCollection?.naddr) {
            success = await saveChanges()
        } else {
            success = await publishFeatureEvent()
        }

        if (success) {
            toast({
                title: 'Changes saved',
                description: 'Your feature collection has been updated successfully.',
            })
            stopEditing()
        } else {
            toast({
                title: 'Error saving changes',
                description: 'There was a problem saving your changes. Please try again.',
                variant: 'destructive',
            })
        }
    }

    const renderCreateNew = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>Create New</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Create New</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleCreateNew('feature')}>Feature Collection</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCreateNew('collection')}>Collection of Feature Collections</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )

    const renderFeatureCollection = () => (
        <div>
            <h2 className="text-xl font-bold mb-4">Feature Collection</h2>
            {isEditing ? (
                <div>
                    <div className="mb-4">
                        <Label htmlFor="collection-name">Collection Name</Label>
                        <Input
                            id="collection-name"
                            value={featureCollection?.name || ''}
                            onChange={(e) => handleCollectionMetadataChange('name', e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="collection-description">Collection Description</Label>
                        <PlateEditor
                            onChange={(value) => handleCollectionMetadataChange('description', value)}
                            readOnly={!isEditing}
                            initialValue={featureCollection?.description || ''}
                        />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Features</h3>
                    {featureCollection?.features.map((feature) => (
                        <GeometryEditor key={feature.properties?.id} feature={feature} mode="edit" onChange={handleFeatureChange} />
                    ))}
                    <Button onClick={handleSaveChanges} disabled={!unsavedChanges} className="mt-4 mr-2">
                        Save Changes
                    </Button>
                    <Button onClick={stopEditing} variant="outline" className="mt-4">
                        Cancel
                    </Button>
                </div>
            ) : (
                <div>
                    <p>Name: {featureCollection?.name}</p>
                    <p>Description: {featureCollection?.description}</p>
                    <p>Features: {featureCollection?.features.length}</p>
                    {featureCollection?.features.map((feature) => (
                        <GeometryEditor key={feature.properties?.id} feature={feature} mode="view" onChange={handleFeatureChange} />
                    ))}
                    <Button onClick={startEditing} className="mt-4">
                        Edit Collection
                    </Button>
                </div>
            )}
        </div>
    )

    return (
        <Sidebar collapsible="none" className="w-1/5 sticky hidden lg:flex top-0 h-svh border-l">
            <SidebarHeader className="h-16 border-b border-sidebar-border">
                <NavUser user={{ name: 'John Doe', email: 'john.doe@example.com', avatar: 'https://github.com/shadcn.png' }} />
            </SidebarHeader>
            <SidebarContent className="p-4">
                {!featureCollection && !showCollectionForm && !selectedCollection && renderCreateNew()}
                {showCollectionForm && (
                    <CollectionForm
                        onSubmit={(collectionId) => {
                            setShowCollectionForm(false)
                            setSelectedCollection(collectionId)
                        }}
                    />
                )}
                {selectedCollection && <CollectionView collectionId={selectedCollection} />}
                <SidebarSeparator className="mx-0" />
                {featureCollection && renderFeatureCollection()}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Plus />
                            <span>New Calendar</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

export default RightSidebar
