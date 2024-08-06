import {
    Link,
    Outlet,
    Route,
    Routes,
    useLocation,
    useParams
} from "react-router-dom";

import FollowButton from "@/components/buttons/follow-button";
import Loader from "@/components/loader";
import GridList from "@/components/shared/grid-recipelist";
import PostCard from "@/components/shared/post-card";
import UserRecipeGrid from "@/components/shared/user-recipe-grid";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/auth-store";
import { useGetFollowersAndFollowing, useGetUserById } from "@/lib/react-query/queries-and-mutations";
import { useSocialNexusModal } from "@/hooks/modal-hooks";

interface StatBlockProps {
    value: string | number;
    label: string;
    onClickAction?: React.MouseEventHandler<HTMLButtonElement>;
}

const StatBlock = ({ value, label, onClickAction }: StatBlockProps) => (
    <Button type="button" className="gap-2 cursor-pointer flex-center" onClick={onClickAction}>
        <p className="small-semibold lg:body-bold text-dark-2">{value}</p>
        <p className="small-medium lg:body-medium text-dark-2 hover:text-gray-400">{label}</p>
    </Button>
)

const ProfilePage = () => {
    const { userId } = useParams<Record<string, string | undefined>>();
    const { user: currentUser } = useUserContext();
    const { data: userInView } = useGetUserById(userId || "");
    const { onOpen, updateModalData } = useSocialNexusModal()
    const { data: socialDetails } = useGetFollowersAndFollowing(userId || "");


    const { pathname } = useLocation();


    if (!userInView) {
        return <Loader />;
    }


    const onFollowClick = (type: "following" | "followers") => {
        const data = (type === "followers") ? socialDetails?.followers : socialDetails?.following;
        updateModalData({ data: data || [] })
        onOpen(type);
    }


    return (
        <div className="profile-container">
            <div className="profile-inner_container">
                <div className="flex flex-col flex-1 p-4 xl:flex-row max-xl:items-center gap-7 bg-light-2/50">
                    <img
                        src={userInView.profilePicture || "/icons/profile-placeholder.svg"}
                        alt="profile-picture"
                        className="rounded-full size-28 lg:size-36"
                    />
                    <div className="flex flex-col justify-between flex-1 md:mt-2">
                        <div className="flex flex-col justify-center w-full">
                            <h1 className="w-full text-center xl:text-left h3-bold md:h1-semibold">
                                {userInView.name}
                            </h1>
                            <p className="text-center small-regular md:body-medium text-dark-1 xl:text-left">
                                @{userInView.username}
                            </p>
                        </div>

                        <div className="z-20 flex flex-wrap items-center justify-center gap-5 mt-10 xl:justify-start">
                            <StatBlock
                                value={userInView.followers?.length || 0}
                                label="Followers"
                                onClickAction={() => onFollowClick("followers")}
                            />
                            <StatBlock
                                value={userInView.following?.length || 0}
                                label="Following"
                                onClickAction={() => onFollowClick("following")}
                            />
                        </div>

                        <p className="max-w-screen-sm text-center small-medium md:base-medium xl:text-left my-7">
                            {userInView.bio}
                        </p>
                    </div>
                    <div className="flex justify-center gap-4 mb-7">
                        <div className={`${userInView._id !== currentUser?._id ? "hidden" : ""}`}>
                            <Link
                                to={`/update-profile/${userInView._id}`}
                                className={`h-12 bg-[#fa8117]/90 px-5 text-light-1 flex-center gap-2 rounded-lg ${userInView._id !== currentUser._id && "hidden"
                                    }`}>
                                <img
                                    src={"/icons/edit.svg"}
                                    alt="edit"
                                    width={20}
                                    height={20}
                                    className="invert-white"
                                />
                                <p className="flex text-white whitespace-nowrap small-medium">
                                    Edit Profile
                                </p>
                            </Link>
                        </div>
                        <div className={`${userInView._id === currentUser?._id ? "hidden" : ""}`}>
                            <FollowButton userInView={userInView} />
                        </div>
                    </div>

                </div>
            </div>
            <div className="flex justify-center w-full max-w-6xl">
                <Link
                    to={`/profile/${userId}`}
                    className={`profile-tab rounded-l-lg ${pathname === `/profile/${userId}` && "!bg-light-3 text-light-1"
                        }`}>
                    <img
                        src={"/icons/posts.svg"}
                        alt="posts"
                        width={20}
                        height={20}
                        className={`${pathname === `/profile/${userId}` && "invert-white"}`}
                    />
                    Recipe
                </Link>
                <Link
                    to={`/profile/${userId}/posts`}
                    className={`profile-tab rounded-r-lg ${pathname === `/profile/${userId}/posts` && "!bg-light-3"
                        }`}>
                    <img
                        src={"/icons/like.svg"}
                        alt="like"
                        width={20}
                        height={20}
                    />
                    Posts
                </Link>
                {
                    userInView._id === currentUser?._id && (
                        <Link
                            to={`/profile/${userId}/saved`}
                            className={`profile-tab rounded-r-lg ${pathname === `/profile/${userId}/saved` && "!bg-light-3"
                                }`}>
                            <img
                                src={"/icons/save.svg"}
                                alt="like"
                                width={20}
                                height={20}
                            />
                            Saved
                        </Link>
                    )
                }
            </div>

            <Routes>
                <Route index element={<UserRecipeGrid recipes={userInView.recipes} />} />
                <Route path="/posts" element={
                    <ul className="flex flex-col gap-4">
                        {
                            userInView.posts.map((post) => (
                                <li key={post._id}>
                                    <PostCard post={post} userDetails={userInView} />
                                </li>
                            ))
                        }
                    </ul>
                } />
                <Route path="/saved"
                    element={
                        userInView.savedRecipes.length !== 0
                            ? <GridList recipes={userInView.savedRecipes} />
                            : <p>Currently no saved Recipes</p>
                    }
                />
            </Routes>
            <Outlet />
        </div>
    )
};

export default ProfilePage;
