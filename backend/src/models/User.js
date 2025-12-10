const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["owner", "customer", "admin"], default: "customer" },

    phone: { type: String, default: "" },
    profilePicture: { type: String, default: "" },

    // New editable fields
    address: { type: String, default: "" },
    nicNumber: { type: String, default: "" },
    birthday: { type: Date, default: null },
    drivingLicenseNumber: { type: String, default: "" },
    policies: {
      insurance: { type: String, default: "" },
      cancellation: { type: String, default: "" },
      additionalRules: { type: String, default: "" },
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
    googleId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
