
import express from "express";
import { singleThreadChat } from "../controller/singleThreadChat.js";
import { firstStore } from "../controller/firstTestStoreMemory.js";
import { Streamshow } from "../controller/Streamshow.js";

const rotuer = express.Router();

rotuer.post("/single", singleThreadChat);

rotuer.post("/store", firstStore)

rotuer.post("/showClient", Streamshow);

export default rotuer;
