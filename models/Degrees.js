const mongoose = require("mongoose");
const degreeSchema = mongoose.Schema(
  {
    DegreeName: {
      type: String,
      required: true,
    },
    DegreeID: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

degreeSchema.method("getAlldegrees", async function () {
  let Degree = this.model("Degree");

  return await Degree.find();
});
module.exports = mongoose.model("Degree", degreeSchema);

