const express = require("express");
const router = express.Router();
const { ThemeCustomization } = require("../models/themeCustomization");
const multer = require("multer");
const path = require('path'); // 👈 Import this at the top

// Allowed file types
const FILE_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg"
};

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error("Invalid image type");

        if (isValid) uploadError = null;
        cb(uploadError, "public/uploads");
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(" ").join("-");
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

// Multer Upload Setup
const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 } });

// ✅ Create or Update Theme Customization with Images
router.post("/", upload.fields([
    { name: "shopLogo", maxCount: 1 }, 
    { name: "favicon", maxCount: 1 },
    { name: "desktopBanner", maxCount: 1 }, 
    { name: "mobileBanner", maxCount: 1 },
    { name: "desktopCarousel", maxCount: 10 }, 
    { name: "mobileCarousel", maxCount: 10 }
]),  async (req, res) => {
    try {
        const { shopName, displayType, bannerText1, bannerText2, bannerText3 } = req.body;

        let shopLogoUrl = "", faviconUrl = "";
        let desktopBannerUrl = "", mobileBannerUrl = "";
        let desktopCarouselUrls = [], mobileCarouselUrls = [];

        // ✅ Save Shop Logo & Favicon
        if (req.files["shopLogo"]) {
            shopLogoUrl = `${req.protocol}://${req.get("host")}/public/uploads/${req.files["shopLogo"][0].filename}`;
        }
        if (req.files["favicon"]) {
            faviconUrl = `${req.protocol}://${req.get("host")}/public/uploads/${req.files["favicon"][0].filename}`;
        }

        // ✅ Save Banner Images
        if (displayType === "banner") {
            if (req.files["desktopBanner"]) {
                desktopBannerUrl = `${req.protocol}://${req.get("host")}/public/uploads/${req.files["desktopBanner"][0].filename}`;
            }
            if (req.files["mobileBanner"]) {
                mobileBannerUrl = `${req.protocol}://${req.get("host")}/public/uploads/${req.files["mobileBanner"][0].filename}`;
            }
        }

        // ✅ Save Carousel Images
        if (displayType === "carousel") {



            // ✅ Save Carousel Images correctly
            if (req.files["desktopCarousel"]) {
                // ✅ Fix: Use `_` instead of brackets
    req.files["desktopCarousel"].forEach((file, index) => {
        console.log(req.body[`desktopCarouselText1_${index}`], "text1"); // ✅ Should work now
        desktopCarouselUrls.push({
            image: `${req.protocol}://${req.get("host")}/public/uploads/${file.filename}`,
            text1: req.body[`desktopCarouselText1_${index}`],
            text2: req.body[`desktopCarouselText2_${index}`],
            text3: req.body[`desktopCarouselText3_${index}`]
        });
    });



                // req.files["desktopCarousel"].forEach((file, index) => {
                //     console.log(req.body[`desktopCarouselText1[${index}]`],"text1")
                //     desktopCarouselUrls.push({
                //         image: `${req.protocol}://${req.get("host")}/public/uploads/${file.filename}`,
                //         text1: req.body[`desktopCarouselText1[${index}]`],  // ✅ Fixed field name
                //         text2: req.body[`desktopCarouselText2[${index}]`],
                //         text3: req.body[`desktopCarouselText3[${index}]`]
                //     });
                // });
            }
    
            if (req.files["mobileCarousel"]) {
                // req.files["mobileCarousel"].forEach((file, index) => {
                //     mobileCarouselUrls.push({
                //         image: `${req.protocol}://${req.get("host")}/public/uploads/${file.filename}`,
                //         text1: req.body[`mobileCarouselText1[${index}]`],  // ✅ Fixed field name
                //         text2: req.body[`mobileCarouselText2[${index}]`],
                //         text3: req.body[`mobileCarouselText3[${index}]`]
                //     });
                // });
                req.files["mobileCarousel"].forEach((file, index) => {
                    console.log(req.body[`mobileCarouselText1_${index}`], "text1"); // ✅ Should work now
                    mobileCarouselUrls.push({
                        image: `${req.protocol}://${req.get("host")}/public/uploads/${file.filename}`,
                        text1: req.body[`mobileCarouselText1_${index}`],
                        text2: req.body[`mobileCarouselText2_${index}`],
                        text3: req.body[`mobileCarouselText3_${index}`]
                    });
                });
            }
            // if (req.files["desktopCarousel"]) {
            //     req.files["desktopCarousel"].forEach((file, index) => {
            //         desktopCarouselUrls.push({
            //             image: `${req.protocol}://${req.get("host")}/public/uploads/${file.filename}`,
            //             text1: req.body[`desktopCarousel[${index}][text1]`],
            //             text2: req.body[`desktopCarousel[${index}][text2]`],
            //             text3: req.body[`desktopCarousel[${index}][text3]`]
            //         });
            //     });
            // }
            // if (req.files["mobileCarousel"]) {
            //     req.files["mobileCarousel"].forEach((file, index) => {
            //         mobileCarouselUrls.push({
            //             image: `${req.protocol}://${req.get("host")}/public/uploads/${file.filename}`,
            //             text1: req.body[`mobileCarousel[${index}][text1]`],
            //             text2: req.body[`mobileCarousel[${index}][text2]`],
            //             text3: req.body[`mobileCarousel[${index}][text3]`]
            //         });
            //     });
            // }
        }

        // ✅ Find or Create Theme Customization Record
        let theme = await ThemeCustomization.findOne();
        if (theme) {
            // Update existing record
            theme.shopName = shopName;
            theme.displayType = displayType;
            if (shopLogoUrl) theme.shopLogo = shopLogoUrl;
            if (faviconUrl) theme.favicon = faviconUrl;

            if (displayType === "banner") {
                theme.desktopBanner = desktopBannerUrl;
                theme.mobileBanner = mobileBannerUrl;
                theme.bannerText1 = bannerText1;
                theme.bannerText2 = bannerText2;
                theme.bannerText3 = bannerText3;
            } else if (displayType === "carousel") {
                theme.desktopCarousel = desktopCarouselUrls;
                theme.mobileCarousel = mobileCarouselUrls;
            }
        } else {
            // Create new record
            theme = new ThemeCustomization({
                shopName,
                shopLogo: shopLogoUrl,
                favicon: faviconUrl,
                displayType,
                desktopBanner: desktopBannerUrl,
                mobileBanner: mobileBannerUrl,
                bannerText1,
                bannerText2,
                bannerText3,
                desktopCarousel: desktopCarouselUrls,
                mobileCarousel: mobileCarouselUrls
            });
        }

        await theme.save();
        res.status(200).json({ success: true, message: "Theme updated successfully!", theme });
    } catch (error) {
        console.error("Error updating theme customization:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// ✅ Get Theme Customization
router.get("/", async (req, res) => {
    try {
        const theme = await ThemeCustomization.findOne();
        if (!theme) return res.status(404).json({ success: false, message: "No theme found!" });

        res.status(200).json({ success: true, theme });
    } catch (error) {
        console.error("Error fetching theme customization:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.get('/featured-product', (req, res) => {
  const data=  {
        "templates": [
          {
            "id": "featuredProduct",
            "html": "<ng-template #featuredProduct let-data><h2>Featured: {{ data.name }}</h2><ul><li *ngFor='let item of data.products'>{{ item.name }} - {{ item.price }}</li></ul></ng-template>",
            "context": {
              "name": "Top Products",
              "products": [
                { "name": "Product A", "price": "$10" },
                { "name": "Product B", "price": "$20" }
              ]
            }
          }
        ]
      }
      
    // console.log(path.join(__dirname, '..', 'public','uploads', 'views', 'featured-product.html'))
    res.status(200).json({ success: true, message: "Theme updated successfully!", data });
    // res.sendFile(path.join(__dirname, '..', 'public','uploads', 'views', 'featured-product.html')); // 👈 Adjusted path
});

module.exports = router;
