import { tool } from "@langchain/core/tools";
import z from "zod";
import { generateContentAI } from "../config/generateAi.js";
import { ToolMessage } from "@langchain/core/messages";

// function create
const add = ({ a, b }) => {
  return a + b;
};
const multiply = ({ a, b }) => {
  return a * b;
};

// tools create karege

const addition = tool(add, {
  name: "addition",
  description: "use this tool when add two number",
  schema: z.object({
    a: z.number().describe("first number"),
    b: z.number().describe("second number"),
  }),
});

const multiplication = tool(multiply, {
  name: "multiple",
  description: "use this tool when multiply two number",
 schema :z.object({
    a: z.number().describe("a number"),
    b: z.number().describe("b number")
 })
});

export const runTwoTools = async () => {
  const model = generateContentAI();
  const question = "what is 30 + 60";
  // llm ko btaya ki two tools available
  const modelWithTools = model.bindTools([addition, multiplication]);

  const response = await modelWithTools.invoke(question);

  //toolcall nikalege
  const toolcall = response.tool_calls[0];
  //tools lookup
  const tools = { addition, multiple: multiplication };
  const selectedTools = tools[toolcall.name];
  const toolResult = await selectedTools.invoke(toolcall.args);

  //   toolsMessage result send ko llm

  const toolMessage = new ToolMessage({
    content: String(toolResult),
    tool_call_id: toolcall.id,
  });
  const message = [
    {
      role: "user",
      content: question,
    },
    response,
    toolMessage,
  ];

  //   llm to mesage fir se dege
  const finalAnswer = await modelWithTools.invoke(message);
  console.log("final answer", finalAnswer.content);
};

runTwoTools()