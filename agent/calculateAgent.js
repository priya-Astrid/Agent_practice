import { createAgent, tool } from "langchain";
import z from "zod";
import { checkpointer } from "../config/mongodbSetup.js";
import { generateContentAI } from "../config/generateAi.js";

const add = ({ a, b }) => {
  return a + b;
};
const multiply = ({ a, b }) => {
  return a * b;
};
const divide = ({ a, b }) => {
  if (b === 0) {
    throw new Error("can not divide by zero");
  }
  return a / b;
};

const addition = tool(add, {
  name: "addition",
  description: "use this tool to add to number",
  schema: z.object({
    a: z.number().describe("first number"),
    b: z.number().describe("second Number"),
  }),
});

const multiplication = tool(multiply, {
  name: "multiply",
  description: "use this tool to multiply to number",
  schema: z.object({
    a: z.number().describe("first number"),
    b: z.number().describe("second Number"),
  }),
});
const division = tool(divide, {
  name: "divide",
  description: "use this tool to devide to number",
  schema: z.object({
    a: z.number().describe("first number"),
    b: z.number().describe("second Number"),
  }),
});
// structure output
// const resultSchema = z.object({
//   operation: z.string(),
//   a: z.number(),
//   b: z.number(),
//   result: z.number(),
// });

const model = generateContentAI();
export const Agent = createAgent({
  model,
  tools: [addition, multiplication, division],
  systemPrompt: `
  you are  a calculator agent.
  always use tools required to arthimetic operation`,
  checkpointer,
//   responseFormat: resultSchema,
});
