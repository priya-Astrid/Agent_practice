import { MemorySaver } from "@langchain/langgraph-checkpoint";
import { generateContentAI } from "../config/generateAi.js";
import { createAgent, tool } from "langchain";
import z from "zod";

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
  description: "use this tools to add to number",
  schema: z.object({
    a: z.number().describe("first number"),
    b: z.number().describe("second number"),
  }),
});

const multiplication = tool(multiply, {
  name: "multiply",
  description: "use this tools to multiply to number",
  schema: z.object({
    a: z.number().describe("first number"),
    b: z.number().describe("second number"),
  }),
});

const subtraction = tool(subtract, {
  name: "subtract",
  description: "use this tools to subtract to number",
  schema: z.object({
    a: z.number().describe("first number"),
    b: z.number().describe("second number"),
  }),
});
 const model = generateContentAI();
  const checkpointer = new MemorySaver();

  const Agent = createAgent({
    model,
    tools: [addition, multiplication, subtraction],
    systemPrompt: `always use provided tools for arthimetic calculation`,
    checkpointer,
  });
export const singlechatService = async (question, threadId) => {
 

  const result = await Agent.invoke(
    {
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
    },
    {
      configurable: {
        thread_id: threadId,
      },
    },
  );
  const finalResponse = result.messages.at(-1);
  const data = finalResponse.content;
  console.log("reposnse", data);

  return data;
};
