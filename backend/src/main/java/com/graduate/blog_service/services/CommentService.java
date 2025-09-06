package com.graduate.blog_service.services;


import com.graduate.blog_service.Dto.commentDto.CommentDto;
import com.graduate.blog_service.Dto.commentDto.CreateCommentDto;
import com.graduate.blog_service.exceptions.ResourceNotFoundException;
import com.graduate.blog_service.mapper.CommentMapper;
import com.graduate.blog_service.models.*;
import com.graduate.blog_service.repositorys.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentMapper commentMapper;
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private CommentRepository commentRepository;


    public List<Comment> getAllComments(){
      return commentRepository.findAll();
    }

    @Transactional
    public void deleteComment(Long commentId) {
        // Delete all replies to the comment
        commentRepository.deleteByParentId(commentId);
        // Delete the comment itself
        commentRepository.deleteById(commentId);
    }

    ///////////////////////////////front///////////////////////

    public List<CommentDto> getCommentsForPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        List<Comment> comments = commentRepository.findByPost(post);

        List<CommentDto> commentDtos = comments.stream().map(comment -> {
            CommentDto dto = commentMapper.toDto(comment);
            dto.setId(comment.getId());
            // Assuming Comment has a reference to either User or Provider
            if (comment.getCommenterType() == CommenterType.PROVIDER) {
                dto.setName(comment.getProvider().getName());
                dto.setEmail(comment.getProvider().getEmail());// Assuming a getProvider() method exists
            } else if (comment.getCommenterType() == CommenterType.USER) {
                dto.setName(comment.getUser().getName());
                dto.setEmail(comment.getUser().getEmail());
            }
            return dto;
        }).toList();

        return commentDtos; // Use the Post entity to retrieve comments
    }
    public CommentDto createComment(Long postId, CreateCommentDto commentDto) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        Comment comment = new Comment();
        comment.setContent(commentDto.getContent());

        User user = userRepository.findByEmail(commentDto.getEmail()).orElse(null);
        if (user != null) {
            comment.setUser(user);
            comment.setCommenterType(CommenterType.USER);
        } else {
            Provider provider = providerRepository.findByEmail(commentDto.getEmail()).orElse(null);
            if (provider != null) {
                comment.setProvider(provider);
                comment.setCommenterType(CommenterType.PROVIDER);
            } else {
                throw new ResourceNotFoundException("User or Provider", "email", commentDto.getParentId());
            }
        }

        comment.setPost(post);
        comment.setIsActive(true);
        comment.setParentId(commentDto.getParentId());

        commentRepository.save(comment);
        post.getComments().add(comment);
        postRepository.save(post);

        // Convert to DTO
        CommentDto dto = commentMapper.toDto(comment);
        dto.setId(comment.getId());
        if (comment.getCommenterType() == CommenterType.PROVIDER) {
            dto.setName(comment.getProvider().getName());
            dto.setEmail(comment.getProvider().getEmail());
            dto.setImage(comment.getProvider().getImages().get(0));
        } else if (comment.getCommenterType() == CommenterType.USER) {
            dto.setName(comment.getUser().getName());
            dto.setEmail(comment.getUser().getEmail());
            dto.setImage(comment.getUser().getImage());
        }

        return dto;
    }

}
