const {model} = require("mongoose");

const {holdingSchema} = require("../schemas/holdingSchema");

const holdingsModel = new model("holding", holdingSchema);

module.exports = {holdingsModel};