import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { Loader, ChevronDown, LogOut } from "lucide-react"

import { INavLink } from "@/lib/types"
import { sidebarLinks } from "@/constants"
import { Button } from "@/components/ui/button"
import { useUserContext } from "@/context/auth-store"
import CustomImage from "./custom-image"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const LeftSidebar = () => {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const { user, logoutUser, isLoading } = useUserContext()
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        logoutUser()
        navigate("sign-in")
    }
    return (
        <Sidebar className="hidden border-r border-orange-200/80 bg-gradient-to-b from-orange-100/50 to-orange-50/50 md:flex">
            <SidebarHeader className="p-4">
                <Link
                    to="/"
                    className="flex items-center justify-center p-2 space-x-2 transition-all duration-300 bg-white shadow-sm rounded-xl shadow-orange-200/80 hover:bg-orange-50 hover:shadow-md"
                >
                    <span className="text-xl font-bold text-center text-orange-600">Eat360</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <ScrollArea className="h-[calc(100vh-10rem)] px-4">
                    {isLoading || !user.email ? (
                        <div className="flex items-center justify-center h-14">
                            <Loader className="w-6 h-6 text-orange-500 animate-spin" />
                        </div>
                    ) : (
                        <Collapsible
                            open={isUserMenuOpen}
                            onOpenChange={setIsUserMenuOpen}
                            className="mb-6"
                        >
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 transition-all duration-300 bg-white shadow-sm rounded-xl shadow-orange-200/80 hover:bg-orange-50 hover:shadow-md">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="w-10 h-10 border-2 border-orange-200">
                                        <AvatarImage src={user.profilePicture} alt={user.name} />
                                        <AvatarFallback className="text-orange-600 bg-orange-200">{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">@{user.username}</p>
                                    </div>
                                </div>
                                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2 space-y-1 overflow-hidden bg-white rounded-lg shadow-inner">
                                <Link
                                    to={`profile/${user._id}`}
                                    className="flex items-center px-4 py-2 space-x-2 text-sm text-gray-700 transition-colors hover:bg-orange-100"
                                >
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={user.profilePicture} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span>View Profile</span>
                                </Link>
                            </CollapsibleContent>
                        </Collapsible>
                    )}
                    <nav className="space-y-1">
                        {sidebarLinks.map((link: INavLink) => {
                            const isActive =
                                pathname === link.route || (link.route !== "/" && pathname.startsWith(link.route))
                            return (
                                <NavLink
                                    key={link.label}
                                    to={link.route}
                                    className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${isActive
                                        ? "bg-orange-500 text-white shadow-md"
                                        : "text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                                        }`}
                                >
                                    <CustomImage
                                        src={link.imgUrl}
                                        alt={link.label}
                                        className={`h-5 w-5 ${isActive ? "invert brightness-0" : ""}`}
                                    />
                                    <span>{link.label}</span>
                                </NavLink>
                            )
                        })}
                    </nav>
                </ScrollArea>
            </SidebarContent>
            <SidebarFooter className="p-4 space-y-2">
                <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="justify-start w-full space-x-2 transition-all duration-300 bg-white rounded-lg shadow-sm text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:shadow-md"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-semibold">Logout</span>
                </Button>
            </SidebarFooter>
        </Sidebar>
    )
}

export default LeftSidebar