import { Outlet } from 'react-router-dom'

import TopBar from '@/components/shared/top-bar'
import RightSidebar from '@/components/shared/right-sidebar'
import FooterComponent from '@/components/shared/footer-component'
import LeftSidebar from '@/components/shared/left-sidebar'

const RootLayout = () => {
    return (
        <div className="w-full md:flex bg-custom">
            <TopBar />
            <LeftSidebar />

            <section className="relative z-50 flex flex-1 w-full h-full">
                <Outlet />
            </section>
            <RightSidebar />
            <FooterComponent />
        </div>
    )
}

export default RootLayout
