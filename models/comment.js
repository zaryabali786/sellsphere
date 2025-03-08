const mongoose = require('mongoose');
const commentSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    commenterName: {
        type: String,
        required: true
    },
    commenterEmail: {
        type: String,
        required: true
    },
    commentText: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


commentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

commentSchema.set('toJSON', {
    virtuals: true,
});

exports.Comment = mongoose.model('Comment', commentSchema);
