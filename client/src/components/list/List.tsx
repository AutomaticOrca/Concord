import Userinfo from "./userInfo/userInfo.tsx";
import ChatList from "./chatList/chatList.tsx";

const List = () => {
  return (
    <div className="flex flex-col flex-1">
      <Userinfo />
      <ChatList />
    </div>
  );
};

export default List;
