// const mongoose = require('mongoose');

// const orderItemSchema = mongoose.Schema({
//     quantity: {
//         type: Number,
//         required: true
//     },
//     product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product'
//     }
// })

// exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);

const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    image: { type: String },
    selectedVariation: { type: Object }, // To store variations
    quantity: { type: String, required: true },
    unitPrice: { type: String, required: true },
    itemPrice: { type: String }, // Keeping as string if needed
    totalPrice: { type: String, required: true },
});

exports.OrderItem = mongoose.model("OrderItem", orderItemSchema);
