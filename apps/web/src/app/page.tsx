'use client'

import DiscoverySidebar from '@/components/DiscoverySidebar'
import Header from '@/components/Header'
import MapWrapper from '@/components/map/MapWrapper'
import { TooltipProvider } from '@/components/plate-ui/tooltip'
import RightSidebar from '@/components/RightSibebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CSSProperties } from 'react'

const queryClient = new QueryClient()

export default function Home() {
    return (
        <div className="h-full">
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <SidebarProvider
                        style={
                            {
                                '--sidebar-width': '20vw',
                            } as CSSProperties
                        }
                    >
                        <DiscoverySidebar />
                        <SidebarInset>
                            <Header />
                            <MapWrapper />
                        </SidebarInset>
                        <RightSidebar />
                    </SidebarProvider>
                </TooltipProvider>
            </QueryClientProvider>
        </div>
    )
}
