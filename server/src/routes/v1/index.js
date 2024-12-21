const express = require("express");
const userRoutes = require("./userRoutes");
const eventRoutes = require("./eventRoutes");
const categoryRoutes = require("./categoryRoutes");
const orderRoutes = require("./orderRoutes");

const router = express.Router();

router.use("/users", userRoutes);

router.use("/events", eventRoutes);

router.use("/categories", categoryRoutes);

router.use("/orders", orderRoutes);


module.exports = router;