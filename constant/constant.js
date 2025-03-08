const category = [
    {
        name: 'Image',
        show: true,
        type: 'Image',
        length: '1000',
        width: 100,
        minWidth: 100,
        sortable: true
    },
    {
        name: 'Name',
        show: true,
        type: 'varchar',
        length: '50',
        width: 100,
        minWidth: 100,
        sortable: true
    },
    {
        name: 'Icon',
        show: true,
        type: 'varchar',
        length: '50',
        width: 100,
        minWidth: 100,
        sortable: true
    },
    {
        name: 'Color',
        show: true,
        type: 'varchar',
        length: '50',
        width: 100,
        minWidth: 100,
        sortable: true
    },
    {
        name: 'ACTIONS',
        show: true,
        type: 'icons',
        length: '',
        isFilterable: false,
        sortable: false,
        width: 100,
        minWidth: 100
    }
];

const product = [
    {
        name: 'Image',
        show: true,
        type: 'Image',
        length: '1000',
        width: 100,
        minWidth: 100,
        sortable: true
    },
    {
        name: 'Name',
        show: true,
        type: 'varchar',
        length: '50',
        width: 100,
        minWidth: 100,
        sortable: true
    },
    {
        name: 'category',
        show: true,
        type: 'varchar',
        length: '1000',
        width: 100,
        minWidth: 100,
        sortable: true
    },
    {
        name: 'Price',
        show: true,
        type: 'varchar',
        length: '1000',
        width: 100,
        minWidth: 100,
        sortable: true
    },

    {
        name: 'ACTIONS',
        show: true,
        type: 'icons',
        length: '',
        isFilterable: false,
        sortable: false,
        width: 100,
        minWidth: 100
    }
];

// city: 'lahore';
// country: 'pakistan';
// dateOrdered: '2024-03-14T15:24:13.949Z';
// id: '65f3169dcac17c11acd89928';
// orderItems: ['65f3169dcac17c11acd89920', '65f3169dcac17c11acd89921'];
// phone: '3,044,954,013';
// shippingAddress1: 'hafeez street';
// shippingAddress2: 'lahore bund road';
// status: '0';
// totalPrice: 200;

const order = [
    {
        name: 'country',
        show: true,
        type: 'varchar',
        length: '50',
        width: 100,
        minWidth: 100,
        sortable: true
    },
    {
        name: 'city',
        show: true,
        type: 'varchar',
        length: '1000',
        width: 100,
        minWidth: 100,
        sortable: true
    },
    {
        name: 'totalPrice',
        show: true,
        type: 'varchar',
        length: '1000',
        width: 100,
        minWidth: 100,
        sortable: true
    },
    {
        name: 'status',
        show: true,
        type: 'varchar',
        length: '1000',
        width: 100,
        minWidth: 100,
        sortable: true
    },

    {
        name: 'ACTIONS',
        show: true,
        type: 'icons',
        length: '',
        isFilterable: false,
        sortable: false,
        width: 100,
        minWidth: 100
    }
];


const tailor = [
    {
        name: 'Image',
        show: true,
        type: 'Image',
        length: '50',
        width: 100,
        minWidth: 100,
        sortable: true
    },
    {
        name: 'Name',
        show: true,
        type: 'varchar',
        length: '50',
        width: 100,
        minWidth: 100,
        sortable: true
    },
    {
        name: 'Price',
        show: true,
        type: 'varchar',
        length: '1000',
        width: 100,
        minWidth: 100,
        sortable: true
    },

    {
        name: 'numProjects',
        show: true,
        type: 'varchar',
        length: '1000',
        width: 100,
        minWidth: 100,
        sortable: true
    },

    {
        name: 'ACTIONS',
        show: true,
        type: 'icons',
        length: '',
        isFilterable: false,
        sortable: false,
        width: 100,
        minWidth: 100
    }
];

module.exports = { category, product, order ,tailor};
