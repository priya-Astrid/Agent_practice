import { tool } from "@langchain/core/tools";
import { generateContentAI } from "../config/generateAi.js";
import z from "zod";
import { ToolMessage } from "@langchain/core/messages";

const add = ({ a, b }) => {
  return a + b;
};
const multiple = ({ a, b }) => {
  return a * b;
};
const substract = ({ a, b }) => {
  return a - b;
};

const addition = tool(add, {
  name: "addition",
  description: "use this tool when add two number",
  schema: z.object({
    a: z.number().describe("first number"),
    b: z.number().describe("second number"),
  }),
});

const multiplication = tool(multiple, {
  name: "multiple",
  description: "use this tool when multiple two number",
  schema: z.object({
    a: z.number().describe("first number"),
    b: z.number().describe("second number"),
  }),
});
const substraction = tool(substract, {
  name: "substract",
  description: "use this tool when substract two number",
  schema: z.object({
    a: z.number().describe("first number"),
    b: z.number().describe("second number"),
  }),
});

export const OneInputMultitoolscall = async () => {
  const model = generateContentAI();
  const question = "what is 10 + 30 and what is 10*40 and what id 50-30";
  const modelWithTools = model.bindTools([
    addition,
    multiplication,
    substraction,
  ]);
  const result = await modelWithTools.invoke(question);
  //   toolscall nikalo

  const toolMessages = [];
  const toolCalls = result.tool_calls;
  const tools = {
    addition,
    substract: substraction,
    multiple: multiplication,
  };
  for (let data of toolCalls) {
     const selectedTools = tools[data.name];
  
    const toolsResult = await selectedTools.invoke(data.args);
    const toolMessage = new ToolMessage({
      content: String(toolsResult),
      tool_call_id: data.id,
    });
    toolMessages.push(toolMessage);
  }

  const message = [
    {
      role: "user",
      content: question,
    },
    result,
    ...toolMessages,
  ];
  const finalResponse = await modelWithTools.invoke(message);
  console.log("final :", finalResponse.content);
};

OneInputMultitoolscall();
