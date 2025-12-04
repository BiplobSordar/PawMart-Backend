
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import User from "../models/User.js";


export const addProductOrPet = async (req, res) => {
    
    try {
        const {
            name,
            category,
            price,
            description,
            image,
            isPet,
            age,
            breed,
            adoptionStatus,
            stock,
            sellerUid: clientSellerUid,
            location

        } = req.body;
        console.log(location,'tghis ')

    
        const sellerUid = req.user?.uid;
        if (!sellerUid || sellerUid !== clientSellerUid) {
            return res.status(401).json({ message: "Unauthorized: Invalid user" });
        }

       
        if (!isPet && category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(400).json({ message: "Invalid category ID" });
            }
        }

        const newListing = new Product({
            name,
            category:  category,
            price: isPet ? 0 : price,
            description,
            image,
            sellerUid,
            isPet: !!isPet,
            age: isPet ? age : undefined,
            breed: isPet ? breed : undefined,
            adoptionStatus: isPet ? adoptionStatus || "available" : undefined,
            stock: isPet ? 1 : stock || 0,
            location:location
        });

        const savedListing = await newListing.save();

        res.status(201).json({
            message: isPet ? "Pet added successfully!" : "Product added successfully!",
            data: savedListing,
        });
    } catch (error) {
        console.error("Error adding listing:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};







export const getProducts = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      sort = "",
      page = 1,
      limit = 10,
      fetured,
      isPet,
      recommendedFor,
    } = req.query;

    const filter = {};

  
    if (search) filter.name = { $regex: search, $options: "i" };

 
    if (category) filter.category = category;


    if (fetured !== undefined) filter.fetured = JSON.parse(fetured);

 
    if (isPet !== undefined) filter.isPet = JSON.parse(isPet);

 
    if (recommendedFor) {
      const baseProduct = await Product.findById(recommendedFor);
      if (baseProduct) {
        filter.category = baseProduct.category;
        filter._id = { $ne: recommendedFor }; 
      }
    }


    let sortOption = {};
    if (sort === "latest") sortOption = { createdAt: -1 };
    else if (sort === "oldest") sortOption = { createdAt: 1 };
    else if (sort === "priceLow") sortOption = { price: 1 };
    else if (sort === "priceHigh") sortOption = { price: -1 };

    // Pagination
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .populate("category", "name"),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "Products fetched successfully",
      products,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};






export const getProductById = async (req, res) => {
  console.log("📦 Product fetch request received");

  try {
    const { id } = req.params;

  
    const product = await Product.findById(id)
      .populate("category", "name")
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }


    const seller = await User.findOne({ uid: product.sellerUid })
     
      console.log(seller,'thsi si seller')

   
    const combinedProduct = {
      ...product,
      seller: seller || {
        name: "Unknown",
        email: "",
        phone: "",
        avatar: "",
      },
    };

   
    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product: combinedProduct,
    });

  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};





export const getMyListings = async (req, res) => {
  try {
  
    const { uid } = req.user;
   

    if (!uid) {
      return res.status(401).json({ message: "Unauthorized: UID missing" });
    }

   
    const myProducts = await Product.find({ sellerUid: uid }).sort({ createdAt: -1 });

    if (!myProducts.length) {
      return res.status(200).json({
        message: "You have no listings yet.",
        products: [],
      });
    }

    res.status(200).json({
      message: "Your listings fetched successfully",
      count: myProducts.length,
      products: myProducts,
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};







export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userUid = req.user.uid;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.sellerUid !== userUid) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userUid = req.user.uid;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

  
    if (product.sellerUid !== userUid) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

 
    const allowedUpdates = [
      "name",
      "category",
      "price",
      "description",
      "image",
      "isPet",
      "age",
      "breed",
      "adoptionStatus",
      "stock",
      "location",
    ];

    const updateData = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

