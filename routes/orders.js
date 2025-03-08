module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("User connected to orders:", socket.id);
  });

const { Order } = require("../models/order");
const  Visit  = require("../models/userVisitor");

const express = require("express");
const { OrderItem } = require("../models/order-item");
const router = express.Router();
const { upload } = require('../helpers/upload-file')
const { order } = require('../constant/constant');

router.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "File upload failed" });
    }
    res.status(200).json({ success: true, message: "File uploaded successfully" });
  });
});

router.get(`/`, async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  let searchQuery = req.query.search || '';
  let isRead = req.query.isRead === 'false' ? false : undefined;


  let query = {};

  if (isRead !== undefined) {
    query.isRead = isRead; // Filter only unread orders if isRead=false
}

  if (searchQuery) {
      query = { name: { $regex: searchQuery, $options: 'i' } };
  }

  
  
  
  const orderList = await Order.find(query)
    .populate("user", "name")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    res.status(500).json({ success: false });
  }

  let data = orderList.map((data) => {
    return {
        ...data._doc,
        id: data._id ?? '-',
        Name: data?.name ?? '',
        Price: data.price ?? '',
        category: data.category?.name ?? '',
        categoryId: data.category?.id ?? '',
    };
});






let totalCount = await Order.countDocuments(query);

d = order;
let data1 = [data, d,{ total: totalCount, page, limit }];
res.status(200).send(data1);
});


router.put(`/read/:id`, async (req, res) => {
  try {
      const order = await Order.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });

      if (!order) {
          return res.status(404).json({ success: false, message: "Order not found" });
      }

      res.status(200).json({ success: true, message: "Order marked as read", order });
  } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


router.put(`/read-all`, async (req, res) => {
  try {
      await Order.updateMany({ isRead: false }, { isRead: true });

      res.status(200).json({ success: true, message: "All orders marked as read" });
  } catch (error) {
      console.error("Error updating orders:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});




router.get(`/:id`, async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
});

// router.post("/", async (req, res) => {
//   const orderItemsIds = Promise.all(
//     req.body.orderItems.map(async (orderitem) => {
//       let newOrderItem = new OrderItem({
//         quantity: orderitem.quantity,
//         product: orderitem.product,
//       });

//       newOrderItem = await newOrderItem.save();

//       return newOrderItem._id;
//     })
//   );

//   const orderItemsIdsResolved = await orderItemsIds;

//   const totalPrices = await Promise.all(
//     orderItemsIdsResolved.map(async (orderItemId) => {
//       const orderItem = await OrderItem.findById(orderItemId).populate(
//         "product",
//         "price"
//       );

//       const totalPrice = orderItem.product.price * orderItem.quantity;

//       return totalPrice;
//     })
//   );

//   const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

//   console.log(totalPrices);

//   let order = new Order({
//     orderItems: orderItemsIdsResolved,
//     shippingAddress1: req.body.shippingAddress1,
//     shippingAddress2: req.body.shippingAddress2,
//     city: req.body.city,
//     zip: req.body.zip,
//     country: req.body.country,
//     phone: req.body.phone,
//     status: req.body.status,
//     totalPrice: totalPrice,
//     // user: req.body.user,
//   });
//   order = await order.save();

//   if (!order) return res.status(400).send("the order cannot be created!");

//   res.status(200).send(order);
// });


router.post("/", async (req, res) => {
  try {
      // Save OrderItems first
      const  {sessionId}  = req.body;

      let visitorId = null; // Default to null if sessionId is not provided

      if (sessionId) {
        // Find visitor using sessionId if provided
        const visit = await Visit.findOne({ sessionId });

        if (visit) {
          visitorId = visit._id; // Set visitorId if found
        }
      }
      const orderItemsIds = await Promise.all(
          req.body.orderItems.map(async (orderItem) => {
              let newOrderItem = new OrderItem({
                  productId: orderItem.productId,
                  name: orderItem.name,
                  image: orderItem.image,
                  selectedVariation: orderItem.selectedVariation || {}, // Handle optional variations
                  quantity: orderItem.quantity,
                  unitPrice: orderItem.unitPrice,
                  itemPrice: orderItem.itemPrice,
                  totalPrice: orderItem.totalPrice,
              });

              newOrderItem = await newOrderItem.save();
              return newOrderItem._id;
          })
      );

      // Calculate total order price
      const totalPrice = req.body.orderItems.reduce((acc, item) => {
          return acc + item.unitPrice * item.quantity;
      }, 0);

      // Create new order
      let order = new Order({
          orderItems: orderItemsIds,
          shippingAddress1: req.body.shippingAddress1,
          shippingAddress2: req.body.shippingAddress2,
          city: req.body.city,
          zip: req.body.zip,
          country: req.body.country,
          phone: req.body.phone,
          status: req.body.status || "Pending",
          totalPrice: totalPrice,
          dateOrdered: new Date(),
          isRead:false ,
          visitorId:visitorId
      });

      order = await order.save();

      if (!order) return res.status(400).send("The order cannot be created!");
      io.emit("newOrder", order);
      res.status(200).send(order);
  } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).send("Internal Server Error");
  }
});

router.patch("/:id", async (req, res) => {
  console.log(req.params.id,req.body.status)
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!order) return res.status(400).send("the order cannot be update!");

  res.send(order);
});

router.delete("/:id", (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "the order is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "order not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);

  if (!totalSales) {
    return res.status(400).send("The order sales cannot be generated");
  }

  res.send({ totalsales: totalSales.pop().totalsales });
});

router.get(`/get/count`, async (req, res) => {
  const orderCount = await Order.countDocuments((count) => count);

  if (!orderCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    orderCount: orderCount,
  });
});

router.get(`/get/userorders/:userid`, async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userid })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 });

  if (!userOrderList) {
    res.status(500).json({ success: false });
  }
  res.send(userOrderList);
});

return router; 
}