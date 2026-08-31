import app from "./app.js";
import http from "http";
import dotenv from "dotenv";
dotenv.config();

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`start server on port ${process.env.PORT}`);
});
