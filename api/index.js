const mongoose = require("mongoose");

let conn = null;

// Connect to MongoDB
const connectDB = async () => {
  if (conn) return conn;
  conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/yummycart");
  return conn;
};

// Serverless handler
module.exports = async (req, res) => {
  await connectDB();

  const { method, url, body } = req;

  // ---------------- REGISTER ----------------
  if (method === "POST" && url === "/api/register") {
    const { name, email, password } = body;

    const userSchema = new mongoose.Schema({ name: String, email: String, password: String });
    const User = mongoose.models.User || mongoose.model("User", userSchema);

    const newUser = new User({ name, email, password });
    await newUser.save();

    return res.status(200).json({ message: "User Registered Successfully ✅" });
  }

  // ---------------- LOGIN ----------------
  if (method === "POST" && url === "/api/login") {
    const { email, password } = body;

    const userSchema = new mongoose.Schema({ name: String, email: String, password: String });
    const User = mongoose.models.User || mongoose.model("User", userSchema);

    const user = await User.findOne({ email, password });

    if (user) return res.status(200).json({ message: "Login Successful ✅" });
    else return res.status(400).json({ message: "Invalid Credentials ❌" });
  }

  res.status(404).json({ message: "Route Not Found ❌" });
};