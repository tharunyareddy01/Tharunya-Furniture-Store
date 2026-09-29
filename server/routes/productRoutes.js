
const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch products"
    });
  }
});

// GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch product"
    });
  }
});

// ADD PRODUCT
router.post("/", async (req, res) => {
  try {
    const {
      productId,
      name,
      category,
      price,
      quantity,
      image
    } = req.body;

    if (
      !productId ||
      !name ||
      !category ||
      price === undefined ||
      quantity === undefined ||
      !image
    ) {
      return res.status(400).json({
        message: "Please fill all product fields"
      });
    }

    const existingProduct = await Product.findOne({
      productId
    });

    if (existingProduct) {
      return res.status(400).json({
        message: "Product ID already exists"
      });
    }

    const product = new Product({
      productId,
      name,
      category,
      price,
      quantity,
      image
    });

    await product.save();

    res.status(201).json({
      message: "Product added successfully",
      product
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add product"
    });
  }
});

// UPDATE PRODUCT
router.put("/:id", async (req, res) => {
  try {
    const {
      productId,
      name,
      category,
      price,
      quantity,
      image
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        productId,
        name,
        category,
        price,
        quantity,
        image
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update product"
    });
  }
});

// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete product"
    });
  }
});

module.exports = router;

