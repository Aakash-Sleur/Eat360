import { Link } from "react-router-dom";

import { IUser } from "@/lib/types";

const UserCard = ({ user }: {
    user: IUser
}) => {

    return (
        <Link to={`/profile/${user._id}`} className="user-card">
            <img
                src={user.profilePicture || "/icons/profile-placeholder.svg"}
                alt="creator"
                className="rounded-full w-14 h-14"
            />

            <div className="flex-col gap-1 flex-center">
                <p className="text-center base-medium text-dark-1 line-clamp-1">
                    {user.username}
                </p>
                <p className="text-center small-regular text-light-3 line-clamp-1">
                    @{user.username}
                </p>
            </div>
        </Link>
    )
}

export default UserCard
