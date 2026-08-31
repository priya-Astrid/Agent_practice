import { Agent } from "../agent/calculateAgent.js";

export const storeService = async (question) => {
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
      streamMode: "updates",
    },
  );

  let finalstate;
  for await (const chunk of result) {
    console.log("chunking: ", chunk);
    finalstate = chunk;
  }
//   const finalAnswer = finalstate?.model?.messages.at(-1);
//   const data = finalAnswer.content;

  console.log("FINAL ANSWER", finalstate);

  return finalstate;
};
