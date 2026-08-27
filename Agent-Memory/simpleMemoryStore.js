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

const simpleMemory = async () => {
  try {
    const model = generateContentAI();
    const Agent = createAgent({
      model,
      tools: [addition, subtraction, multiplication],
      systemPrompt: `
            you are a calculator Agent.
            always use the provided tool for arithmetic calculations.  
            `,
    });
    // memory concept
    let messages = [];
    messages.push({
      role: "user",
      content: "what is 10 + 30",
    });
    const result1 = await Agent.invoke({ messages });
    // save conversion
    messages.push(...result1.messages);
    console.log(
      "final:",
      result1.messages[result1.messages.length - 1].content,
    );
    //   second conversation

    messages.push({
      role: "user",
      content: "Now multiply it by 3",
    });
    const result2 = await Agent.invoke({ messages });
    messages.push(...result2.messages);
    console.log(
      "final:",
      result2.messages[result2.messages.length - 1].content,
    );
  } catch (error) {
    throw new error("erro message :", error);
  }
};
simpleMemory();
