import { useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import Loader from "../loader";
import { Button } from "../ui/button";
import { IRecipe } from "@/lib/types";
import { checkIfExist } from "@/lib/utils";
import ShareButton from "../buttons/share-button";
import { useUserContext } from "@/context/auth-store";
import {
  useGetUserById,
  useUpdateRecipe,
  useUpdateUser,
} from "@/lib/react-query/queries-and-mutations";
import { useToast } from "../ui/use-toast";
import CustomImage from "./custom-image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type StatsProps = {
  authorId: string;
  recipe: IRecipe;
};

type StatButtonProps = {
  onClick: () => void;
  iconSrc: string;
  altText: string;
  text: number | string;
  ariaLabel: string;
  isLast?: boolean;
  disabled?: boolean;
};

const StatButton = ({
  onClick,
  iconSrc,
  altText,
  text,
  ariaLabel,
  isLast,
  disabled,
}: StatButtonProps) => (
  <Button
    disabled={disabled}
    onClick={onClick}
    variant={"link"}
    className={`flex items-center space-x-1 ${
      !isLast && "border-r"
    } border-gray-400 rounded-none`}
    aria-label={ariaLabel}
  >
    <CustomImage
      src={iconSrc}
      alt={altText}
      className="w-4 h-4 md:w-8 md:h-8"
    />
    <span className="text-xs">{text}</span>
  </Button>
);

const Stats = ({ authorId, recipe }: StatsProps) => {
  const { data: author, isLoading: authorLoading } = useGetUserById(authorId);
  const { mutateAsync: updateUser, isPending: isUpdatePending } =
    useUpdateUser();
  const { user, checkAuthUser } = useUserContext();
  const { mutateAsync: updateRecipe, isPending: isUpdateRecipePending } =
    useUpdateRecipe();
  const navigate = useNavigate();
  const toast = useToast();
  const savedRecipesIds = user.savedRecipes.map((recipe) => recipe._id);

  const isLiked = useMemo(
    () => checkIfExist(recipe.likedBy, user._id),
    [recipe.likedBy, user._id]
  );
  const isSaved = useMemo(
    () => checkIfExist(savedRecipesIds, recipe._id),
    [user.savedRecipes, recipe._id]
  );

  const handleSaveRecipe = useCallback(async () => {
    const updatedSavedRecipes = isSaved
      ? savedRecipesIds.filter((id) => id !== recipe._id)
      : [...savedRecipesIds, recipe._id];

    await updateUser({ id: user._id, savedRecipes: updatedSavedRecipes });

    toast.toast({ title: isSaved ? "Recipe Unsaved" : "Recipe Saved" });
    checkAuthUser();
  }, [
    isSaved,
    user._id,
    user.savedRecipes,
    recipe._id,
    updateUser,
    toast,
    checkAuthUser,
  ]);

  const handleLike = useCallback(async () => {
    const newLikedList = isLiked
      ? recipe.likedBy.filter((id) => id !== user._id)
      : [...recipe.likedBy, user._id];
    const newLikes = isLiked ? recipe.likes - 1 : recipe.likes + 1;

    try {
      await updateRecipe({
        _id: recipe._id,
        likes: newLikes,
        likedBy: newLikedList,
      });
    } catch (error) {
      console.error(error);
    }
  }, [
    isLiked,
    recipe._id,
    recipe.likes,
    recipe.likedBy,
    user._id,
    updateRecipe,
  ]);

  useEffect(() => {
    if (!checkIfExist(recipe.viewedBy, user._id)) {
      updateRecipe({
        _id: recipe._id,
        views: recipe.views + 1,
        viewedBy: [...recipe.viewedBy, user._id],
      }).catch(console.error);
    }
  }, [user._id, updateRecipe, recipe]);

  if (authorLoading || !author) return <Loader />;

  return (
    <section>
      <div className="flex items-center p-4 my-4 bg-gray-100 rounded-md shadow-md gap-x-3">
        <Avatar>
          <AvatarImage
            src={
              author.profilePicture || "/assets/icons/profile-placeholder.svg"
            }
            alt={author.name}
          />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>{" "}
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
          onClick={() => {}}
          disabled={isUpdatePending || isUpdateRecipePending}
        />
        <StatButton
          onClick={handleLike}
          iconSrc={isLiked ? "/icons/liked.svg" : "/icons/like.svg"}
          altText={isLiked ? "Liked icon" : "Like icon"}
          text={recipe.likes}
          ariaLabel="Number of likes"
          disabled={isUpdatePending || isUpdateRecipePending}
        />
        <ShareButton id={recipe._id} type="recipes">
          {""}
        </ShareButton>
        <StatButton
          iconSrc="/icons/printer.svg"
          altText="Print icon"
          text=""
          ariaLabel="Print this recipe"
          onClick={() => navigate(`/print/${recipe._id}`)}
          disabled={
            recipe.isPremium &&
            recipe.createdBy !== user._id &&
            !checkIfExist(recipe.boughtBy, user._id)
          }
        />
        <StatButton
          iconSrc={isSaved ? "/icons/saved.svg" : "/icons/save.svg"}
          altText="Save icon"
          text=""
          ariaLabel="Save this recipe"
          onClick={handleSaveRecipe}
          isLast
          disabled={isUpdatePending || isUpdateRecipePending}
        />
      </div>
    </section>
  );
};

export default Stats;
