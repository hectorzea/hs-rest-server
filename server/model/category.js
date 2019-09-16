const moongose = require("mongoose");
let Schema = moongose.Schema;

const CategorySchema = new Schema({
  name: {
    unique: true,
    type: String,
    required: [true, "Category Name is required"]
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = moongose.model("Category", CategorySchema);
