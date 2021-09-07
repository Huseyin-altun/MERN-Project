import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);// Boş bir dizi baslangıc 
  const { user } = useContext(AuthContext);//Oturum contexti(Session)

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username// gelen prompt
        ? await axios.get("/posts/profile/" + username)// eüer null degılse profile
        : await axios.get("posts/timeline/" + user._id);// eğer null ise vt id'e get ıstegınde bulunur
      setPosts(
        res.data.sort((p1, p2) => {// sırala
          return new Date(p2.createdAt) - new Date(p1.createdAt);// tarihe gore
        })
      );
    };
    fetchPosts();
  }, [username, user._id]);// bu veriler aynıysa yenılenmesin

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
