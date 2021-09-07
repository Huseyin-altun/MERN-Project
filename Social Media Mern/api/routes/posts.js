const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//Post Olusturma

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);// post edılen verılerı tamamını al 
  try {
    const savedPost = await newPost.save();// veritabanına kaydet
    res.status(200).json(savedPost); 
  } catch (err) {
    res.status(500).json(err);
  }
});
//Post Gunceleme

router.put("/:id", async (req, res) => { // İd sine gore 
  try {
    const post = await Post.findById(req.params.id);// parametreden gelen verı verıtabanındakı ıd ıle getır 
    if (post.userId === req.body.userId) { // ve kullanıcının yolladıgı ıd ıle verıtabanındakı ıd uyustuysa
      await post.updateOne({ $set: req.body }); //tum verılerı guncele 
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//Post Silme

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//Beğen Beğenme

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);// parametreden gelen id verıtabanındakı getır
    if (!post.likes.includes(req.body.userId)) {// post edınlen id   veritabanındakı begenı dızısınde  yoksa
      await post.updateOne({ $push: { likes: req.body.userId } }); // likes dizine kullanıcı ıd sını ekle
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });// likes dizine kullanıcı ıd sını sil
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//Posta Git

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);// parametreyle uyusan ıd al  ve getır 
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Paylasılan takıpcı akısı  ve kendı postları

router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);// parametreye gıren id al kullanıcdan 
    const userPosts = await Post.find({ userId: currentUser._id });// o id eğer post atılen kullanıcı ıd ıle bul 
    const friendPosts = await Promise.all( // 
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });// takığ edenleri gez ve id gore user id eselesenleri dondur 
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));// sonuca donen verılerıde ekle ve goster
  } catch (err) {
    res.status(500).json(err);
  }
});

//Kullanıcının tum postları

router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
