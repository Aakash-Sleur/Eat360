import express from "express";

import authentication from "./authentication.routes";
import user from "./user.routes";
import upload from "./upload.routes";
import recipe from "./recipe.routes";
import post from "./post.routes";
import payment from "./payment.routes";
import collection from "./collections.routes";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  user(router);
  upload(router);
  recipe(router);
  post(router);
  payment(router);
  collection(router);

  return router;
};
