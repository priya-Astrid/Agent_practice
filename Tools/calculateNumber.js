import z from "zod";
import { generateContentAI } from "../config/generateAi.js";
import { tool } from "@langchain/core/tools";

const add = ({a, b}) => {
  console.log(a, b);
  const sum = a + b;
  console.log("sums", sum);

  return sum;
};
const calculate = tool(add, {
  name: "calculate",
  description: "use this tool to add two number",
  schema: z.object({
    a: z.number().describe("fist number"),
    b: z.number().describe("second number"),
  }),
});

export const calculateNumber = async () => {
  const model = generateContentAI();

  const modelWithTools = model.bindTools([calculate]);
  const result = await modelWithTools.invoke("what is 30 + 40");

  console.log("eresponse data", result);
  const toolcall = result.tool_calls[0];

  const toolResult = await calculate.invoke(toolcall.args);

  console.log("result code", toolResult);
};
calculateNumber();
