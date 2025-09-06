package com.graduate.blog_service.controllers.admin;

import com.graduate.blog_service.services.CommentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/dashboard/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/list")
    public String getCommentList(HttpServletRequest request, Model model) {

        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Comment");
        model.addAttribute("comments", commentService.getAllComments());
        return "comment/list";

    }
    @GetMapping("/delete/{id}")
    public String deleteComments(@PathVariable("id") Long id,RedirectAttributes redirectAttributes ){
        commentService.deleteComment(id);
        redirectAttributes.addFlashAttribute("success", "Comment Deleted Successfully");
        return "redirect:/dashboard/comment/list";
    }

}
