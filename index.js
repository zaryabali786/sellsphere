// // const express = require("express");
// // const app = express();
// // const bodyParser = require("body-parser"); // Import body-parser
// // const morgan = require("morgan");
// // const mongoose = require("mongoose");
// // const cors = require("cors");
// // require("dotenv/config");
// // const authJwt = require("./helpers/jwt");
// // const errorHandler = require("./helpers/error-handler");

// // app.use(cors());
// // app.options("*", cors());
// // console.log("12")

// // // Use body-parser middleware to handle larger request bodies
// // app.use(bodyParser.json({ limit: '50mb' })); // Increase size limit as needed
// // app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })); // Increase size limit as needed

// // app.use(morgan("tiny"));
// // app.use(authJwt());
// // app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
// // app.use(errorHandler);
// // console.log("1")

// // //Routes
// // const categoriesRoutes = require("./routes/categories");
// // const productsRoutes = require("./routes/products");
// // const usersRoutes = require("./routes/users");
// // const ordersRoutes = require("./routes/orders");
// // const tailorsRoute = require("./routes/tailor");

// // const commentRoutes = require("./routes/comments");
// // console.log("123")

// // const api = process.env.API_URL;

// // app.use(`${api}/categories`, categoriesRoutes);
// // app.use(`${api}/products`, productsRoutes);
// // app.use(`${api}/users`, usersRoutes);
// // app.use(`${api}/comments`, commentRoutes);
// // app.use(`${api}/orders`, ordersRoutes);
// // app.use(`${api}/tailors`, tailorsRoute);

// // //Database
// // mongoose
// //   .connect(process.env.CONNECTION_STRING, {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// //     dbName: "mean-eshop",
// //   })
// //   .then(() => {
// //     console.log("Database Connection is ready...");
// //   })
// //   .catch((err) => {
// //     console.log(err)
// //   });

// // //Server
// // app.listen(3000, () => {
// //   console.log("server is running http://localhost:3000");
// // });

// const express = require("express");
// const app = express();
// const http = require("http"); // Import http module
// const server = http.createServer(app); // Create server
// const { Server } = require("socket.io");
// const io = new Server(server, {
//   cors: {
//     origin: "*", // In production, set this to your frontend domain
//     methods: ["GET", "POST"],
//   },
// });

// const bodyParser = require("body-parser");
// const morgan = require("morgan");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv/config");
// const authJwt = require("./helpers/jwt");
// const errorHandler = require("./helpers/error-handler");

// app.use(cors());
// app.options("*", cors());

// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// app.use(morgan("tiny"));
// app.use(authJwt());
// app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
// app.use(errorHandler);

// //Routes
// const categoriesRoutes = require("./routes/categories");
// const productsRoutes = require("./routes/products");
// const usersRoutes = require("./routes/users");
// const ordersRoutes = require("./routes/orders")(io); // Pass io instance
// const tailorsRoute = require("./routes/tailor");
// const commentRoutes = require("./routes/comments");

// const api = process.env.API_URL;

// app.use(`${api}/categories`, categoriesRoutes);
// app.use(`${api}/products`, productsRoutes);
// app.use(`${api}/users`, usersRoutes);
// app.use(`${api}/comments`, commentRoutes);
// app.use(`${api}/orders`, ordersRoutes);
// app.use(`${api}/tailors`, tailorsRoute);

// //Database Connection
// mongoose
//   .connect(process.env.CONNECTION_STRING, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     dbName: "mean-eshop",
//   })
//   .then(() => {
//     console.log("Database Connection is ready...");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// // WebSocket Connection
// io.on("connection", (socket) => {
//   console.log("Admin connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("Admin disconnected:", socket.id);
//   });
// });

// // Start server with WebSocket support
// io.on("userConnected", (sessionId) => {
//   activeUsers.add(sessionId);
//   console.log(`User joined. Active users: ${activeUsers.size}`);
//   io.emit("updateUserCount", activeUsers.size); // Correct event name
// });

// io.on("userDisconnected", (sessionId) => {
//   activeUsers.delete(sessionId);
//   console.log(`User left. Active users: ${activeUsers.size}`);
//   io.emit("updateUserCount", activeUsers.size); // Correct event name
// });

// server.listen(3000, () => {
//   console.log("Server is running on http://localhost:3000");
// });
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: '*', // In production, change this to frontend domain
        methods: ['GET', 'POST']
    }
});
const Visit = require('./models/userVisitor'); // Import Visit Model
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

// Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders')(io);
const tailorsRoute = require('./routes/tailor');
const commentRoutes = require('./routes/comments');
const userVisitsRoutes = require('./routes/uservisit');
const themeRoutes = require('./routes/themeCustomization');

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/comments`, commentRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/tailors`, tailorsRoute);
app.use(`${api}/theme`, themeRoutes);
app.use(`${api}/visitor`, userVisitsRoutes); // Use the new route

// Database Connection
mongoose
    .connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'mean-eshop',
        // serverSelectionTimeoutMS: 300000, // ٹائم آؤ
    })
    .then(() => {
        console.log('Database Connection is ready...');
    })
    .catch((err) => {
        console.log(err,"asdasdasd");
    });
app.get("/", (req, res) =>{
    res.status(200).json({ message: "App is running."})
})

// require('./jobs/subscription.js'); 

const activeUsers = new Map(); // Tracks currently active users
const activeSessions = new Set(); // Tracks all-time unique sessions


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('userConnected', async (userData) => {
        const { sessionId, ip, country, city, latitude, longitude } = userData;
        const startTime = Date.now(); // Store session start time

        // ✅ Save Visit Data in Database (Avoid Duplicates)
        const existingVisit = await Visit.findOne({ sessionId });


        // ✅ If sessionId already exists, restore user instead of treating as new
   

        if (!existingVisit) {
            await Visit.create({ sessionId, ip, country, city, latitude, longitude, visitedAt: new Date() });
        io.emit('updateUserLocations', { sessionId, country, city, latitude, longitude });

        }

        // ✅ Store active user details with start time
        //new
        if (!activeUsers.has(sessionId)) {
            activeUsers.set(socket.id, { sessionId, startTime, country, city, latitude, longitude });
            activeSessions.add(sessionId);
        }
        //new end

        activeUsers.set(socket.id, { sessionId, startTime, country, city, latitude, longitude });

        // ✅ Track unique users
        activeSessions.add(sessionId);

        console.log(`User from ${sessionId}, ${country} joined. Active users: ${activeUsers.size}`);

        // ✅ Emit active users count
        io.emit('updateUserCount', activeUsers.size);
        io.emit('updateUserCountNotifcation', activeSessions.size);
        io.emit('activeUserLocations', Array.from(activeUsers.values()));
    });

    socket.on('userDisconnected', async () => {
        const userData = activeUsers.get(socket.id);
        if (userData) {
            const { sessionId, startTime } = userData;
            const endTime = Date.now();
            const duration = Math.round((endTime - startTime) / 60000); // Convert to minutes

            // ✅ Update user's duration in the database
            await Visit.findOneAndUpdate(
                { sessionId },
                { $inc: { duration } }, // Increment duration field
                { new: true }
            );

            //old activeUsers.delete(socket.id);

            //new
            if (activeUsers.has(socket.id)) {
                activeUsers.delete(socket.id);
                activeSessions.delete(socket.id);
            }


        }

        console.log('User disconnected:', socket.id);
        io.emit('updateUserCount', activeUsers.size);
    });

    socket.on('disconnect', async () => {
        const userData = activeUsers.get(socket.id);
        if (userData) {
            const { sessionId, startTime } = userData;
            const endTime = Date.now();
            const duration = Math.round((endTime - startTime) / 60000);

            await Visit.findOneAndUpdate(
                { sessionId },
                { $inc: { duration } },
                { new: true }
            );

            activeUsers.delete(socket.id);
        }

        console.log('User disconnected:', socket.id);
        io.emit('updateUserCount', activeUsers.size);
    });
});


// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);

//     socket.on('userConnected', async (userData) => {
//         const { sessionId, ip, country, city, latitude, longitude } = userData;

//         // ✅ Save Visit Data in Database (Avoid Duplicates)
//         const existingVisit = await Visit.findOne({ sessionId });
//         if (!existingVisit) {
//             await Visit.create({ sessionId, ip, country, city, latitude, longitude });
//         }

//         // ✅ Store active user details
//         activeUsers.set(socket.id, { sessionId, country, city, latitude, longitude });

//         // ✅ Track unique users (even if they disconnect later)
//         activeSessions.add(sessionId);

//         console.log(`User from ${sessionId}, ${country} joined. Active users: ${activeUsers.size}`);

//         // ✅ Emit active users count (only active users)
//         io.emit('updateUserCount', activeUsers.size);

//         // ✅ Emit total users count (all-time count)
//         io.emit('updateUserCountNotifcation', activeSessions.size);

//         // ✅ Emit currently active users array (for UI display)
//         io.emit('activeUserLocations', Array.from(activeUsers.values()));
//         io.emit('updateUserLocations', { sessionId, country, city, latitude, longitude });
//     });

//     socket.on('userDisconnected', () => {
//         activeUsers.delete(socket.id);
//         console.log('User disconnected:', socket.id);

//         // ✅ Emit active users count after disconnect
//         io.emit('updateUserCount', activeUsers.size);

//         // ✅ Emit updated active users array (only online users remain)
//         // io.emit('updateUserLocations', Array.from(activeUsers.values()));
        
//     });

//     socket.on('disconnect', () => {
//         activeUsers.delete(socket.id);
//         console.log('User disconnected:', socket.id);

//         // ✅ Emit active users count after disconnect
//         io.emit('updateUserCount', activeUsers.size);

//         // ✅ Emit updated active users array
//         io.emit('updateUserLocations', Array.from(activeUsers.values()));
//     });
// });



server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
