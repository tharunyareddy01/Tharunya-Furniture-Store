
const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId", "name email customerType")
      .sort({ orderDate: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch orders"
    });
  }
});

// GET CUSTOMER ORDERS
router.get("/customer/:customerId", async (req, res) => {
  try {
    const orders = await Order.find({
      customerId: req.params.customerId
    }).sort({ orderDate: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch customer orders"
    });
  }
});

// CREATE ORDER
router.post("/", async (req, res) => {
  try {
    const {
      customerId,
      products
    } = req.body;

    if (
      !customerId ||
      !products ||
      products.length === 0
    ) {
      return res.status(400).json({
        message: "Customer and products are required"
      });
    }

    // Find customer
    const customer = await User.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    let originalAmount = 0;
    const orderedProducts = [];

    // Check products and calculate amount
    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.productId}`
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `${product.name} has only ${product.quantity} items available`
        });
      }

      const itemTotal = product.price * item.quantity;

      originalAmount += itemTotal;

      orderedProducts.push({
        productId: product.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });
    }

    // Regular customers receive 10% discount
    let discount = 0;

    if (customer.customerType === "regular") {
      discount = originalAmount * 0.10;
    }

    const totalAmount = originalAmount - discount;

    // Generate order ID
    const orderId =
      "ORD" +
      Date.now();

    // Reduce product quantity
    for (const item of products) {
      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            quantity: -item.quantity
          }
        }
      );
    }

    // Create order
    const order = new Order({
      orderId,
      customerId,
      products: orderedProducts,
      originalAmount,
      discount,
      totalAmount,
      status: "Pending"
    });

    await order.save();

    // Increase customer's order count
    customer.totalOrders += 1;

    // Customer becomes regular after 2 or more completed orders
    if (customer.totalOrders >= 2) {
      customer.customerType = "regular";
    }

    await customer.save();

    res.status(201).json({
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to place order"
    });
  }
});

// UPDATE ORDER STATUS
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "Pending",
      "Processing",
      "Dispatched",
      "On the Way",
      "Reached",
      "Delivered",
      "Old Order"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status"
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status
      },
      {
        new: true
      }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.json({
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update order status"
    });
  }
});

module.exports = router;

