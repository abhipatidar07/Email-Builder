const express = require("express");
const { layoutEmail } = require("./template/layout");
const database = require("./config/database");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

database.connect();

const upload = multer({ dest: "uploads/" });

// app.post("/uploadImage", upload.single("image"), (req, res) => {
//   const file = req.file;
//   const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
//     file.filename
//   }`;
//   res.json({ url: imageUrl });
// });
app.post("/uploadImage", upload.single("image"), (req, res) => {
  const file = req.file;
  // Dynamically replace the protocol and host if in production
  const host = process.env.NODE_ENV === "production" ? "https://email-builder-five-wheat.vercel.app" : req.get("host");
  const imageUrl = `${req.protocol}://${host}/uploads/${file.filename}`;
  res.json({ url: imageUrl });
});


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

let emailTemplate = {
  title: "Welcome!",
  logo: "https://via.placeholder.com/150",
  name: "User",
  image: "https://via.placeholder.com/600",
  footer: "Your Company",
  content: "Thank you for joining us. We're excited to have you!",
};

app.get("/getEmailLayout", (req, res) => {
  res.json(emailTemplate);
});

const emailTemplateSchema = new mongoose.Schema(
  {
    title: String,
    logo: String,
    name: String,
    image: String,
    footer: String,
    content: String,
  },
  { timestamps: true }
);

const EmailTemplate = mongoose.model("EmailTemplate", emailTemplateSchema);

app.post("/uploadEmailConfig", async (req, res) => {
  try {
    const newTemplate = new EmailTemplate(req.body);
    await newTemplate.save();
    res.status(201).json({ message: "Template saved successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error saving template.", error: err });
  }
});

app.get("/renderAndDownloadTemplate", async (req, res) => {
  try {
    const templates = await EmailTemplate.find();
    res.status(200).json(templates);
    console.log("Bill aa gye");
  } catch (err) {
    res.status(500).json({ message: "Error fetching templates.", error: err });
  }
});

app.delete("/renderAndDownloadTemplate/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await EmailTemplate.findByIdAndDelete(id);
    res.status(200).json({ message: "Template deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting template.", error: err });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
