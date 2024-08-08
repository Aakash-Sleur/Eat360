import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { useUserContext } from "@/context/auth-store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Edit, EllipsisVertical, Trash } from "lucide-react";
import Loader from "../loader";
import { useRecipe } from "@/hooks/common-hooks/hooks";
import ShareButton from "../buttons/share-button";
import CustomImage from "./custom-image";

type ProfileRecipeCardProps = {
    recipeId: string;
};


const ProfileRecipeCard: React.FC<ProfileRecipeCardProps> = ({ recipeId }) => {
    const navigate = useNavigate();
    const { user: { _id: userId } } = useUserContext();
    const { recipe, isDeleting, deleteRecipe } = useRecipe(recipeId);


    if (!recipe) return <Loader />;
    if (!recipe.isPublic && recipe.createdBy !== userId) return <div className="hidden"></div>

    return (

        <li className="grid-post_link">
            {userId === recipe.createdBy && (
                <DropdownMenu>
                    <DropdownMenuTrigger className="absolute top-0 right-0 p-2 text-dark-1">
                        <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40 p-4 bg-light-1 rounded-xl">
                        <DropdownMenuLabel>Menu</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate(`/update-recipe/${recipe._id}`)}>
                            <Edit className="mr-2 cursor-pointer" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <ShareButton id={recipeId} type="recipes">
                                share
                            </ShareButton>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteRecipe(recipe._id)} disabled={isDeleting}>
                            <Trash className="mr-2 text-red-500 cursor-pointer" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
            <CustomImage src={recipe.banner_image} alt="recipe" className="object-cover w-full h-full" />
            <Link to={`/recipes/${recipe._id}`} className="p-2 grid-post_user bg-white/50">
                <p className="w-full text-center text-white hover:underline">{recipe.title}</p>
            </Link>
        </li>
    );
};

export default ProfileRecipeCard;
