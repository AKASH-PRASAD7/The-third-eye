const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const personschema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    contact: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    ismale: {
      type: Boolean,
    },
    link: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("person", personschema);
