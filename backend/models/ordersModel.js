const {model} = require("mongoose");

const {orderSchema} = require("../schemas/orderSchema");

const ordersModel = new model("order", orderSchema);

module.exports = {ordersModel};