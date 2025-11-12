import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error: Cannot fetch category data",
    });
  }
};
