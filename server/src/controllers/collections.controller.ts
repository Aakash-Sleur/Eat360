import { Request, Response } from "express";

import User from "../models/user.model";
import Collection from "../models/collections.model";

async function getCollections(req: Request, res: Response) {
  try {
    const collections = await Collection.find();
    return res.status(200).json(collections);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getCollectionById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Collection ID is required" });
    }

    const collection = await Collection.findById(id);
    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    return res.status(200).json(collection);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function createCollection(req: Request, res: Response) {
  try {
    const { name, description, author, thumbnail, items = [] } = req.body;

    if (!name || !description || !author || !thumbnail || !items) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const collection = await Collection.create({
      name,
      description,
      author,
      thumbnail,
      items,
    });

    if (!collection) {
      return res.status(500).json({ error: "Failed to create collection" });
    }

    await User.findByIdAndUpdate(author, {
      $push: { collections: collection._id },
    });

    return res.status(201).json(collection);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateCollection(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: "Collection ID is required" });
    }

    await Collection.findByIdAndUpdate(id, updateData);

    return res.status(200).json({ message: "Collection updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteCollection(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { authorId } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Collection ID is required" });
    }

    if (!authorId) {
      return res.status(400).json({ error: "Author ID is required" });
    }

    const collection = await Collection.findById(id);

    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    if (collection.author.toString() !== authorId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this collection" });
    }

    await Collection.findByIdAndDelete(id);
    await User.findByIdAndUpdate(authorId, {
      $pull: { collections: id },
    });

    return res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
};
