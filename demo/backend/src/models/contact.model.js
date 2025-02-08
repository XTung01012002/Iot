const { model, Schema } = require("mongoose");

const contactSchema = new Schema(
  {
    name: String,
    phone: String,
    email: String,
    website: String,
    bitrixId: { type: String, required: true },
    address: {
      ward: String,
      district: String,
      city: String,
    },
    bank: {
      name: String,
      account: String,
    },
  },
  { timestamps: true }
);

module.exports = { contactSchema: model("contact", contactSchema) };
