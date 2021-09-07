import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@material-ui/icons";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Share() {
  const { user } = useContext(AuthContext);// session 
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef(); // acıklama referans
  const [file, setFile] = useState(null); // baslangıcta null 

  const submitHandler = async (e) => {
    e.preventDefault();// sayfa yenıleme
    const newPost = {
      userId: user._id, // sesıondan gelen id 
      desc: desc.current.value, // referanstan gelen verırının degeri 
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;//  dosya ısmı sımdıkı tarıhle olusturulur 
      data.append("name", fileName);// ısım ve dosya eklenır 
      data.append("file", file);
      newPost.img = fileName; // dpsya ısmı posta eklenir 
      console.log(newPost);
      try {
        await axios.post("/upload", data); // dosya yukle veri olarakta data gonderiyoruz
      } catch (err) {}
    }
    try {
      await axios.post("/posts", newPost); // postan verıyı eklıyıyoruz
      window.location.reload(); 
    } catch (err) {}
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
          <input
            placeholder={"Bugün Ne düşünüyorsun " + user.username + " ?"}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Fotoğraf Yada Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="red" className="shareIcon" />
              <span className="shareOptionText">Etiket</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="yellow" className="shareIcon" />
              <span className="shareOptionText">Konum</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="gold" className="shareIcon" />
              <span className="shareOptionText">İfadeler</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Paylaş
          </button>
        </form>
      </div>
    </div>
  );
}
