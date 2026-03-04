const mongoose = require("mongoose");

let conn = null;

// Connect to MongoDB
const connectDB = async () => {
  if (conn) return conn;
  conn = await mongoose.connect(process.env.MONGO_URI);
  return conn;
};

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    await connectDB();

    const { name, email, password } = req.body;

    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
    });

    const User = mongoose.models.User || mongoose.model("User", userSchema);

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(200).json({ message: "User Registered Successfully ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};