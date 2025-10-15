// External packages
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import * as http from "http";
import mongoose from "mongoose";
import "dotenv/config";

// Internal modules
import router from "./router";
import { client, corsOptions, MONGO_URI, mongodbOptions, PORT } from "./config";
import path from "path";
import { addPublish } from "./seed";

// app
const app: Express = express();

// middlewares
app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(
  "/webhook",
  express.json({
    verify: (req, res, buf) => {
      //@ts-ignore
      let url = req.originalUrl;
      if (url.includes("/webhook")) {
        //@ts-ignore
        req.rawBody = buf.toString();
      }
    },
  })
);
app.use(express.json());

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const server = http.createServer(app);


// mongodb connection
mongoose
  .connect(MONGO_URI!, mongodbOptions)
  .then(() => console.log("Connected to MongoDB🤝"))
  .catch((err) => console.error("Error while connecting to MongoDB", err));

// routes
app.use("/", router());

// listening at port
server.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT} 🚀`);
});
