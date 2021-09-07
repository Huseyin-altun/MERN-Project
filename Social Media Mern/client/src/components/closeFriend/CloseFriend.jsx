import "./closeFriend.css";
/* Kullanıcı Resımleri Ayrıca Kullanıcı adı Promptan gelmekte */ 
export default function CloseFriend({users}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER; // varsayılan uzantı 
  return (
    <li className="sidebarFriend">
      <img className="sidebarFriendImg" src={PF+users.profilePicture} alt="" /> 
      <span className="sidebarFriendName">{users.username}</span>
    </li>
  );
}
