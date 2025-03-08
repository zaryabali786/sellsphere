const { Product } = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const { product } = require('../constant/constant');
const sanitizeHtml = require('sanitize-html');
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage1, limits: { fileSize: 1024 * 1024 * 5 } });

// Configure multer to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the directory where uploaded files will be stored
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        // Specify the filename for the uploaded file
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });


router.get(`/`, async (req, res) => {
    let filter = {};

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const featured = req.query.featured === 'true'; // Check if 'featured' query parameter is 'true'

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Check if categories query parameter is present
// Check if categories query parameter is present
if (req.query.categories !==undefined) {
    const categories = req.query.categories.split(','); // Split multiple categories
    filter.category = categories.length === 1 ? categories[0] : { $in: categories };
    console.log(req.query.categories);

}



    // Check if minPrice and/or maxPrice query parameters are present
    if (req.query.minPrice || req.query.maxPrice) {
        filter.price = {};
        if (req.query.minPrice) {
            filter.price.$gte = parseInt(req.query.minPrice);
        }
        if (req.query.maxPrice) {
            filter.price.$lte = parseInt(req.query.maxPrice);
        }
    }

    // Check if search query parameter is present
    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        filter.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    // Add isFeatured filter if 'featured' query parameter is 'true'
    if (featured) {
        filter.isFeatured = true;
    }
    try {
        // Fetch products with pagination
        const productList = await Product.find(filter)
                                          .populate('category')
                                          .skip(skip)
                                          .limit(limit);

        let data = productList.map((data) => {
            return {
                ...data._doc,
                id: data._id ?? '-',
                Name: data?.name ?? '',
                Price: data.price ?? '',
                Image: data.image ?? '',
                category: data.category?.name ?? '',
                categoryId: data.category?.id ?? '',
            };
        });

        let totalCount = await Product.countDocuments(filter);

        d = product;
        let data1 = [data, d,{ total: totalCount, page, limit }];
        res.status(200).send(data1);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


router.get(`/mainPageProducts`, async (req, res) => {
    let filter = {};
    // Add isFeatured filter
    filter.isFeatured = true;

    try {
        const categories = await Category.find(); // Fetch all categories

        let categoryProducts = [];

        // Loop through each category
        for (const category of categories) {
            // Fetch 8 featured products for each category
            
            const productList = await Product.find({ category: category._id, ...filter })
                                              .limit(10)
                                              .populate('category');
                 

            // Map fetched products to desired format
            let products = productList.map((product) => ({
                ...product._doc,
                category: product.category.name,
            }));

            // Push category with its products to result array
            if(products.length>0){

                categoryProducts.push({
                    categoryName: category.name,
                    categoryColor: category.color,
                    categoryId: category._id,
                    products: products,
                });
            }
        }

        res.status(200).send(categoryProducts);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


router.get(`/:id`, async (req, res) => {
    let product;
    console.log(req.params.id,"asdasd")
    if(req.params.id){
     product = await Product.findById(req.params.id).populate('category');
    }

    if (!product) {
        res.status(500).json({ success: false });
    }
    res.send(product);
});

// router.post(`/`, uploadOptions.single('file'), async (req, res) => {
//     const category = await Category.findById(req.body.category);
//     if (!category) return res.status(400).send('Invalid Category');

//     const file = req.file;
//     console.log("sadasdasd 1")
//     if (!file) return res.status(400).send('No image in the request');
//     console.log("sadasdasd 2")

//     const fileName = file.filename;
//     const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
//     let product = new Product({
//         name: req.body.name,
//         userId: req.body.userId,
//         description: req.body.description,
//         richDescription: req.body.richDescription,
//         image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
//         brand: req.body.brand,
//         price: req.body.price,
//         category: req.body.category,
//         countInStock: req.body.countInStock,
//         rating: req.body.rating,
//         numReviews: req.body.numReviews,
//         isFeatured: req.body.isFeatured
//     });

//     product = await product.save();

//     if (!product) return res.status(500).send('The product cannot be created');

//     res.send(product);
// });

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const file = req.file;
    console.log('sadasdasd 1');
    if (!file) return res.status(400).send('No image in the request');
    console.log('sadasdasd 2',req.body,  sanitizeHtml(req.body.description, { allowedTags: [], allowedAttributes: {} }));

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let htmlSnippet =req.body.description ;

// Convert HTML snippet into a single line string enclosed in double quotes
let formattedHtml =   htmlSnippet.replace(/\n|\r/g, '').replace(/"/g, '\\"') 

console.log(formattedHtml);
if (req.body.attributes && typeof req.body.attributes === 'string') {
    req.body.attributes = JSON.parse(req.body.attributes);
  }
  if (req.body.isFeatured === 'null' || req.body.isFeatured === null) {
    req.body.isFeatured = false;
} else {
    req.body.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
}

if (req.body.tag === 'null' || req.body.tag === null) {
    req.body.tag = false;
} else {
    req.body.tag = req.body.tag === 'true' || req.body.tag === true;
}

    let product = new Product({
        name: req.body.name,
        userId: req.body.userId,
        description:  formattedHtml,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured ?? false,
        tag: req.body.tag ?? false,
        tagText: req.body.tagText,
        tagText: req.body.tagText,
        attributes: req.body.attributes,
    });

    product = await product.save();

    if (!product) return res.status(500).send('The product cannot be created');

    res.send(product);
});

router.put('/:id', upload.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send('Invalid Product!');

    if (req.body.isFeatured === 'null' || req.body.isFeatured === null) {
        req.body.isFeatured = false;
    } else {
        req.body.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
    }
    
    if (req.body.tag === 'null' || req.body.tag === null) {
        req.body.tag = false;
    } else {
        req.body.tag = req.body.tag === 'true' || req.body.tag === true;
    }
    

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = product.image;
    }
    let htmlSnippet =req.body.description ;

    // Convert HTML snippet into a single line string enclosed in double quotes
    let formattedHtml =   htmlSnippet.replace(/\n|\r/g, '').replace(/"/g, '\\"') 

    if (req.body.attributes && typeof req.body.attributes === 'string') {
        req.body.attributes = JSON.parse(req.body.attributes);
      }
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            userId: req.body.userId,
            description:formattedHtml,
            richDescription: req.body.richDescription,
            image: imagepath,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
            tag: req.body.tag,
            tagText: req.body.tagText,
            desRate: req.body.desRate,
            attributes:req.body.attributes
        },
        { new: true }
    );

    if (!updatedProduct) return res.status(500).send('the product cannot be updated!');

    res.send(updatedProduct);
});

router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id)
        .then((product) => {
            if (product) {
                return res.status(200).json({
                    success: true,
                    message: 'the product is deleted!'
                });
            } else {
                return res.status(404).json({ success: false, message: 'product not found!' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ success: false, error: err });
        });
});

router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments((count) => count);

    if (!productCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        productCount: productCount
    });
});

router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(+count);

    if (!products) {
        res.status(500).json({ success: false });
    }
    res.send(products);
});

router.put('/gallery-images/:id', upload.array('images', 10), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {
        files.map((file) => {
            imagesPaths.push(`${basePath}${file.filename}`);
        });
    }

    if(req.body.video){
        imagesPaths.push(req.body.video)
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPaths
        },
        { new: true }
    );

    if (!product) return res.status(500).send('the gallery cannot be updated!');

    res.send(product);
});

module.exports = router;
