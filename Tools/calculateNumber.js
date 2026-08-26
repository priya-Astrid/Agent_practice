import z from "zod";
import { generateContentAI } from "../config/generateAi.js";
import { tool } from "@langchain/core/tools";
import { ToolMessage } from "@langchain/core/messages";

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

  // llm ko tools available karana when you need you use it
  const modelWithTools = model.bindTools([calculate]);

  const question = "what is 30 + 40";
  // user+ llm
  const result = await modelWithTools.invoke(question);

  console.log("eresponse data", result);
  // toolcall nikala
  const toolcall = result.tool_calls[0];

 // tool execute karo 
  const toolResult = await calculate.invoke(toolcall.args);

  console.log("result code", toolResult);

  // tool result ko tool message me convert karo 
  const toolMessage = new ToolMessage({
    content: String(toolResult),
    tool_call_id: toolcall.id
  })
 console.log("toolmessage" , toolMessage);
//  complete conversation
 const messages = [{
    role: "user",
    content : question,
   },
   result,
   toolMessage
  ]
console.log("tolllm",messages)
  const finalResponse =await modelWithTools.invoke(messages);
  console.log("final response", finalResponse.content);
};
calculateNumber();
