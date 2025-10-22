import { useNavigate } from "react-router-dom";
import { Users, UserPlus, Search, X } from "lucide-react";
import { useState, useMemo } from "react";

import { Modal } from "../ui/modal";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSocialNexusModal } from "@/hooks/modal-hooks";
import { cn } from "@/lib/utils";
import { useUserContext } from "@/context/auth-store";

interface User {
  _id: string;
  name: string;
  username?: string;
  profilePicture?: string;
  bio?: string;
}

export const SocialNexusModal = () => {
  const { isOpen, onClose, type, data } = useSocialNexusModal();
  const { user: currentUser } = useUserContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const onClick = (userId: string) => {
    onClose();
    setSearchQuery(""); // Reset search when closing
    navigate(`/profile/${userId}`);
    navigate(0);
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    
    const query = searchQuery.toLowerCase();
    return data.filter(
      (user: User) =>
        user.name.toLowerCase().includes(query) ||
        user.username?.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="rounded-full bg-gray-100 p-6 mb-4">
        <Users className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No {type} yet
      </h3>
      <p className="text-sm text-gray-600 text-center max-w-xs">
        {type === "followers"
          ? "When people follow this profile, they'll appear here."
          : "This profile isn't following anyone yet."}
      </p>
    </div>
  );

  const NoResults = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="rounded-full bg-gray-100 p-6 mb-4">
        <Search className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No results found
      </h3>
      <p className="text-sm text-gray-600 text-center max-w-xs">
        Try searching with a different term
      </p>
    </div>
  );

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          {type === "followers" ? (
            <Users className="h-5 w-5" />
          ) : (
            <UserPlus className="h-5 w-5" />
          )}
          <span>{type === "followers" ? "Followers" : "Following"}</span>
          <Badge variant="secondary" className="ml-2">
            {data.length}
          </Badge>
        </div>
      }
      description=""
      isOpen={isOpen}
      onClose={handleClose}
      styles="max-h-[600px] flex flex-col"
    >
      <div className="flex flex-col h-full">
        {/* Search Bar */}
        {data.length > 0 && (
          <div className="px-6 py-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={`Search ${type}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* User List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {!data.length ? (
            <EmptyState />
          ) : filteredData.length === 0 ? (
            <NoResults />
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredData.map((user: User) => (
                <button
                  key={user._id}
                  onClick={() => onClick(user._id)}
                  className={cn(
                    "w-full p-4 hover:bg-gray-50 transition-colors text-left group",
                    "focus:outline-none focus:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm group-hover:ring-green-200 transition-all">
                      <AvatarImage
                        src={
                          user.profilePicture ||
                          "/icons/profile-placeholder.svg"
                        }
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-green-400 to-emerald-600 text-white font-semibold">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 truncate group-hover:text-green-600 transition-colors">
                          {user.name}
                        </p>
                        {user._id === currentUser?._id && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700 text-xs"
                          >
                            You
                          </Badge>
                        )}
                      </div>
                      {user.username && (
                        <p className="text-sm text-gray-600 truncate">
                          @{user.username}
                        </p>
                      )}
                      {user.bio && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {user.bio}
                        </p>
                      )}
                    </div>

                    {/* Action Indicator */}
                    <div className="flex-shrink-0 text-gray-400 group-hover:text-green-600 transition-colors">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {data.length > 0 && (
          <div className="px-6 py-3 border-t bg-gray-50">
            <p className="text-sm text-gray-600 text-center">
              {filteredData.length === data.length ? (
                <>
                  Showing <span className="font-semibold">{data.length}</span>{" "}
                  {type}
                </>
              ) : (
                <>
                  Showing{" "}
                  <span className="font-semibold">{filteredData.length}</span>{" "}
                  of <span className="font-semibold">{data.length}</span>{" "}
                  {type}
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};