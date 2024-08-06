import { useState } from "react";

import { Button } from "../ui/button"
import { IUser } from "@/lib/types";
import { checkIfExist } from "@/lib/utils";
import { useUserContext } from "@/context/auth-store"
import { useUpdateFollowers } from "@/lib/react-query/queries-and-mutations";

interface FollowButtonInterface {
    userInView: IUser;
}

const FollowButton = ({ userInView }: FollowButtonInterface) => {
    const { user: currentUser } = useUserContext();
    const [isFollowing, setIsFollowing] = useState(checkIfExist(userInView.followers, currentUser._id));

    const { mutateAsync: updateFollowers } = useUpdateFollowers();

    const onClick = async () => {
        if (isFollowing) {
            await updateFollowers({
                currentUserId: currentUser._id,
                otherUserId: userInView._id,
                followersList: userInView.followers.filter(id => id !== currentUser._id),
                followingList: currentUser.following.filter(id => id !== userInView._id)
            })
            setIsFollowing(false);
        } else {
            await updateFollowers({
                currentUserId: currentUser._id,
                otherUserId: userInView._id,
                followersList: [...userInView.followers, currentUser._id],
                followingList: [...currentUser.following, userInView._id]
            })
            setIsFollowing(true);
        }
    }


    return (
        <Button
            type="button"
            className="h-12 bg-[#fa8117]/90 px-8"
            onClick={onClick}
        >
            {isFollowing ? "Unfollow" : "Follow"}
        </Button>
    )
}

export default FollowButton
