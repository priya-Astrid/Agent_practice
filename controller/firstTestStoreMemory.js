import { storeService } from "../services/storeMemoryService.js";

export const firstStore = async (req, res) => {
  try {
    const result = await storeService(req.body.question);
    res.status(200).json({
      success: true,
      message: "store data successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
