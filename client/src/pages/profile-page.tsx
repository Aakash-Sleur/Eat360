import {
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  User,
  Users,
  ChefHat,
  BookOpen,
  Bookmark,
  Edit,
  MapPin,
  Calendar,
} from "lucide-react";

import FollowButton from "@/components/buttons/follow-button";
import Loader from "@/components/loader";
import GridList from "@/components/shared/grid-recipelist";
import PostCard from "@/components/shared/post-card";
import UserRecipeGrid from "@/components/shared/user-recipe-grid";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUserContext } from "@/context/auth-store";
import {
  useGetFollowersAndFollowing,
  useGetUserById,
  useGetUserRecipes,
} from "@/lib/react-query/queries-and-mutations";
import { useSocialNexusModal } from "@/hooks/modal-hooks";
import { cn } from "@/lib/utils";

interface StatBlockProps {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  isClickable?: boolean;
}

const StatBlock = ({
  value,
  label,
  icon,
  onClick,
  isClickable = true,
}: StatBlockProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={!isClickable}
    className={cn(
      "flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-gray-200 transition-all min-w-[100px]",
      isClickable &&
        "hover:shadow-md hover:border-green-300 cursor-pointer active:scale-95",
      !isClickable && "cursor-default"
    )}
  >
    <div className="flex items-center gap-2 text-gray-600">
      {icon}
    </div>
    <div className="flex flex-col items-center">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 font-medium">{label}</p>
    </div>
  </button>
);

const EmptyState = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => (
  <Card className="w-full mt-8">
    <CardContent className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-full bg-gray-100 p-6 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md">{description}</p>
    </CardContent>
  </Card>
);

const ProfilePage = () => {
  const { userId } = useParams<Record<string, string | undefined>>();
  const { user: currentUser } = useUserContext();
  const { data: userInView } = useGetUserById(userId || "");
  const { onOpen, updateModalData } = useSocialNexusModal();
  const { data: socialDetails } = useGetFollowersAndFollowing(userId || "");
  const { data: recipes, isLoading: isRecipesLoading } = useGetUserRecipes(
    userId || ""
  );

  const { pathname } = useLocation();
  const isOwnProfile = userInView?._id === currentUser?._id;

  const getCurrentTab = () => {
    if (pathname === `/profile/${userId}`) return "recipes";
    if (pathname === `/profile/${userId}/posts`) return "posts";
    if (pathname === `/profile/${userId}/saved`) return "saved";
    return "recipes";
  };

  const onFollowClick = (type: "following" | "followers") => {
    const data =
      type === "followers"
        ? socialDetails?.followers
        : socialDetails?.following;
    updateModalData({ data: data || [] });
    onOpen(type);
  };

  if (!userInView || isRecipesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Cover Image Section */}
<div className="w-full h-48 bg-gradient-to-r from-emerald-400 via-lime-300 to-orange-200 relative">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto z-[99] px-4 -mt-1 pb-8">
        {/* Profile Header Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="relative flex-shrink-0 -mt-4 md:-mt-4">
                <Avatar className="h-32 w-32 md:h-40 md:w-40 ring-4 ring-white shadow-xl">
                  <AvatarImage
                    src={
                      userInView.profilePicture ||
                      "/icons/profile-placeholder.svg"
                    }
                    alt={userInView.name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-green-400 to-emerald-600 text-white text-4xl font-bold">
                    {userInView.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-600 hover:bg-green-700">
                    You
                  </Badge>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                      {userInView.name}
                    </h1>
                    <p className="text-gray-600 text-lg mb-3">
                      @{userInView.username}
                    </p>
                    {userInView.bio && (
                      <p className="text-gray-700 max-w-2xl leading-relaxed">
                        {userInView.bio}
                      </p>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    {isOwnProfile ? (
                      <Button
                        asChild
                        size="lg"
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md"
                      >
                        <Link to={`/update-profile/${userInView._id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Link>
                      </Button>
                    ) : (
                      <FollowButton userInView={userInView} />
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <StatBlock
                    value={userInView.recipes?.length || 0}
                    label="Recipes"
                    icon={<ChefHat className="h-5 w-5" />}
                    isClickable={false}
                  />
                  <StatBlock
                    value={userInView.followers?.length || 0}
                    label="Followers"
                    icon={<Users className="h-5 w-5" />}
                    onClick={() => onFollowClick("followers")}
                  />
                  <StatBlock
                    value={userInView.following?.length || 0}
                    label="Following"
                    icon={<User className="h-5 w-5" />}
                    onClick={() => onFollowClick("following")}
                  />
                  <StatBlock
                    value={userInView.posts?.length || 0}
                    label="Posts"
                    icon={<BookOpen className="h-5 w-5" />}
                    isClickable={false}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue={getCurrentTab()} className="mt-6">
          <TabsList className="w-full justify-start bg-white border border-gray-200 p-1 h-auto rounded-xl shadow-sm">
            <TabsTrigger
              value="recipes"
              asChild
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 rounded-lg px-6 py-3"
            >
              <Link
                to={`/profile/${userId}`}
                className="flex items-center gap-2"
              >
                <ChefHat className="h-4 w-4" />
                <span className="font-semibold">Recipes</span>
                <Badge variant="secondary" className="ml-1">
                  {userInView.recipes?.length || 0}
                </Badge>
              </Link>
            </TabsTrigger>

            <TabsTrigger
              value="posts"
              asChild
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 rounded-lg px-6 py-3"
            >
              <Link
                to={`/profile/${userId}/posts`}
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                <span className="font-semibold">Posts</span>
                <Badge variant="secondary" className="ml-1">
                  {userInView.posts?.length || 0}
                </Badge>
              </Link>
            </TabsTrigger>

            {isOwnProfile && (
              <TabsTrigger
                value="saved"
                asChild
                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 rounded-lg px-6 py-3"
              >
                <Link
                  to={`/profile/${userId}/saved`}
                  className="flex items-center gap-2"
                >
                  <Bookmark className="h-4 w-4" />
                  <span className="font-semibold">Saved</span>
                  <Badge variant="secondary" className="ml-1">
                    {userInView.savedRecipes?.length || 0}
                  </Badge>
                </Link>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Tab Content */}
          <div className="mt-6">
            <Routes>
              <Route
                index
                element={
                  userInView.recipes.length === 0 ? (
                    <EmptyState
                      icon={<ChefHat className="h-12 w-12 text-gray-400" />}
                      title="No recipes yet"
                      description={
                        isOwnProfile
                          ? "Start sharing your culinary creations with the world!"
                          : `${userInView.name} hasn't shared any recipes yet.`
                      }
                    />
                  ) : (
                    <UserRecipeGrid
                      recipes={Array.isArray(recipes) ? recipes : []}
                    />
                  )
                }
              />
              <Route
                path="/posts"
                element={
                  userInView.posts.length === 0 || !userInView.posts ? (
                    <EmptyState
                      icon={<BookOpen className="h-12 w-12 text-gray-400" />}
                      title="No posts yet"
                      description={
                        isOwnProfile
                          ? "Share your thoughts and cooking experiences!"
                          : `${userInView.name} hasn't posted anything yet.`
                      }
                    />
                  ) : (
                    <div className="space-y-4">
                      {userInView.posts.map((post) => (
                        <PostCard
                          key={post._id}
                          post={post}
                          userDetails={userInView}
                        />
                      ))}
                    </div>
                  )
                }
              />
              <Route
                path="/saved"
                element={
                  userInView.savedRecipes.length !== 0 ? (
                    <GridList recipes={userInView.savedRecipes} />
                  ) : (
                    <EmptyState
                      icon={<Bookmark className="h-12 w-12 text-gray-400" />}
                      title="No saved recipes"
                      description="Recipes you save will appear here for easy access."
                    />
                  )
                }
              />
            </Routes>
          </div>
        </Tabs>
      </div>

      <Outlet />
    </div>
  );
};

export default ProfilePage;