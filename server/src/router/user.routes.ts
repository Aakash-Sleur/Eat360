import { Router } from "express";

import {
  getAllUser,
  getFollowersAndFollowing,
  getUserById,
  updateUser,
} from "../controllers/user.controller";

export default (router: Router) => {
  router.get("/users", getAllUser);
  router.get("/users/:id", getUserById);
  router.put("/users/:id", updateUser);
  router.get("/users/:id/followers-following", getFollowersAndFollowing);
  return router;
};
