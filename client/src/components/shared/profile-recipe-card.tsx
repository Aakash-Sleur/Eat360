import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/auth-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, EllipsisVertical, Trash, Share2, CheckCircle2, Clock, Circle } from "lucide-react";
import Loader from "../loader";
import { useRecipe } from "@/hooks/common-hooks/hooks";
import ShareButton from "../buttons/share-button";
import CustomImage from "./custom-image";
import { formatDistanceToNow, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { IRecipe } from "@/lib/types";

type ProfileRecipeCardProps = {
  recipe: IRecipe;
};

// --- Utility Components ---

function getScheduledLabel(scheduledAt?: string | Date | null) {
  if (!scheduledAt) return null;
  const date = typeof scheduledAt === "string" ? parseISO(scheduledAt) : scheduledAt;
  return `Scheduled ${formatDistanceToNow(date, { addSuffix: true })}`;
}

function StatusBadge({
  published,
  scheduledAt,
}: {
  published?: boolean;
  scheduledAt?: string | Date | null;
}) {
  if (published) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-green-500/20">
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
        <span>Published</span>
      </span>
    );
  }

  if (scheduledAt) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-500 ring-1 ring-yellow-500/20">
        <Clock className="h-3.5 w-3.5" aria-hidden />
        <span>{getScheduledLabel(scheduledAt)}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-gray-500/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-gray-400/20">
      <Circle className="h-3.5 w-3.5" aria-hidden />
      <span>Draft</span>
    </span>
  );
}

// --- Main Component ---

const ProfileRecipeCard = React.memo(({ recipe }: ProfileRecipeCardProps) => {
  const navigate = useNavigate();
  const {
    user: { _id: userId },
  } = useUserContext();
  const { isDeleting, deleteRecipe } = useRecipe(recipe._id);

  if (!recipe) return <Loader />;


  const handleEdit = () => navigate(`/update-recipe/${recipe._id}`);
  const handleDelete = () => deleteRecipe(recipe._id);
  const handleRedirect = () => {
    if (recipe.published || recipe.createdBy === userId) {
      navigate(`/recipes/${recipe._id}`);
    }
  }

  const isOwner = recipe.createdBy === userId;

  return (
    <li
      className={cn(
        "group relative list-none overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition",
        "hover:shadow-md focus-within:ring-2 focus-within:ring-ring"
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <CustomImage
          src={
            recipe.banner_image ||
            "/placeholder.svg?height=600&width=800&query=recipe%20image"
          }
          alt={recipe.title}
          className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent" />
      </div>

      {/* Owner menu */}
      {isOwner && (
        <div className="absolute right-2 top-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex items-center justify-center rounded-full bg-background/80 p-1.5 text-foreground shadow-sm ring-1 ring-border transition hover:bg-background"
              aria-label="Open recipe actions menu"
            >
              <EllipsisVertical className="h-4 w-4" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44 rounded-lg bg-popover p-2 text-popover-foreground">
              <DropdownMenuLabel className="px-2 text-xs text-muted-foreground">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEdit} className="gap-2">
                <Edit className="h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <ShareButton id={recipe._id} type="recipes">
                  <span className="inline-flex items-center gap-2">
                    <Share2 className="h-4 w-4" /> Share
                  </span>
                </ShareButton>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="gap-2 text-destructive focus:text-destructive"
              >
                <Trash className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Info overlay */}
      <div
        onClick={handleRedirect}
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 block rounded-b-xl p-3 transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
      >
        <div className="mx-1 rounded-lg bg-background/70 px-3 py-2 shadow-sm backdrop-blur-md">
          <h3
            className="text-pretty line-clamp-1 text-sm font-semibold md:text-base"
            title={recipe.title}
          >
            {recipe.title}
          </h3>
          <div className="mt-1">
            <StatusBadge
              published={recipe.published}
              scheduledAt={recipe.scheduledAt}
            />
          </div>
        </div>
        <span className="sr-only">View recipe details</span>
      </div>
    </li>
  );
});

export default ProfileRecipeCard;
