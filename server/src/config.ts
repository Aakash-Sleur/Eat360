export const MONGO_URI = process.env.MONGODB_URI;
export const PORT = process.env.PORT || 8080;
export const client = process.env.CLIENT_URL;

export const mongodbOptions = {
  serverSelectionTimeoutMS: 5000,
};

export const corsOptions = {
  origin: client,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
