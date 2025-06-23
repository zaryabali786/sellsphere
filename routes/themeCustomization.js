const express = require("express");
const router = express.Router();
const { ThemeCustomization } = require("../models/themeCustomization");

// Save or Update Theme by User ID
router.post("/:userId", async (req, res) => {
    try {
        const { userId, content } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // Check if a theme already exists for this user
        let theme = await ThemeCustomization.findOne({ userId });

        if (theme) {
            // Update existing theme
            theme.content = content || theme.content;
        } else {
            // Create new theme
            theme = new ThemeCustomization({ userId, content });
        }

        await theme.save();
        res.status(200).json({ success: true, message: "Theme saved successfully!", theme });
    } catch (error) {
        console.error("Error saving theme:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Get Theme by User ID
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const theme = await ThemeCustomization.findOne({ userId });

        // if (!theme) {
        //     return res.status(200).json({ success: true, message: "No theme found!" });
        // }

        res.status(200).json({ success: true, theme });
    } catch (error) {
        console.error("Error fetching theme customization:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = router;
