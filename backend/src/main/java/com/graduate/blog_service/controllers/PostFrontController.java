package com.graduate.blog_service.controllers;

import com.graduate.blog_service.Dto.PostDto.FrontCreatePostDto;
import com.graduate.blog_service.Dto.PostDto.FrontListPostDto;
import com.graduate.blog_service.Dto.commentDto.LikeRequestDto;
import com.graduate.blog_service.services.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PostFrontController {

    private final PostService postService;

    @GetMapping("/posts/{userData}")
    public ResponseEntity<List<FrontListPostDto>> getAllPostsFront(@PathVariable("userData") String userData) {
        List<FrontListPostDto> posts = postService.getAllPostsFront(userData);

        List<FrontListPostDto> activePosts = posts.stream()
                .filter(FrontListPostDto::getIsActive) // Keep only active Posts
                .peek(post -> post.setImages(post.getImages().stream()
                        .map(image -> "http://localhost:8081" + image)
                        .collect(Collectors.toList())))
                .collect(Collectors.toList());

        return ResponseEntity.ok().body(activePosts);
    }

    @GetMapping("/posts/providerEmails")
    public ResponseEntity<List<String>> getProviderEmails() {
        List<String> providerEmails = postService.getAllProviderEmails();
        return ResponseEntity.ok(providerEmails);
    }

    @PostMapping(value = "/post", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createPost(
            @RequestParam("images") MultipartFile[] images,
            @RequestParam("provider_email") String providerEmail,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("services") Long services
    ) {
        FrontCreatePostDto postDto = new FrontCreatePostDto(providerEmail, title, content, services);

        // Validate PostDto fields
        if (postDto.getTitle() == null || postDto.getTitle().isEmpty() ||
                postDto.getContent() == null || postDto.getContent().isEmpty() ||
                postDto.getProvider_email() == null || postDto.getProvider_email().isEmpty()) {
            return ResponseEntity.badRequest().body("All fields are required.");
        }

        postService.FrontcreatePost(postDto, images);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/posts/{id}/like")
    public ResponseEntity<?> likePost(@PathVariable Long id,
                                      @RequestBody LikeRequestDto request) {
        postService.updateLikes(id, request.getUserEmail(), request.isLiked()); // Pass the current user to the service
        return ResponseEntity.ok().body("success");
    }
}