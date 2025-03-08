const { Tailor } = require('../models/tailor');
const express = require('express');
const { Category } = require('../models/category');
const { tailor } = require('../constant/constant');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const { product } = require('../constant/constant');
// const usersRoutes = require("./users");
const {User} = require('../models/user');
const sanitizeHtml = require('sanitize-html');
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};
const bcrypt = require('bcryptjs');
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
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let searchQuery = req.query.search || '';
    let query = {};

    if (searchQuery) {
        query = { name: { $regex: searchQuery, $options: 'i' } };
    }
    const tailorList = await Tailor.find(query).populate('category').populate('userId')
        .skip((page - 1) * limit)
        .limit(limit);
    if (!tailorList) {
        res.status(500).json({ success: false });
    }
    const categoryCount = await Tailor.countDocuments(query);
    // const [d] = await this.userRepository.query(`EXEC GetModuleConfiguration @0`, [param1])
    let data = tailorList.map((data) => {
        return {
            id: data._id ?? '-',
            Name: data.name,
            Price: data.price,
            Image: data.image,
            numProjects:data.numProjects,
            category: data.category?.name ?? '',
            categoryId: data.category?.id ?? '',
            ...data._doc
        };
    });
    d = tailor;

    let data1 = [data, d, { total: categoryCount, page, limit }];
    res.status(200).send(data1);
});

router.get(`/:id`, async (req, res) => {
    let product;
    console.log(req.params.id, 'asdasd');
    if (req.params.id) {
        product = await Tailor.findById(req.params.id).populate('category');
    }

    if (!product) {
        res.status(500).json({ success: false });
    }
    res.send(product);
});



router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');
    // console.log(
    //     'user 123',
    //     req.body
    // );

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let htmlSnippet = req.body.description;

    // Convert HTML snippet into a single line string enclosed in double quotes
    let formattedHtml = htmlSnippet.replace(/\n|\r/g, '').replace(/"/g, '\\"');

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: 0,
        street: req.body.address,
        apartment: req.body.address,
        zip: '54000',
        city: 'lahore',
        country: 'pakistan'
    });
    // console.log(user,"user")

    user = await user.save();
    console.log(user,"user123123")
    if (!user) return res.status(400).send('The user cannot be created!');



    // console.log(formattedHtml,"make user");
    let product = new Tailor({
        name: req.body.name,
        userId: user._id,
        description: formattedHtml,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    });

    product = await product.save();

    if (!product) return res.status(500).send('The tailor cannot be created');

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
            isFeatured: req.body.isFeatured
        },
        { new: true }
    );

    if (!updatedProduct) return res.status(500).send('the product cannot be updated!');

    res.send(updatedProduct);
});

router.delete('/:id', (req, res) => {
    Tailor.findByIdAndRemove(req.params.id)
        .then((product) => {
            if (product) {
                return res.status(200).json({
                    success: true,
                    message: 'the tailor is deleted!'
                });
            } else {
                return res.status(404).json({ success: false, message: 'tailor not found!' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ success: false, error: err });
        });
});

// router.get(`/get/count`, async (req, res) => {
//     const productCount = await Product.countDocuments((count) => count);

//     if (!productCount) {
//         res.status(500).json({ success: false });
//     }
//     res.send({
//         productCount: productCount
//     });
// });

// router.get(`/get/featured/:count`, async (req, res) => {
//     const count = req.params.count ? req.params.count : 0;
//     const products = await Product.find({ isFeatured: true }).limit(+count);

//     if (!products) {
//         res.status(500).json({ success: false });
//     }
//     res.send(products);
// });

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

    const product = await Tailor.findByIdAndUpdate(
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
