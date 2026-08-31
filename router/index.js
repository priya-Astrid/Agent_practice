
import express from "express";
import { singleThreadChat } from "../controller/singleThreadChat.js";

const rotuer = express.Router();

rotuer.post("/single", singleThreadChat);

export default rotuer;
