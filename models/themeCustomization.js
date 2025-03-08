// const mongoose = require("mongoose");

// const themeCustomizationSchema = new mongoose.Schema({
//   shopName: { type: String, required: true },
//   shopLogo: { type: String, required: true }, // URL or file path of the logo
//   favicon: { type: String, required: true },  // URL or file path of the favicon
//   createdAt: { type: Date, default: Date.now },
// });

// exports.ThemeCustomization = mongoose.model('ThemeCustomization', themeCustomizationSchema);


const mongoose = require("mongoose");

const themeCustomizationSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  shopLogo: { type: String, required: true },
  favicon: { type: String, required: true },
  displayType: { type: String, enum: ["banner", "carousel"], required: true },

  // ✅ Banner Image Data
  desktopBanner: { type: String, default: "" },
  mobileBanner: { type: String, default: "" },
  bannerText1: { type: String, default: "" },
  bannerText2: { type: String, default: "" },
  bannerText3: { type: String, default: "" },

  // ✅ Carousel Images Data
  desktopCarousel: [
    {
      image: { type: String, required: true },
      text1: { type: String, default: "" },
      text2: { type: String, default: "" },
      text3: { type: String, default: "" }
    }
  ],
  mobileCarousel: [
    {
      image: { type: String, required: true },
      text1: { type: String, default: "" },
      text2: { type: String, default: "" },
      text3: { type: String, default: "" }
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

exports.ThemeCustomization = mongoose.model("ThemeCustomization", themeCustomizationSchema);
