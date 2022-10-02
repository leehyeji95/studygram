package com.studygram.service;

import com.studygram.domain.Post;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;


import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

// TODO 왜 spirngboottest intializationError가 날까..?
@SpringBootTest
@RunWith(SpringRunner.class)
//@Transactional
public class PostServiceTest {

    // TODO 왜 beforeeach는 안될까..?
    @Autowired
    PostService postService;

    @Test
    void 게시판_작성() {
        //given
        Post post = new Post();
        post.setContent("test2222 #태그입니다");
        post.setUserId(userId);

        //when
        postService.save(post);

        //then
        Post resPost = postService.findById(post.getIdx());
        Assertions.assertEquals(resPost.getIdx(), post.getIdx());
    }

    @Test
    void 게시판_전체_조회() {
        //given
        List<Post> posts = postService.findAll();

        //when
        Post post = new Post();
        post.setCommentsId(1);
        post.setContent("test");
        post.setLikesId(1);
        post.setTagsId(3);
        post.setImageUrlId(4);
        post.setUserId(35);
        postService.save(post);

        Post post2 = new Post();
        post2.setCommentsId(1);
        post2.setContent("test");
        post2.setLikesId(1);
        post2.setTagsId(3);
        post2.setImageUrlId(4);
        post2.setUserId(35);
        postService.save(post2);

        //then
        List<Post> nowPosts = postService.findAll();
        Assertions.assertEquals(nowPosts.size(), posts.size() + 2);
    }

    @Test
    void 게시판_업데이트() {
        //given
        Post post = new Post();
        post.setCommentsId(1);
        post.setContent("test");
        post.setLikesId(1);
        post.setTagsId(3);
        post.setImageUrlId(4);
        post.setUserId(35);
        postService.save(post);

        //when
        Post updatedPost = postService.findById(post.getIdx());
        updatedPost.setContent("hihi");
        postService.update(updatedPost);

        //then
        Post updatePost = postService.findById(updatedPost.getIdx());
        Assertions.assertEquals("hihi",updatePost.getContent());
    }

    @Test
    void 게시판_삭제() {
        //given
        Post post = new Post();
        post.setCommentsId(1);
        post.setContent("deletetest");
        post.setLikesId(1);
        post.setTagsId(3);
        post.setImageUrlId(4);
        post.setUserId(35);
        postService.save(post);

        //when
        Post newPost = postService.findById(post.getIdx());
        assertNotNull(newPost);
        postService.delete(post);

        //then
        Assert.assertNull(postService.findById(originalPost.getIdx()));
    }

    @Test
    public void 게시글_1개_조회() {
        // given
        int postId = 12;

        Post newPost = postService.findById(postId);
        System.out.println(newPost.toString());
    }

    @Test
    public void 좋아요_누른_게시글이_맞는지_확인() {
        /// given
        int likedUserId = 35;
        Like like = Like.builder()
                .userId(likedUserId)
                .postId(originalPost.getIdx())
                .build();

        // when
        likeService.save(like);

        // then
        assertTrue(postService.findByIds(originalPost.getIdx(), likedUserId).isHasLiked());
    }
}

