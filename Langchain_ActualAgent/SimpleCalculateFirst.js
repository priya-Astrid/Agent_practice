// phase -1 = learning how to create a agent 

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

const calculate = tool(add, {
  name: "addition",
  description: "use this tools when add two number",
  schema: z.object({
    a: z.number().describe("first number"),
    b: z.number().describe("second number"),
  }),
});

const multiplication = tool(multiply, {
  name: "multiply",
  description: "use this tools when multiply two number",
  schema: z.object({
    a: z.number().describe("first number"),
    b: z.number().describe("second number"),
  }),
});
const subtraction = tool(subtract, {
  name: "subtract",
  description: "use this tools when subtract two number",
  schema: z.object({
    a: z.number().describe("first number"),
    b: z.number().describe("second number"),
  }),
});

export const simpleCalculateAgent = async () => {
  const model = generateContentAI();
  const Agent = createAgent({
    model,
    tools: [calculate, multiplication, subtraction],
  });
  const result = await Agent.invoke({
    messages: [{ role: "user", content: "what is 2*40" }],
  });

  const finalAnswer = result.messages.at(-1);
   console.log(finalAnswer.content);
};
simpleCalculateAgent();
