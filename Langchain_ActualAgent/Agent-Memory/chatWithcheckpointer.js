import { createAgent, tool } from "langchain";
import z from "zod";
import { generateContentAI } from "../../config/generateAi.js";
import { MemorySaver } from "@langchain/langgraph-checkpoint";

import readlineSync from "readline-sync";
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
  tools: [addition, subtraction, multiplication],
  systemPrompt: `
    you are a calculator agent.
     always use provided tools for arithmetic calculation`,
  checkpointer,
});
const simpleChat = async (question) => {
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
        thread_id: "chat_01",
      },
    },
  );
  const finalAnswer = result.messages.at(-1);
  console.log("response : ", finalAnswer.content);
};

export const simpleMemory = async () => {
  while (true) {
    const question = readlineSync.question("ask question....");
    if (question.toLowerCase() === "exit") {
      console.log("chat ended...");
      break;
    }
    await simpleChat(question);
  }
};
simpleMemory();
