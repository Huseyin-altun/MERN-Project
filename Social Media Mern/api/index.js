const express = require("express"); // express cerveve 
const app = express();
const mongoose = require("mongoose"); // ODM
const dotenv = require("dotenv"); // env dosyası kalıcı sabıt baglantılar process ıle
const helmet = require("helmet"); // Express guvenlık
const morgan = require("morgan"); // consolda ısteklerı gorme
const multer = require("multer"); // dosya ıslemlerı
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const router = express.Router(); // yonlednıırme 
const path = require("path"); // dosya yolu 

dotenv.config(); // enc yapılandırma 

mongoose.connect(
  process.env.MONGO_URL, // verıtabanı baglantısı
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to ODM");
  }
);
app.use("/images", express.static(path.join(__dirname, "public/images"))); // STATIC DOSYA TANIMI

//ARA YAZILIMLAR
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.listen(8800, () => {
  console.log("Server is runned ! ");
});
