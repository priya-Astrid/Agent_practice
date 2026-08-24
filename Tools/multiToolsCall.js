import { tool } from "@langchain/core/tools";
import z from "zod";
import { generateContentAI } from "../config/generateAi.js";
import { ToolMessage } from "@langchain/core/messages";

const add = ({ a, b }) => {
  return a + b;
};
const multiply = ({a,b}) =>{
    return a * b 
}
const calculate = tool(add, {
  name: "calculate",
  description: "use this tool when add two number",
  schema: z.object({
    a: z.number().describe("first number"),
    b: z.number().describe("second number"),
  }),
});
const multiCalculate = tool(multiply, {
    name: "multiple",
    description: "use this tools when multiple two number",
    schema: z.object({
        a: z.number().describe("first number"),
        b:z.number().describe("second number")
    })
})

export const multipleTools = async () => {
  const model = generateContentAI();
  const question = "what is 20 + 40";

  //   here llm provide tools
  const modelWithTools = model.bindTools([calculate, multiCalculate]);

  const result = await modelWithTools.invoke(question);
  console.log("tools call", result);

  //  tools call nikalo

  const toolsCall = result.tool_calls[0];
  console.log("tools ", toolsCall);

  // tools execute karo
  const toolResult = await calculate.invoke(toolsCall.args);
  console.log("result", toolResult);

  //   tool message
  const toolMessage = new ToolMessage({
    content: String(toolResult),
    tool_call_id: toolsCall.id
  });

  const message = [
    {
      role: "user",
      content: question,
    },
    result,
    toolMessage,
  ];
  const finalResponse = await modelWithTools.invoke(message);
  console.log("this is response", finalResponse.content);
};

multipleTools();
