import { createAgent, createMiddleware, tool } from "langchain";
import { generateContentAI } from "../config/generateAi.js";
import z from "zod";

const add = ({ a, b }) => {
  return a + b;
};
const addition = tool(add, {
  name: "addition",
  description: "use this tool to add to number",
  schema: z.object({
    a: z.number().describe("first number"),
    b: z.number().describe("second Number"),
  }),
});

const logginMiddleware = createMiddleware({
  name: "logginMiddleware",
  beforeMiddleware: async (state) => {
    console.log("middleware before state: ", state);
    return;
  },
  afterMiddleware: async (state) => {
    console.log("middleware after state", state);
    return;
  },
});
const model = generateContentAI();

const Agent = createAgent({
  model,
  tools: [addition],
  systemPrompt: `you are  a calculator agent. always use tools for arthimetic operations`,
  middlewares: [logginMiddleware],
});

export const firstMiddleware = async () => {
    
const result = await Agent.invoke({
  messages: [
    {
      role: "user",
      content: "what is 2+3",
    },
  ],
});
const finalAnswer = result.messages.at(-1);
const data = finalAnswer.content;
console.log("final Answer", data);

};
firstMiddleware();
