const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//Kullanıcı Guncele
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) { // kullanıcı ıd parametreden yada body gelen admın ıse 
    if (req.body.password) {// eger bos degılse
      try {
        const salt = await bcrypt.genSalt(10);// hashle
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {// parametreye gore tum verılerı guncele
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//Kullanıcı sıl 
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {// admın yada verılen parametre sahıp ise
    try {
      await User.findByIdAndDelete(req.params.id); // Veriyi sil
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

//Bir kullanıcı getir
router.get("/", async (req, res) => {
  const userId = req.query.userId;// gönderilen sorgunun id al 
  const username = req.query.username;// gönderilen sorgunun adını  al 
  try {
    const user = userId //true ıse 
      ? await User.findById(userId)// veritabanındakı verı ıle ıd uyusursa al 
      : await User.findOne({ username: username }); // uyusmazsa kullanıcı adını al 
    const { password, updatedAt, ...other } = user._doc; // ıstemedıgımız verılerı sectık 
    res.status(200).json(other);// gerıye kalanlar gosterılecek
  } catch (err) {
    res.status(500).json(err);
  }
});

//Arkadas getir 
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);// parametreyle uyusan kullanıcı al
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId); // takıp edılenlerden ıd uyusanı sec ve dondur 
      })
    );
    let friendList = [];// bos bır arkadas lıstesı olustur
    friends.map((friend) => { // donen arkadas ıdleri maple 
      const { _id, username, profilePicture } = friend; // bu bılgılerı tut 
      friendList.push({ _id, username, profilePicture }); // listeye ekle
    });
    res.status(200).json(friendList) // listeyi goster
  } catch (err) {
    res.status(500).json(err);
  }
});

//Takıp Eden Kullanıcılar

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {// post edılen parametreyle esıt degılse 
    try {
      const user = await User.findById(req.params.id); //id al parametredekı
      const currentUser = await User.findById(req.body.userId); // kullanıcı parametresını al
      if (!user.followers.includes(req.body.userId)) { // dızıde ara 
        await user.updateOne({ $push: { followers: req.body.userId } }); // ekle 
        await currentUser.updateOne({ $push: { followings: req.params.id } }); // ekle ıkısınede 
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//Takıpten cık (Aynı ıslemler sadece pull olacak)

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});

module.exports = router;
