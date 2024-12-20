'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb'

import { useNDK } from '@/lib/store/ndk'
import { useEffect } from 'react'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from './ui/separator'

const Header = () => {
    const { initialize } = useNDK()

    useEffect(() => {
        initialize().catch(console.error)
    }, [initialize])

    return (
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h3 className="text-xl font-bold">Earthly Land</h3>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage className="line-clamp-1">Project Management & Task Tracking</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </header>
    )
}

export default Header
