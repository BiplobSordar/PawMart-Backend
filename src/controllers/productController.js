
import Product from "../models/Product.js";
import Category from "../models/Category.js";


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
            sellerUid: clientSellerUid

        } = req.body;

    
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
