import { createAgent, tool } from "langchain";
import z from "zod";
import { generateContentAI } from "../../config/generateAi.js";
import { MemorySaver } from "@langchain/langgraph";

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
   const checkpointer = new MemorySaver();
     const Agent = createAgent({
      model,
      tools: [addition, subtraction, multiplication],
      systemPrompt: `
            you are a calculator Agent.
            always use the provided tool for arithmetic calculations.  
            `,

      checkpointer,
    });

    const result = await Agent.invoke(
      {
        messages: [{ role: "user", content: "what is 10+30" }],
      },
      {
        configurable: {
          thread_id: "chat-1",
        },
      },
    );
    const finalAnswer = result.messages.at(-1);
    console.log("final answer", finalAnswer.content);
    // memory concept
  } catch (error) {
  console.error("error message:", error);
  }
};
simpleMemory();
