import React from "react";
import { Link } from "react-router-dom";
import CommentApi from "../../lib/api/comment";

const Comment = ({ data }) => {
  console.log(data);
   /** userName이 안나옴.. */

  return (
    <div className="content">
      <div className="image">
        <img src={data.profileImageUrl} alt="프로필이미지" />
      </div>
      <div className="posting">
        <span className="userID point-span">{data.userIdx}</span>
        <div className="post-content"> {data.content}</div>
      </div>
      <span className="heart">
        ♡
      </span>
    </div>
  );
};

export default Comment;
