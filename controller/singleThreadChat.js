import { singlechatService } from "../services/singleThreadService.js";

export const singleThreadChat = async (req, res) => {
  try {
    const result = await singlechatService(req.body.question, req.body.threadId);
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    throw error;
  }
};
