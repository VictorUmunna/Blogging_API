const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcrypt = require("bcrypt");
// 1. Users should have a first_name, last_name, email, password, (you can add other
//     attributes you want to store about the user)
const userSchema = new schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },

  first_name: {
    type: String,
    required: [true, "first name is required"],
  },
  last_name: {
    type: String,
    required: [true, "last name is required"],
  },
  article: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "articles",
    },
  ],
});

userSchema.pre("save", async function (next) {
  const user = this;
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    //   returnedObject.id = returnedObject._id.toString()
    //   delete returnedObject._id
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("user", userSchema);