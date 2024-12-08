const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  item_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  availability: { type: Boolean, default: true },
  image: {
    data: { type: String, default: null }, // Optional image data
    contentType: { type: String, default: null }, // Optional image content type
  },
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
