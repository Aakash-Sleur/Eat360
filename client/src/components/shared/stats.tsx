import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Loader from "../loader";
import { Button } from "../ui/button";
import { IRecipe } from "@/lib/types";
import { checkIfExist } from "@/lib/utils";
import ShareButton from "../buttons/share-button";
import { useUserContext } from "@/context/auth-store";
import { useGetUserById, useUpdateRecipe, useUpdateUser } from "@/lib/react-query/queries-and-mutations";
import { useToast } from "../ui/use-toast";
import CustomImage from "./custom-image";

type StatsProps = {
    authorId: string;
    recipe: IRecipe;
}

type StatButtonProps = {
    onClick: () => void;
    iconSrc: string;
    altText: string;
    text: number | string;
    ariaLabel: string;
    isLiked?: boolean;
    isLast?: boolean;
    isPremium?: boolean;
}

const StatButton = ({ onClick, iconSrc, altText, text, ariaLabel, isLast, isPremium }: StatButtonProps) => (
    <Button disabled={isPremium || false} onClick={onClick} className={`flex items-center space-x-1 ${!isLast && "border-r"} border-gray-400 rounded-none`} aria-label={ariaLabel}>
        <CustomImage src={iconSrc} alt={altText} className="w-4 h-4 md:w-8 md:h-8" />
        <span className="text-xs">{text}</span>
    </Button>
);

const Stats = ({ authorId, recipe }: StatsProps) => {
    const { data: author } = useGetUserById(authorId);
    const { mutateAsync: updateUser } = useUpdateUser()
    const { user, checkAuthUser } = useUserContext();
    const [isLiked, setIsLiked] = useState(checkIfExist(recipe.likedBy, user._id));
    const savedRecipeIds = user.savedRecipes.map(recipe => recipe._id)

    const [save, setSave] = useState(checkIfExist(savedRecipeIds, recipe._id))
    const { mutateAsync: updateRecipe } = useUpdateRecipe();
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const updateRecipeViews = async () => {
            if (!checkIfExist(recipe.viewedBy, user._id) && recipe) {
                try {
                    await updateRecipe({
                        _id: recipe._id,
                        views: recipe.views + 1,
                        viewedBy: [...recipe.viewedBy, user._id]
                    });
                } catch (error) {
                    console.error(error)
                }
            }
        }

        updateRecipeViews();
    }, [user._id, updateRecipe, recipe.viewedBy]);

    if (!author) {
        return <Loader />;
    }

    const handleSaveRecipe = async () => {
        if (!save) {
            await updateUser({
                id: user._id,
                savedRecipes: [...savedRecipeIds, recipe._id]
            });
            toast.toast({
                title: 'Recipe Saved'
            })
        } else {
            await updateUser({
                id: user._id,
                savedRecipes: savedRecipeIds.filter(id => id !== recipe._id)
            });
            toast.toast({
                title: 'Recipe Unsaved'
            })
        }
        setSave(!save);
        checkAuthUser();
    }

    const handleLike = async () => {
        const newLikedList = isLiked
            ? recipe.likedBy.filter(id => id !== user._id)
            : [...recipe.likedBy, user._id];
        const newLikes = isLiked ? recipe.likes - 1 : recipe.likes + 1;

        try {
            await updateRecipe({
                _id: recipe._id,
                likes: newLikes,
                likedBy: newLikedList
            });
            setIsLiked(!isLiked);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section>
            <div className="flex items-center p-4 my-4 bg-gray-100 rounded-md shadow-md gap-x-3">
                <img src={author.profilePicture} alt="Profile picture" className="w-16 h-16 border-2 border-gray-300 rounded-full" />
                <div className="flex flex-col">
                    <Link to={`/profile/${authorId}`}>
                        <p className="text-xl font-bold">{author.name}</p>
                    </Link>
                    <p className="text-sm text-gray-500">Recipe Author</p>
                </div>
            </div>

            <div className="grid w-full grid-cols-5 p-3 text-gray-700 bg-green-100 rounded-md md:w-fit gap-x-1 md:gap-x-6">
                <StatButton
                    iconSrc="/icons/eye.svg"
                    altText="Views icon"
                    text={recipe.views}
                    ariaLabel="Number of views"
                    onClick={() => { }}
                />
                <StatButton
                    onClick={() => handleLike()}
                    iconSrc={isLiked ? "/icons/liked.svg" : "/icons/like.svg"}
                    altText={isLiked ? "Liked icon" : "Like icon"}
                    text={recipe.likes}
                    ariaLabel="Number of likes"
                    isLiked={isLiked}
                />
                <ShareButton id={recipe._id} type="recipes">
                    Share
                </ShareButton>
                <StatButton
                    iconSrc="/icons/printer.svg"
                    altText="Print icon"
                    text="Print"
                    ariaLabel="Print this recipe"
                    onClick={() => navigate(`/print/${recipe._id}`)}
                    isPremium={recipe.isPremium && recipe.createdBy !== user._id && !checkIfExist(recipe.boughtBy, user._id)}
                />
                <StatButton
                    iconSrc={save ? "/icons/saved.svg" : "/icons/save.svg"}
                    altText="Print icon"
                    text="Save"
                    ariaLabel="save this recipe"
                    onClick={() => handleSaveRecipe()}
                    isLast={true}
                />
            </div>
        </section>
    );
}

export default Stats;
