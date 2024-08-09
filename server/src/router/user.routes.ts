import { Router } from "express";

import {
  getAllUser,
  getFollowersAndFollowing,
  getUserById,
  updateUser,
} from "../controllers/user.controller";

export default (router: Router) => {
  router
    .get("/users", getAllUser)
    .get("/users/:id", getUserById)
    .put("/users/:id", updateUser)
    .get("/users/:id/followers-following", getFollowersAndFollowing);

  return router;
};
