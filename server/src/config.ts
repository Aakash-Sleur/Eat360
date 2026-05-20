export const MONGO_URI = process.env.MONGODB_URI;
export const PORT = process.env.PORT || 8080;
export const client = process.env.CLIENT_URL;
export const DB_NAME = process.env.DB_NAME || "test";

console.log("Client URL:", client);
console.log("MongoDB URI:", MONGO_URI ? "Set" : "Not Set");

export const mongodbOptions = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
  dbName: DB_NAME,
};

export const corsOptions = {
  origin: client,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
