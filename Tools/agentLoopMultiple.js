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

export const OneToolResultdepend = async () => {
  const model = generateContentAI();
  const messages = [];

  const modelWithTools = model.bindTools([addition, multiplication]);
  const question = "What is 10 + 30 then result multiply by 2";
  messages.push({
    role: "user",
    content: question,
  });

  let response = await modelWithTools.invoke(messages);
  const tools = {
    addition,
    multiple:multiplication,
  };
  while (true) {
    if (response.tool_calls?.length) {
      // 2.  toolcall nikalo
      const toolcalls = response.tool_calls[0];

      //3. tool select kare
      messages.push(response);
      const selectedTool = tools[toolcalls.name];
      // 4. toolExecute
      const toolResult = await selectedTool.invoke(toolcalls.args);

      //  5. toolMessage
      const toolMessage = new ToolMessage({
        content: String(toolResult),
        tool_call_id: toolcalls.id,
      });

      //6. Tool result history mei9n add 
      messages.push(toolMessage);
      // 7.  llm ko again call
      response = await modelWithTools.invoke(messages);
    } else {
      //8. No tool call → final answe
      console.log("final", response.content);
      break;
    }
  }
};

OneToolResultdepend();
