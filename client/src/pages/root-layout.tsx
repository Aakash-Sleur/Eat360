'use client'

import { Outlet } from 'react-router-dom'
import TopBar from '@/components/shared/top-bar'
import RightSidebar from '@/components/shared/right-sidebar'
import FooterComponent from '@/components/shared/footer-component'
import LeftSidebar from '@/components/shared/left-sidebar'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

const RootLayout = () => {
    return (
        <SidebarProvider>
            <div className="flex flex-col w-full min-h-screen bg-orange-50/50 md:flex-row">
                {/* Mobile Top Bar - Only visible on mobile */}
                <div className="block md:hidden">
                    <TopBar />
                </div>

                {/* Left Sidebar */}
                <LeftSidebar />

                {/* Main Content Area */}
                <main className="flex flex-col flex-1 overflow-hidden">
                    {/* Desktop Top Bar - Only visible on desktop */}
                    <div className="items-center hidden h-16 px-4 border-b md:flex border-orange-200/80">
                        <SidebarTrigger>
                            <Button variant="ghost" size="icon" className="mr-2">
                                <Menu className="w-6 h-6" />
                                <span className="sr-only">Toggle sidebar</span>
                            </Button>
                        </SidebarTrigger>
                        <TopBar />
                    </div>

                    {/* Content Area with Outlet */}
                    <div className="flex flex-1 overflow-hidden">
                        <div className="flex-1 px-4 py-6 overflow-y-auto">
                            <Outlet />
                        </div>

                        {/* Right Sidebar - Only visible on larger screens */}
                        <div className="hidden lg:block">
                            <RightSidebar />
                        </div>
                    </div>

                    {/* Footer */}
                    <FooterComponent />
                </main>
            </div>
        </SidebarProvider>
    )
}

export default RootLayout