const express = require('express');
const router = express.Router();
const { Comment } = require('../models/comment');

// POST a new comment
router.post('/', async (req, res) => {
    try {
        // Create a new comment object
        const newComment = new Comment({
            productId: req.body.productId,
            commenterName: req.body.commenterName,
            commenterEmail: req.body.commenterEmail,
            commentText: req.body.commentText
        });

        // Save the comment to the database
        const savedComment = await newComment.save();

        return res.status(201).json({ success: true, data: savedComment });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});


// GET comments by project ID
router.get('/project/:projectId', async (req, res) => {
    try {
        // Fetch comments by project ID
        const comments = await Comment.find({ productId: req.params.projectId });

        return res.status(200).json({ success: true, data: comments });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});
module.exports = router;
