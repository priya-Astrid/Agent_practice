import { Agent } from "../agent/calculateAgent.js";

export const streamMessage = async (question) => {
  const result = await Agent.stream(
    {
      messages: [{ role: "user", content: question }],
    },
    {
      configurable: {
        thread_id: "user-01",
      },
      streamMode: "messages",
    },
  );

  let finalAnswer = "";
  for await (const [message, metadata] of result) {
    if (typeof message.content === "string") {
      process.stdout.write(message.content);
      finalAnswer += message.content;
    }
  }
  console.log("FINAL ANSWER", finalAnswer);
  return finalAnswer;
};
