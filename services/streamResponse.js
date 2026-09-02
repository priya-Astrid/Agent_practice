import { Agent } from "../agent/calculateAgent.js";

export const streamService = async (question, res) => {
  const thread_id = "user-01";
  const result = await Agent.stream(
    {
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
    },
    {
      configurable: {
        thread_id: thread_id,
      },
      streamMode: "messages",
    },
  );

  for await (const [message, metadata] of result) {
    if (typeof message.content === "string") {
      res.write(message.content);
    }
  }

  res.end();
};
