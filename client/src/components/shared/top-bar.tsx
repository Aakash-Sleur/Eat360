import { Link } from "react-router-dom"

import { Button } from "../ui/button"
import { useUserContext } from "@/context/auth-store"

const TopBar = () => {
    const { logoutUser, user } = useUserContext();
    return (
        <section className="topbar">
            <div className="px-5 py-2 flex-between">

                <Button variant="ghost" className="shad-button_ghost" onClick={logoutUser}>
                    <img src="/icons/logout.svg" alt="logout" />
                </Button>
                <Link to="/" className="flex items-center gap-3">
                    <img
                        src="/images/logo.png"
                        alt="logo"
                        width={130}
                        height={225}
                    />
                </Link>
                <Link to={`/profile/${user._id}`} className="gap-3 flex-center">
                    <img
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
