import axios from "axios";

import { instance } from "@/lib/config";
import { IFollowersUpdate, IUpdateProfile, IUser } from "../types";

async function getUsers() {
  try {
    const response = await axios.get(`${instance.defaults.baseURL}/users`);

    return response.data;
  } catch (error) {
    console.error(`[ERROR_CREATE_USER]-${error}`);
  }
}

async function getUserById(id: string) {
  try {
    const Response = await axios.get(
      `${instance.defaults.baseURL}/users/${id}/user`
    );

    return Response.data as IUser;
  } catch (error) {
    console.error(`[ERROR_GET_USER_BY_ID]: ${error}`);
  }
}

async function getTopUsers() {
  try {
    const Response = await axios.get(`${instance.defaults.baseURL}/users/top`);

    return Response.data as IUser[];
  } catch (error) {
    console.error(`[ERROR_GET_TOP_USERS]: ${error}`);
  }
}

async function getUserFollowersAndFollowing(id: string) {
  try {
    const Response = await axios.get(
      `${instance.defaults.baseURL}/users/${id}/followers-following`
    );
    return Response.data as {
      followers: IUser[];
      following: IUser[];
    };
  } catch (error) {
    console.error(error);
  }
}

async function getCurrentUserId() {
  const userInfoString = localStorage.getItem("userId");
  const expirationTime = localStorage.getItem("expirationTime");

  if (userInfoString && expirationTime) {
    const currentTime = new Date().getTime();
    const expirationTimeMs = parseInt(expirationTime);

    if (currentTime > expirationTimeMs) {
      localStorage.removeItem("userId");
      console.log("User info has expired.");
      return null;
    } else {
      const userInfo = await getUserById(userInfoString);
      return userInfo;
    }
  } else {
    console.log("No user info found in localStorage.");
    return null;
  }
}

async function updateUser(user: IUpdateProfile) {
  try {
    const updateUser = await axios.put<IUser>(
      `${instance.defaults.baseURL}/users/${user.id}`,
      {
        ...user,
      }
    );

    if (!updateUser) {
      throw Error;
    }

    return updateUser.data;
  } catch (error) {
    console.error(`[ERROR_UPDATE_USER], ${error}`);
  }
}

async function followUser({
  currentUserId,
  otherUserId,
  followersList,
  followingList,
}: IFollowersUpdate) {
  try {
    const updatedUser = await axios.put<IUser>(
      `${instance.defaults.baseURL}/users/user/${currentUserId}`,
      {
        following: followingList,
      }
    );

    if (!updatedUser) {
      throw new Error("Failed to update Current User");
    }

    const updatedOtherUser = await axios.put<IUser>(
      `${instance.defaults.baseURL}/users/user/${otherUserId}`,
      {
        followers: followersList,
      }
    );

    if (!updatedOtherUser) {
      throw new Error("Failed to update Other User");
    }

    return updatedOtherUser.data;
  } catch (error) {
    console.error(`[ERROR_FOLLOW_USER]: ${error}`);
  }
}

export {
  getUsers,
  getUserById,
  getTopUsers,
  getUserFollowersAndFollowing,
  getCurrentUserId,
  updateUser,
  followUser,
};
