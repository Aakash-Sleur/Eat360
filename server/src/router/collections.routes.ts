import express from "express";

import {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../controllers/collections.controller";

export default (router: express.Router) => {
  router.get("/collections", getCollections);
  router.get("/collections/:id", getCollectionById);
  router.post("/collections", createCollection);
  router.put("/collections/:id", updateCollection);
  router.delete("/collections/:id", deleteCollection);
};
