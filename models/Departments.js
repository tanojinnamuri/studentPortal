const mongoose = require("mongoose");
const departmentSchema = mongoose.Schema(
  {
    DepartmentName: {
      type: String,
      required: true,
    },
    DepartmentID: {
      type: Number,
      required: true,
      unique: true,
    },
    Color: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

departmentSchema.method("getAlldepartments", async function () {
  let Department = this.model("Department");

  return await Department.find();
});
module.exports = mongoose.model("Department", departmentSchema);

