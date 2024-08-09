import express from "express";

import {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../controllers/collections.controller";

export default (router: express.Router) => {
  router
    .get("/collections", getCollections)
    .get("/collections/:id", getCollectionById)
    .post("/collections", createCollection)
    .put("/collections/:id", updateCollection)
    .delete("/collections/:id", deleteCollection);
};
