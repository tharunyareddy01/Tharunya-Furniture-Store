
const mongoose = require("mongoose");

const orderProductSchema = new mongoose.Schema(
  {
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  },
  {
    _id: false
  }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    products: {
      type: [orderProductSchema],
      required: true
    },

    totalAmount: {
      type: Number,
      required: true
    },

    originalAmount: {
      type: Number,
      required: true
    },

    discount: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Dispatched",
        "On the Way",
        "Reached",
        "Delivered",
        "Old Order"
      ],
      default: "Pending"
    },

    orderDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);

