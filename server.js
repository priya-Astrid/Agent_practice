import app from "./app.js";
import http from "http";
import dotenv from "dotenv";
import { checkpointer } from "./config/mongodbSetup.js";
dotenv.config();

const server = http.createServer(app);

const startServer = async () => {
  try {
    //connection mongodb
    await checkpointer.setup();
    console.log("mongodb connect successfully");
    server.listen(process.env.PORT, () => {
      console.log(`start server on port ${process.env.PORT}`);
    });
  } catch (error) {
    throw error;
  }
};
startServer();
