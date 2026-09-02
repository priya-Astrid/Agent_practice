import { createAgent, createMiddleware, tool } from "langchain";
import z from "zod";
import { generateContentAI } from "../config/generateAi.js";

const add = ({ a, b }) => {
  return a + b;
};
const userData = () => {
  const data = {
    name: "priya",
    skill: "nodejs, mongodb, express, llm,agent",
  };
  return data;
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

const toolCallMiddleware = createMiddleware({
  name: "toolCallMiddleware",
  wrapToolCall: async (request, handler) => {
    // middleware error-handlin use try/catch
    try {
      // tool ko block/execute
      // whose tools?
      if (request.toolCall.name === "personalData") {
        //    permission check

        const isAdmin = true;
        //    not permission block
        if (!isAdmin) {
          throw new Error("this tool is not allowed to use ");
        }
      }
      // permission hai actual tool execute
      console.log("tool Name", request.toolCall.name);
      console.log("tool args", request.toolCall.args);

      const result = await handler(request);
      console.log("result wraptoolcall", result);
      return result;
    } catch (error) {
      console.log("tool Failed", error.messages);
      throw new Error(`tool ${request.toolCall.name} failed`);
    }
  },
});

const model = generateContentAI();

const Agent = createAgent({
  model,
  tools: [addition, personalData],
  systemPrompt: `you are a calculator. use tool for arthimetic calculation.`,
  middleware: [toolCallMiddleware],
});

export const wrapCallMiddleware = async () => {
  const response = await Agent.invoke({
    messages: [{ role: "user", content: "tell me personal data" }],
  });

  const finalResponse = response.messages.at(-1);
  console.log("this reponse", finalResponse.content);
};
wrapCallMiddleware();

/**
 * middleware creation concept => first loggingMiddleware
 * middleware - beforeModel, afterModel
 * middlware- wrapToolCall
 *  wrapToolCall block / execute
 *  wrapTollCall permission give tools
 *  wrapToolCall try/catch
 *  middleware => retry middleware
 */
