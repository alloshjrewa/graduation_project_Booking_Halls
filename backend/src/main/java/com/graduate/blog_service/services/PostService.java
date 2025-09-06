package com.graduate.blog_service.services;

import com.graduate.blog_service.Dto.PostDto.*;
import com.graduate.blog_service.exceptions.ResourceNotFoundException;
import com.graduate.blog_service.mapper.PostMapper;
import com.graduate.blog_service.models.*;
import com.graduate.blog_service.repositorys.PostRepository;
import com.graduate.blog_service.repositorys.ProviderRepository;
import com.graduate.blog_service.repositorys.ServiceRepository;
import com.graduate.blog_service.repositorys.UserRepository;
import com.graduate.blog_service.utils.ImageUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private ImageUtils imageUtils;
    @Autowired
    private PostMapper postMapper;
    public List<ListPostDto> getAllPosts(){
        return postRepository.findAll().stream().map(post -> postMapper.toListDto(post)).toList();
    }

    public Post createPost(CreatePostDto postDto, MultipartFile[] images){
        Post post  = postMapper.toEntity(postDto);

        List<String> imagePaths = new ArrayList<>();

        for (MultipartFile image : images) {
            if (!image.isEmpty()) {
                String imagePath = imageUtils.saveImage(image,"/post-images/"); // Implement this to save the image
                imagePaths.add(imagePath); // Add the image path to the list
            }
        }


        post.setCreatedAt(LocalDateTime.now());
        post.setImages(imagePaths);
        post.setServices(postDto.getService());
        postRepository.save(post);
        return post;
    }

    public void updatePost(Long id, UpdatedPost updatedPost) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        // Update Decor properties
        post.setContent(updatedPost.getContent());
        post.setTitle(updatedPost.getTitle());
        Services services = serviceRepository.findById(updatedPost.getService()).orElseThrow(() -> new ResourceNotFoundException("Service", "id", id));
        post.setServices(services);
        post.setIsActive(updatedPost.getIsActive());
        Provider provider = providerRepository.findById(updatedPost.getProvider()).orElseThrow(() -> new ResourceNotFoundException("Provider", "id", id));
        post.setProvider(provider);

        // Handle new images
        List<String> imagePaths = new ArrayList<>(post.getImages()); // Start with existing images

        if (updatedPost.getNewImages() != null) {
            for (MultipartFile image : updatedPost.getNewImages()) {
                if (!image.isEmpty()) {
                    String imagePath = imageUtils.saveImage(image,"/post-images/"); // Implement this method
                    imagePaths.add(imagePath);
                }
            }
        }

        // Handle deletion of images
        if (updatedPost.getImagesToDelete() != null) {
            for (String imagePath : updatedPost.getImagesToDelete()) {
                imageUtils.deleteImage(imagePath); // Implement this method to delete the image from the filesystem
                imagePaths.remove(imagePath); // Remove from the list of paths
            }
        }

        post.setImages(imagePaths); // Set updated images
        postRepository.save(post); // Save the updated Post
    }


    public UpdatedPost getPostById(Long id) {
        Post post = postRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Post" , " id " , id));

        // Create UpdatedPost DTO and populate it
        UpdatedPost updatedPost= new UpdatedPost();
        updatedPost.setId(post.getPostId());
        updatedPost.setContent(post.getContent());
        updatedPost.setTitle(post.getTitle());
        updatedPost.setExistingImages(post.getImages());
        updatedPost.setIsActive(post.getIsActive());
        updatedPost.setProvider(post.getProvider().getId());
        updatedPost.setService(post.getServices().getId());

        // Add the updatedDecor DTO to the model

        return updatedPost;
    }
    @Transactional
    public void deletePost(Long postId) {
        try {
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
            // Handle deletion of images
            if (post.getImages() != null) {
                for (String imagePath : post.getImages()) {
                    imageUtils.deleteImage(imagePath); // Implement this method to delete the image from the filesystem
                }
            }

            postRepository.delete(post);

        } catch (Exception e) {
            System.out.println("Error during deletion: " + e.getMessage());
            e.printStackTrace();
        }
    }

    ///////////////////////////front///////////////////////////////////
    public List<FrontListPostDto> getAllPostsFront(String currentUser) {
        List<Post> posts = postRepository.findAll();
        return posts.stream().map(post -> {
            FrontListPostDto dto = postMapper.toFrontDto(post);
            Set<String> likedUsers = post.getLikedUsers() != null ? post.getLikedUsers() : new HashSet<>();
            boolean liked = likedUsers.contains(currentUser);
            dto.setLikedByCurrentUser(liked);
            dto.setLikes(likedUsers.size()); //set the number of likes
            return dto;
        }).collect(Collectors.toList());
    }


    @Transactional
    public void updateLikes(Long postId, String userEmail, boolean liked) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Set<String> likedUsers = post.getLikedUsers();
        if (likedUsers == null) {
            likedUsers = new HashSet<>();
        }

        if (liked) {
            likedUsers.add(userEmail);
        } else {
            likedUsers.remove(userEmail);
        }

        post.setLikedUsers(likedUsers);
        post.setLikes(likedUsers.size());
        postRepository.save(post);
    }
    public Post FrontcreatePost(FrontCreatePostDto postDto, MultipartFile[] images){
        Post post  = postMapper.toEntity(postDto);
        Provider provider = providerRepository.findByEmail(postDto.getProvider_email()).orElseThrow(()-> new ResourceNotFoundException("Provider" , "id" , post.getPostId()));
        List<String> imagePaths = new ArrayList<>();

        for (MultipartFile image : images) {
            if (!image.isEmpty()) {
                String imagePath = imageUtils.saveImage(image,"/post-images/"); // Implement this to save the image
                imagePaths.add(imagePath); // Add the image path to the list
            }
        }

        post.setProvider(provider);
        post.setCreatedAt(LocalDateTime.now());
        post.setImages(imagePaths);
        Services services = serviceRepository.findById(postDto.getService()).orElseThrow(() -> new ResourceNotFoundException("Service", "id", postDto.getService()));
        post.setServices(services);
        post.setIsActive(false);
        postRepository.save(post);
        return post;
    }

    public List<String> getAllProviderEmails() {
        // Assuming you have a Role entity and Providers have a specific role (e.g., "ROLE_PROVIDER")
        // Modify the query as per your actual database schema
        return providerRepository.findAll().stream()
                .map(Provider::getEmail)
                .collect(Collectors.toList());
    }


}