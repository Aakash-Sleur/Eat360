import { Router } from "express";

import {
  getAllUser,
  getFollowersAndFollowing,
  getTopUsers,
  getUserById,
  updateUser,
} from "../controllers/user.controller";

export default (router: Router) => {
  router
    .get("/users", getAllUser)
    .get("/users/:id/user", getUserById)
    .get("/users/top", getTopUsers)
    .put("/users/:id", updateUser)
    .get("/users/:id/followers-following", getFollowersAndFollowing);

  return router;
};
