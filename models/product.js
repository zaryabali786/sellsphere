const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    brand: {
        type: String,
        default: ''
    },
    price : {
        type: String,
        default:0
    },
    tagText : {
        type: String,
        default:0
    },
    desRate : {
        type: String,
        default:0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    countInStock: {
        type: String,
        required: true,
        min: 0,
        max: 1000
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    tag: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
        // Reference to comments associated with the product
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }],
    attributes: [{
            name: { type: String, required: true }, // Example: "Size", "Color"
            variations: [{
                value: { type: String, required: true }, // Example: "Small", "Large", "Red", "Black"
                price: { type: String, required: true }, // Price for this variation
                quantity: { type: String, required: true, min: 0 } // Stock for this variation
            }]
        }]
})

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});


exports.Product = mongoose.model('Product', productSchema);
