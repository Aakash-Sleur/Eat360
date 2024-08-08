import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

import { INavLink } from "@/lib/types";
import { sidebarLinks } from "@/constants";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/auth-store";
import CustomImage from "./custom-image";

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, logoutUser, isLoading } = useUserContext();

    const handleSignOut = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        logoutUser();
        navigate("sign-in");
    };

    return (
        <nav className="leftsidebar">
            <div className="flex flex-col gap-11">
                <Link to="/" className="bg-white shadow-sm shadow-orange-300 rounded-xl">
                    <CustomImage
                        src="/images/logo.png"
                        alt="logo"
                        width={120}
                        className="object-contain mx-auto"
                    />
                </Link>

                {isLoading || !user.email ? (
                    <div className="h-14">
                        <Loader />
                    </div>
                ) : (
                    <Link to={`profile/${user._id}`} className="flex items-center gap-3 p-4 shadow-sm shadow-orange-300 bg-light-1 rounded-2xl">
                        <CustomImage
                            src={user.profilePicture || "/icons/profile-placeholder.svg"}
                            alt="profile-image"
                            className="rounded-full h-14 w-14"
                        />
                        <div className="flex flex-col">
                            <p className="body-bold">
                                {user.name}
                            </p>
                            <p className="small-regular text-dark-2">
                                @{user.username}
                            </p>
                        </div>
                    </Link>
                )}

                <ul className="flex flex-col gap-6 p-4 shadow-sm shadow-orange-300 bg-light-1 rounded-2xl">
                    {sidebarLinks.map((link: INavLink) => {
                        const isActive = pathname === link.route || (link.route !== '/' && pathname.startsWith(link.route));
                        return (
                            <li
                                key={link.label}
                                className={`leftsidebar-link group ${isActive && "bg-[#fa8117]/80 text-white"}`}
                            >
                                <NavLink to={link.route} className="flex items-center gap-4 p-4">
                                    <CustomImage
                                        src={link.imgUrl}
                                        alt={link.label}
                                        className={`${isActive && "invert-white"}`}
                                    />
                                    {link.label}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <Button
                variant="ghost"
                className="mr-auto space-x-4"
                onClick={(e) => handleSignOut(e)}
            >
                <CustomImage src="/icons/logout.svg" alt="logout" />
                <p className="text-lg font-semibold text-rose-600">Logout</p>
            </Button>
        </nav>
    );
}

export default LeftSidebar;
