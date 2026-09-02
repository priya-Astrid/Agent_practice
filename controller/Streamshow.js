import { streamService } from "../services/streamResponse.js";

export const Streamshow = async (req, res) => {
  try {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    await streamService(req.body.question, res);
  } catch (error) {
    console.error("🔥 ORIGINAL ERROR:", error);
    console.error("🔥 ERROR MESSAGE:", error.message);
    console.error("🔥 HEADERS SENT:", res.headersSent);

    if (!res.headersSent) {
      res.status(500).send({
        success: false,
        message: error.message,
      });
    } else {
      res.end();
    }
  }
};
