const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");// şifreleme hash

//Kaydol
router.post("/register", async (req, res) => {
  try {
    //şifreleme
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //yeni kullanıcı oluştur
    const newUser = new User({
      username: req.body.username,//post edilen veri 
      email: req.body.email,//post edilen veri 
      password: hashedPassword,// post edilip hashlenen veri 
    });

    //save user and respond
    const user = await newUser.save();// veriyi kaydet
    res.status(200).json(user); // statusu 200 ise kulanıcıyı dondur 
  } catch (err) {
    res.status(500).json(err) // sorun olustuysa hatayı dondur
  }
});

//Giriş
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });// Post edılen emaıl verıtabanında uyusan ılk verıyı getır
    !user && res.status(404).json("user not found"); // user null ıse ve 404 donduyse kullanıcı bulunamadı de

    const validPassword = await bcrypt.compare(req.body.password, user.password)// Post edılen verıyı cozumle ve karsılastır 
    !validPassword && res.status(400).json("wrong password")// null ise ve statu kodu 400 ise yanlıs sıfre de

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
