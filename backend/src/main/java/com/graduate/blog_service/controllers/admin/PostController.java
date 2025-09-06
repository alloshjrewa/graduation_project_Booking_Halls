package com.graduate.blog_service.controllers.admin;


import com.graduate.blog_service.Dto.PostDto.CreatePostDto;
import com.graduate.blog_service.Dto.PostDto.UpdatedPost;
import com.graduate.blog_service.models.Provider;
import com.graduate.blog_service.models.Services;
import com.graduate.blog_service.repositorys.ProviderRepository;
import com.graduate.blog_service.repositorys.ServiceRepository;

import com.graduate.blog_service.services.PostService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/dashboard/post")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @GetMapping("/list")
    public String getPostList(HttpServletRequest request, Model model) {

        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Post");
        model.addAttribute("posts", postService.getAllPosts());
        return "post/list";

    }

    @GetMapping("/create")
    public String createPost(@ModelAttribute("post") CreatePostDto postDto,HttpServletRequest request, Model model) {
        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Create New Post");
        List<Provider> providers = providerRepository.findAll();
        model.addAttribute("providers", providers);
        List<Services> services = serviceRepository.findAll();
        model.addAttribute("services", services);
        return "post/create";
    }

    @PostMapping("/store")
    public String storePost(@Valid @ModelAttribute("post") CreatePostDto postDto,
                            @RequestParam("images") MultipartFile[] images,
                            BindingResult bindingResult,
                            RedirectAttributes redirectAttributes) {

        if (bindingResult.hasErrors()) {
            System.out.println("Validation errors: " + bindingResult.getAllErrors()); // Debugging
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            redirectAttributes.addFlashAttribute("fieldErrors", errors);
            redirectAttributes.addFlashAttribute("post", postDto);
            return "redirect:/dashboard/post/create";
        }

        try {
            postService.createPost(postDto, images);
            redirectAttributes.addFlashAttribute("success", "Post Created Successfully");
            return "redirect:/dashboard/post/list";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("postError", e.getMessage());
            redirectAttributes.addFlashAttribute("test", "test");

            redirectAttributes.addFlashAttribute("post", postDto);
            return "redirect:/dashboard/post/create";
        }
    }

    @GetMapping("/edit/{id}")
    public String editPostPage(@PathVariable("id") Long id , Model model,HttpServletRequest request){
        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Update Post");
        model.addAttribute("updatedPost", postService.getPostById(id));
        List<Provider> providers = providerRepository.findAll();
        model.addAttribute("providers", providers);
        List<Services> services = serviceRepository.findAll();
        model.addAttribute("services", services);
        return "post/edit";
    }
    @PostMapping("/update/{id}")
    public String updatePost(
            @PathVariable Long id,
            @ModelAttribute @Valid UpdatedPost updatedPost,
            BindingResult bindingResult,
            RedirectAttributes redirectAttributes) {

        if (bindingResult.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.updatedPost", bindingResult);
            redirectAttributes.addFlashAttribute("updatedPost", updatedPost);
            return "redirect:/dashboard/post/edit/" + id;
        }

        try {
            postService.updatePost(id, updatedPost);
            redirectAttributes.addFlashAttribute("success", "Post updated successfully");
            return "redirect:/dashboard/post/list"; // Change to your list page
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("PostError", e.getMessage());
            return "redirect:/dashboard/post/edit/" + id;
        }
    }

    @GetMapping("/delete/{id}")
    public String deletePost(@PathVariable("id") Long id,RedirectAttributes redirectAttributes ){
        postService.deletePost(id);
        redirectAttributes.addFlashAttribute("success", "Post Deleted Successfully");
        return "redirect:/dashboard/post/list";
    }

}
