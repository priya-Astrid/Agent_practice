import { createAgent, tool } from "langchain";
import z from "zod";
import { generateContentAI } from "../config/generateAi.js";

const add = ({ a, b }) => {
  return a + b;
};
const multiply = ({ a, b }) => {
  return a * b;
};
const subtract = ({ a, b }) => {
  return a - b;
};

const addition = tool(add, {
  name: "addition",
  description: "use this tool when add two number",
  schema: z.object({
    a: z.number().describe("first number"),
    b: z.number().describe("second number"),
  }),
});

const multiplication = tool(multiply, {
  name: "multiply",
  description: "use this tool when multiply two number",
  schema: z.object({
    a: z.number().describe("first number"),
    b: z.number().describe("second number"),
  }),
});

const subtraction = tool(subtract, {
  name: "subtract",
  description: "use this tool when subtract two number",
  schema: z.object({
    a: z.number().describe("first number"),
    b: z.number().describe("first number"),
  }),
});

export const multiToolsCall = async () => {
  const model = generateContentAI();
  const Agent = createAgent({
    model,
    tools: [addition, subtraction, multiplication],
  });
  const result = await Agent.invoke({
    messages: [
      {
        role: "user",
        content: "what is 10 +20 then reult multiply by 2  ",
      },
    ],
  });
  const message = result.messages;
  const finalAnswer = message[message.length - 1];
  console.log("final Response", finalAnswer.content);
};
multiToolsCall();