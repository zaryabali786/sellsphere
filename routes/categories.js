const { Category } = require('../models/category');
const { category } = require('../constant/constant');
const express = require('express');
const router = express.Router();
const multer = require('multer');

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
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let searchQuery = req.query.search || '';
    let query = {};

    if (searchQuery) {
        query = { name: { $regex: searchQuery, $options: 'i' } };
    }
    const categoryList = await Category.find(query)
        .skip((page - 1) * limit)
        .limit(limit);
    if (!categoryList) {
        res.status(500).json({ success: false });
    }
    const categoryCount = await Category.countDocuments(query);
    // const [d] = await this.userRepository.query(`EXEC GetModuleConfiguration @0`, [param1])
    let data = categoryList.map((data) => {
        return {
            id: data._id ?? '-',
            Name: data.name,
            Icon: data.icon,
            Color: data.color,
            Image: data.image,
            ...data._doc
        };
    });
    d = category;

    let data1 = [data, d, { total: categoryCount, page, limit }];
    res.status(200).send(data1);
});

router.get(`/dropdown`, async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false });
    }

    res.status(200).send(categoryList);
});

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(500).json({ message: 'The category with the given ID was not found.' });
    }
    res.status(200).send(category);
});

router.post('/', uploadOptions.single('image'), async (req, res) => {
    console.log(req.body, 'Asdasd');
    const file = req.file;
    console.log('sadasdasd 1');
    if (!file) return res.status(400).send('No image in the request');
    console.log('sadasdasd 2');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
        image: `${basePath}${fileName}`
    });
    category = await category.save();

    if (!category) return res.status(400).send('the category cannot be created!');

    res.send(category);
});

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    console.log('ASDASDas');
    const file = req.file;
    let fileName = null;
    let basePath = null;
    let newImage = '';

    if (file) {
        fileName = file.filename;
        basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        newImage = `${basePath}${fileName}`;
    }else{
        console.log(req.body.image)
        newImage=req.body.image;
    }

    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon || category.icon,
            color: req.body.color,
            image: newImage
        },
        { new: true }
    );

    if (!category) return res.status(400).send('the category cannot be created!');

    res.send(category);
});

router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then((category) => {
            if (category) {
                return res.status(200).json({ success: true, message: 'the category is deleted!' });
            } else {
                return res.status(404).json({ success: false, message: 'category not found!' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ success: false, error: err });
        });
});

router.put('/image/:id', upload.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Category Id');
    }

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    }

    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            image: imagepath
        },
        { new: true }
    );

    if (!category) return res.status(500).send('the category cannot be updated!');

    res.send(category);
});

module.exports = router;
