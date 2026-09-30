require("dotenv").config();

const express = require("express");
const Product = require("./Product");
const Business = require("./Business");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());


// HOME
app.get("/", (req, res) => {
    res.json({
        message: "GRROX Backend is running!"
    });
});


// GET ALL PRODUCTS
app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        res.json({
            message: "Products fetched successfully!",
            products: products
        });

    } catch (error) {
        res.status(500).json({
            message: "Products fetch failed",
            error: error.message
        });
    }
});


// ADD PRODUCT
app.post("/api/products", async (req, res) => {
    try {
        const product = new Product(req.body);

        const savedProduct = await product.save();

        res.status(201).json({
            message: "Product saved successfully!",
            product: savedProduct
        });

    } catch (error) {
        res.status(400).json({
            message: "Product save failed",
            error: error.message
        });
    }
});


// UPDATE PRODUCT
app.put("/api/products/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product updated successfully!",
            product: updatedProduct
        });

    } catch (error) {
        res.status(400).json({
            message: "Product update failed",
            error: error.message
        });
    }
});


// DELETE PRODUCT
app.delete("/api/products/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully!",
            product: deletedProduct
        });

    } catch (error) {
        res.status(400).json({
            message: "Product delete failed",
            error: error.message
        });
    }
});
// CREATE BUSINESS ACCOUNT
app.post("/api/businesses", async (req, res) => {
    try {
        const {
            ownerName,
            mobile,
            businessName,
            category,
            address,
            city,
            area,
            pincode
        } = req.body;

        const existingBusiness = await Business.findOne({ mobile });

        if (existingBusiness) {
            return res.status(409).json({
                message: "Business account already exists with this mobile number."
            });
        }

        const business = new Business({
            ownerName,
            mobile,
            businessName,
            category,
            address,
            city,
            area,
            pincode
        });

        const savedBusiness = await business.save();

        res.status(201).json({
            message: "Business account created successfully!",
            business: savedBusiness
        });

    } catch (error) {
        res.status(400).json({
            message: "Business account creation failed",
            error: error.message
        });
    }
});

// CONNECT MONGODB + START SERVER
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(
                `GRROX Backend running at http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );
    });