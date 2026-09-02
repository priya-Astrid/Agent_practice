import { createAgent, createMiddleware, tool } from "langchain";
import z from "zod";
import { generateContentAI } from "../config/generateAi.js";

const add = ({ a, b }) => {
  return a + b;
};
const userData = () => {
  // const data = {
  //   name: "priya",
  //   skill: "nodejs, mongodb, express, llm,agent",
  // };
  // return data;
  throw new Error("temporary tools fails")
};
const addition = tool(add, {
  name: "addition",
  description: "use this tool to add to number",
  schema: z.object({
    a: z.number().describe("first number"),
    b: z.number().describe("second Number"),
  }),
});

const personalData = tool(userData, {
  name: "personalData",
  description: "use this tool when user need personal infonation",
  schema: z.object({
    name: z.string(),
    skill: z.object({}),
  }),
});

const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
const RetryMiddleware = createMiddleware({
  name: "RetryMiddleware",
  wrapToolCall: async (request, handler) => {
    let maxAttempt = 3;
    let baseDelay = 1000;
    const isAdmin = true;
    if (!isAdmin) {
      throw new Error("dot use this tools");
    }
    for (let attempt = 1; attempt <= maxAttempt; attempt++) {
      try {
        const result = await handler(request);
        return result;
      } catch (error) {
        if (attempt === maxAttempt) {
          throw error;
        }

        const waitTime = baseDelay * 2 ** (attempt - 1);
        console.log(`Retrying after ${waitTime} ms`);
        await delay(waitTime);
      }
    }
  },
});

const model = generateContentAI();

const Agent = createAgent({
  model,
  tools: [addition, personalData],
  systemPrompt: `you are a calculator. use tool for arthimetic calculation.`,
  middleware: [RetryMiddleware],
});

export const retryMiddleware = async () => {
  const response = await Agent.invoke({
    messages: [{ role: "user", content: "tell me personal data" }],
  });

  const finalResponse = response.messages.at(-1);
  console.log("this reponse", finalResponse.content);
};
retryMiddleware();

/**
 * middleware creation concept => first loggingMiddleware
 * middleware - beforeModel, afterModel
 * middlware- wrapToolCall
 *  wrapToolCall block / execute
 *  wrapTollCall permission give tools
 *  wrapToolCall try/catch
 *  middleware => retry middleware
 */
