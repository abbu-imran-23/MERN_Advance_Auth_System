/******************* Imports *********************/
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middlewares/errorHandler.middleware";

/** Load env variables **/
dotenv.config();

/** Instance of Express Server **/
const app = express();

/******************* Middlewares *********************/

/** Parse JSON **/
app.use(express.json());

/** Parse URL encoded payloads **/
app.use(express.urlencoded({ extended: true }));

/** Serves Static Files **/
app.use(express.static("public"));

/** Cookie Parser **/
app.use(cookieParser());

/** CORS **/
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

/** Logs HTTP requests and errors **/
app.use(morgan("dev"));

/** Sets Secure HTTP headers **/
app.use(helmet());

/** Compresses HTTP responses **/
app.use(compression());

/** Global Error Handler **/
app.use(errorHandler);

/******************* Routes *********************/
app.use("/api/auth", authRoutes);

export default app;
