const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");


async function seedDatabase() {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log("Connected to MongoDB");


        // =========================================
        // 1. CREATE ADMIN IF NOT EXISTS
        // =========================================

        let admin =
            await User.findOne({
                email: "admin@tharunyafurniture.com"
            });


        if (!admin) {

            admin = await User.create({

                name: "Admin",

                email:
                    "admin@tharunyafurniture.com",

                password: "admin123",

                role: "admin",

                customerType: "one-time",

                totalOrders: 0

            });

            console.log(
                "Admin account created"
            );

        } else {

            console.log(
                "Admin already exists"
            );

        }



        // =========================================
        // 2. CREATE SAMPLE CUSTOMERS
        // =========================================

        const sampleCustomers = [

            {
                name: "Ravi Kumar",
                email: "ravi@gmail.com",
                password: "ravi123",
                customerType: "regular",
                totalOrders: 3
            },

            {
                name: "Priya Reddy",
                email: "priya@gmail.com",
                password: "priya123",
                customerType: "regular",
                totalOrders: 2
            },

            {
                name: "Sandeep",
                email: "sandeep@gmail.com",
                password: "sandeep123",
                customerType: "one-time",
                totalOrders: 1
            },

            {
                name: "Anjali",
                email: "anjali@gmail.com",
                password: "anjali123",
                customerType: "one-time",
                totalOrders: 0
            }

        ];


        for (
            const customer
            of sampleCustomers
        ) {

            const existing =
                await User.findOne({
                    email: customer.email
                });


            if (!existing) {

                await User.create({

                    ...customer,

                    role: "customer"

                });

                console.log(
                    `${customer.name} created`
                );

            } else {

                console.log(
                    `${customer.name} already exists`
                );

            }

        }



        // =========================================
        // 3. PRODUCTS
        // =========================================

        const products = [

            {
                productId: "P001",

                name: "Royal Comfort Sofa",

                category: "Sofas",

                price: 28500,

                quantity: 8,

                image: "images/product1.jpg"
            },


            {
                productId: "P002",

                name: "Classic Wooden Bed",

                category: "Beds",

                price: 42000,

                quantity: 5,

                image: "images/product2.jpg"
            },


            {
                productId: "P003",

                name: "Modern Dining Table",

                category: "Tables",

                price: 22000,

                quantity: 10,

                image: "images/product3.jpg"
            },


            {
                productId: "P004",

                name: "Elegant Lounge Chair",

                category: "Chairs",

                price: 12500,

                quantity: 12,

                image: "images/product4.jpg"
            },


            {
                productId: "P005",

                name: "Premium Wooden Wardrobe",

                category: "Wardrobes",

                price: 35000,

                quantity: 6,

                image: "images/product5.jpg"
            },
            

            {
    productId: "P007",
    name: "King Size Comfort Bed",
    category: "Beds",
    price: 52000,
    quantity: 4,
    image: "images/product7.jpg"
},

{
    productId: "P008",
    name: "Elegant Coffee Table",
    category: "Tables",
    price: 14500,
    quantity: 9,
    image: "images/product8.jpg"
},

{
    productId: "P009",
    name: "Premium Office Chair",
    category: "Chairs",
    price: 9800,
    quantity: 15,
    image: "images/product9.jpg"
},

{
    productId: "P010",
    name: "Sliding Door Wardrobe",
    category: "Wardrobes",
    price: 45000,
    quantity: 5,
    image: "images/product10.jpg"
},

{
    productId: "P011",
    name: "Modern 6 Seater Dining Set",
    category: "Dining",
    price: 48000,
    quantity: 6,
    image: "images/product11.jpg"
},

{
    productId: "P012",
    name: "Wooden Bookshelf",
    category: "Tables",
    price: 16500,
    quantity: 10,
    image: "images/product12.jpg"
},

{
    productId: "P013",
    name: "Designer Accent Chair",
    category: "Chairs",
    price: 13500,
    quantity: 8,
    image: "images/product13.jpg"
},

{
    productId: "P014",
    name: "Luxury Queen Bed",
    category: "Beds",
    price: 39500,
    quantity: 5,
    image: "images/product14.jpg"
},

{
    productId: "P015",
    name: "Classic Wooden Sofa Set",
    category: "Sofas",
    price: 55000,
    quantity: 3,
    image: "images/product15.jpg"
}
        ];



        // =========================================
        // CREATE OR UPDATE PRODUCTS
        // =========================================

        for (
            const product
            of products
        ) {

            const existing =
                await Product.findOne({
                    productId:
                        product.productId
                });


            if (!existing) {

                await Product.create(
                    product
                );

                console.log(
                    `${product.name} created`
                );

            } else {

                // UPDATE IMAGE PATH
                existing.image =
                    product.image;

                // Update other product details too
                existing.name =
                    product.name;

                existing.category =
                    product.category;

                existing.price =
                    product.price;

                existing.quantity =
                    product.quantity;

                await existing.save();

                console.log(
                    `${product.name} updated`
                );

            }

        }



        // =========================================
        // 4. SHOW DATABASE COUNT
        // =========================================

        const userCount =
            await User.countDocuments();


        const productCount =
            await Product.countDocuments();


        const orderCount =
            await Order.countDocuments();


        console.log(
            "\n=============================="
        );


        console.log(
            "Users    :",
            userCount
        );


        console.log(
            "Products :",
            productCount
        );


        console.log(
            "Orders   :",
            orderCount
        );


        console.log(
            "Database setup completed"
        );


        console.log(
            "==============================\n"
        );


        await mongoose.connection.close();


    } catch (error) {

        console.error(
            "Seed error:",
            error
        );

        process.exit(1);

    }

}


seedDatabase();