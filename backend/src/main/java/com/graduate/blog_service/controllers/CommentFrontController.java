package com.graduate.blog_service.controllers;

import com.graduate.blog_service.Dto.commentDto.CommentDto;
import com.graduate.blog_service.Dto.commentDto.CreateCommentDto;
import com.graduate.blog_service.models.Comment;
import com.graduate.blog_service.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
public class CommentFrontController {

    @Autowired
    private CommentService commentService;

    @GetMapping()
    public ResponseEntity<?> getCommentForPost(@RequestParam("postId") Long postId) {

        return ResponseEntity.ok().body(commentService.getCommentsForPost(postId));

    }
    @PostMapping("/{postId}")
    public ResponseEntity<?> createComment(@PathVariable("postId") Long postId,
                                           @RequestBody CreateCommentDto commentDto) {
        CommentDto createdComment = commentService.createComment(postId, commentDto);
        return ResponseEntity.ok(createdComment);
    }


    @GetMapping("/delete/{id}")
    public ResponseEntity<?> deleteComments(@PathVariable("id") Long id ){
        commentService.deleteComment(id);
        return ResponseEntity.ok().body("Comment Deleted Successfully");
    }

}
