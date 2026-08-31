import { createAgent, tool } from "langchain";
import z from "zod";
import { generateContentAI } from "../../config/generateAi.js";
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
// ye single-user in-memory conversation history hia 
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

const HistoryMessage = [];
const chatWithUser = async (question) => {
  HistoryMessage.push({
    role: "user",
    content: question,
  });
  const model = generateContentAI();
  const Agent = createAgent({
    model,
    tools: [addition, subtraction, multiplication],
    systemPrompt: `
     you are a calculator agent. 
     Always use provided tools for Arithmetic calculations.
    `,
  });
  const finalResponse = await Agent.invoke({ messages: HistoryMessage });
  HistoryMessage.length = 0;
  HistoryMessage.push(...finalResponse.messages);

  const final = finalResponse.messages.at(-1);
  console.log("finally", final.content);
};

export const userQuestion = async () => {
  while (true) {
    const question = readlineSync.question("ask question....");
    if (question.toLowerCase() === "exit") {
      console.log("chat ended...");
      break;
    }
    await chatWithUser(question);
  }
};
userQuestion();
