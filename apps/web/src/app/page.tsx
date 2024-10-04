'use client'

import DiscoverySidebar from '@/components/DiscoverySidebar'
import Header from '@/components/Header'
import MapWrapper from '@/components/map/MapWrapper'
import { TooltipProvider } from '@/components/plate-ui/tooltip'
import RightSidebar from '@/components/RightSibebar'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function Home() {
  return (
    <div className="h-full">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1 overflow-hidden">
              <aside className="w-1/4 p-4">
                <DiscoverySidebar />
              </aside>
              <main className="flex-1 p-4">
                <MapWrapper />
              </main>
              <aside className="w-1/4 p-4">
                <RightSidebar />
              </aside>
            </div>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  )
}
