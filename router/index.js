
import express from "express";
import { singleThreadChat } from "../controller/singleThreadChat.js";
import { firstStore } from "../controller/firstTestStoreMemory.js";

const rotuer = express.Router();

rotuer.post("/single", singleThreadChat);
rotuer.post("/store", firstStore)
export default rotuer;
