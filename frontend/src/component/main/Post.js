import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";

import PostApi from "../../lib/api/post";
import LikeApi from "../../lib/api/like";
import CommentApi from "../../lib/api/comment";

import LikeModal from "./LikeModal";
import {convertContentTag} from "../../module/utils/convertContentTag";

import moment from "moment";
import PostModal from "../auth/PostModal";

const Post = ({ data }) => {
  const [post, setPost] = useState(data);
  const [modalOpen, setModalOpen] = useState(false);
  const [likers, setLikers] = useState(null);
  const [comments, setComments] = useState(null);
  const [comment, setComment] = useState({
    content: "",
  });
  const [commentOpen,setCommentOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

    const deleteLike = (data) => {
        const postIdx = data.idx;
        const cancel = LikeApi.cancle(postIdx).then(() => {
            reloadPost(postIdx);
        });
    };

    const saveLike = async (data) => {
        const postIdx = data.idx;
        const like = {
            postIdx: postIdx,
        };
        const save = await LikeApi.save(like).then(() => {
            reloadPost(postIdx);
        });
    };

    const reloadPost = async (postIdx) => {
        const newPost = await PostApi.getPost(postIdx).then((result) => {
            setPost(result.data);
        });
    };

    const likeMessage = (post) => {
        const topLiker = post.topLiker;
        const likeCnt = post.likeCnt;

        if (topLiker == null) {
            return ``;
        } else if (topLiker != null && likeCnt == 1) {
            return `${topLiker}님이 좋아합니다`;
        } else {
            return `${topLiker}님 외 ${likeCnt - 1}명이 좋아합니다`;
        }
    };

    const openModal = async (post) => {
        setModalOpen(true);
        await LikeApi.users(post.idx).then((likers) => {
            setLikers(likers);
        });
    };
    const closeModal = () => {
        setModalOpen(false);
    };

    const openPostModal = async (post) => {
        setPostModalOpen(true);
        setSelectedPost(post);
    };
    const closePostModal = () => {
        setPost(false);
        setSelectedPost(null);
    };

    const handleCommentChange = (e) => {
        const {name, value} = e.target;
        setComment(value);
    }
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (comment === "") {
            alert("내용을 입력하세요");
            return;
        }
        CommentApi.addComment({
            postIdx: post.idx,
            content: comment,
        }).then(() => reloadPost(post.idx));
    }

    const getTimeDifference = (post) => {
        const diffInMinutes = moment().diff(moment(post.createdDate), "minutes");
        const diffInHours = moment().diff(moment(post.createdDate), "hours");
        const diffInDays = moment().diff(moment(post.createdDate), "days");
        const humanizedTimeDiff =
            diffInMinutes < 60
                ? `${diffInMinutes}분 전`
                : diffInHours >= 24
                    ? `${diffInDays}일 전`
                    : `${diffInHours}시간 전`;

        return humanizedTimeDiff;
    }

    return (
        <article>
            <header>
                <div className="profile-of-article">
                    <img
                        className="img-profile pic"
                        src={post.profileImageUrl}
                        alt={post.userName + "님의 프로필 사진"}
                    />
                    <span className="userID main-id point-span">
            <a href={`/${post.userName}/`}>{post.userName}</a>
          </span>
                </div>
                <img
                    className="icon-react icon-more"
                    src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/bearu/more.png"
                    alt="more"
                />
            </header>
            <div className="main-image">
                <img
                    src={post.storePath}
                    alt={post.userName + "님의 피드 사진"}
                    className="mainPic"
                />
            </div>
            <div className="icons-react">
                <div className="icons-left">
                    {!post.hasLiked && (
                        <img
                            className="icon-react"
                            src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/bearu/heart.png"
                            alt="heart_disLike"
                            onClick={() => {
                                saveLike(post);
                            }}
                        />
                    )}
                    {post.hasLiked && (
                        <i
                            className="ri-heart-3-fill ri-admin-line ri-xl"
                            onClick={() => {
                                deleteLike(post);
                            }}
                        ></i>
                    )}
                    <img
                        className="icon-react"
                        src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/bearu/comment.png"
                        alt="말풍선"
                        onClick={() => openPostModal(post)}
                    />
                    <img
                        className="icon-react"
                        src="https://cdn3.iconfinder.com/data/icons/email-133/32/Email_paper_air_plane_airplane_send_message-512.png"
                        alt="DM"
                    />
                </div>
                <img
                    className="icon-react"
                    src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/bearu/bookmark.png"
                    alt="북마크"
                />
            </div>
            <div className="reaction">
                <div className="liked-people">
                    <img
                        className="pic"
                        src="https://cdn4.iconfinder.com/data/icons/48-bubbles/48/30.User-512.png"
                        alt="test님의 프로필 사진"
                    />
                </div>
                <p
                    onClick={(event) => {
                        openModal(post, event);
                    }}
                >
                    {likeMessage(post)}
                </p>
                <LikeModal
                    open={modalOpen}
                    close={closeModal}
                    header="좋아요"
                    likers={likers}
                >
                </LikeModal>
                <div className="description">
                    <p>
                        <span className="point-span userID">
                          {data.userName ?? "anoymous"}
                        </span>
                        {convertContentTag(data.content, data.tags)}
                    </p>
                </div>
                {data.commentCnt !== 0 && (
                    <div className="comment-section">
                        <Link onClick={() => openPostModal(post)}>
                            댓글 {data.commentCnt}개 모두 보기
                        </Link>
                    </div>
                )}
                <form onSubmit={handleCommentSubmit} method="post">
                    <input
                        id="postIdx"
                        name="postIdx"
                        hidden
                    />
                    <input
                        className="comments-header-textarea"
                        id="content"
                        name="content"
                        type="text"
                        placeholder="댓글 달기"
                        value={comment}
                        onChange={handleCommentChange}
                    />
                    <button type="submit">게시</button>
                </form>
                <div className="time-log">
                    <span>{getTimeDifference(post)}</span>
                </div>
            </div>
            <div className="hl"></div>
            <PostModal
                open={postModalOpen}
                close={closePostModal}
                post={selectedPost}>
            </PostModal>
        </article>
    );
};

export default Post;
