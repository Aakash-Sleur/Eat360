import { Link } from "react-router-dom"

import { Button } from "../ui/button"
import { useUserContext } from "@/context/auth-store"
import CustomImage from "./custom-image";

const TopBar = () => {
    const { logoutUser, user } = useUserContext();
    return (
        <section className="topbar">
            <div className="px-5 py-2 flex-between">

                <Button variant="ghost" className="shad-button_ghost" onClick={logoutUser}>
                    <CustomImage src="/icons/logout.svg" alt="logout" />
                </Button>
                <Link to="/" className="flex items-center gap-3">
                    <CustomImage
                        src="/images/logo.png"
                        alt="logo"
                        className="h-20 w-28"
                    />
                </Link>
                <Link to={`/profile/${user._id}`} className="gap-3 flex-center">
                    <CustomImage
                        src={user.profilePicture || '/icons/profile-placeholder.svg'}
                        alt="profile-photo"
                        className="rounded-full size-14"
                    />
                </Link>
            </div>
        </section>
    )
}

export default TopBar
