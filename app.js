import expess from "express";
const app = expess();
import rotuer from "./router/index.js";
app.use(expess.json());

app.use("/api/v1/", rotuer);
export default app;
