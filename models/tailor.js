const mongoose = require('mongoose');

const tailorSchema = mongoose.Schema({
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

    rating: {
        type: Number,
        default: 0,
    },
    numProjects: {
        type: Number,
        default: 0,
    },
    isFeatured: {
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
        }]
})

tailorSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

tailorSchema.set('toJSON', {
    virtuals: true,
});


exports.Tailor = mongoose.model('Tailor', tailorSchema);
