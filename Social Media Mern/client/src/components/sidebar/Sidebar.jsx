import "./sidebar.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  RssFeed,
  Chat,

  Bookmark,
  HelpOutline,
  WorkOutline,

} from "@material-ui/icons";
import { AuthContext } from "../../context/AuthContext";
import CloseFriend from "../closeFriend/CloseFriend";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/friends/" + user._id);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Akış</span>
          </li>
          <Link to="/messenger" style={{ textDecoration: "none" }}>
          <li className="sidebarListItem">
            <Chat className="sidebarIcon" />
            <span className="sidebarListItemText">Mesajlaşma</span>
          </li>
          </Link>
          
       
          <li className="sidebarListItem">
            <Bookmark className="sidebarIcon" />
            <span className="sidebarListItemText">Kaydedilenler</span>
          </li>
          <li className="sidebarListItem">
            <HelpOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Destek</span>
          </li>
          <li className="sidebarListItem">
            <WorkOutline className="sidebarIcon" />
            <span className="sidebarListItemText">İş İlanları</span>
          </li>
        
        </ul>
        <button className="sidebarButton">Daha Fazla</button>
        <hr className="sidebarHr" />
        <ul className="sidebarFriendList">
        {friends.map((friend) => (
            
            <CloseFriend  users={friend}/>
          
          ))}
       
        </ul>
      </div>
    </div>
  );

}
