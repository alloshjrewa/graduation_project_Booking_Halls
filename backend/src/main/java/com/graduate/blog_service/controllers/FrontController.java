package com.graduate.blog_service.controllers;

import com.graduate.blog_service.Dto.LoginRequest;
import com.graduate.blog_service.Dto.ProfileDto;
import com.graduate.blog_service.Dto.userDto.UserDto;
import com.graduate.blog_service.exceptions.EmailAlreadyExistsException;
import com.graduate.blog_service.models.User;
import com.graduate.blog_service.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FrontController {
    private final AuthenticationManager authenticationManager;
    private final UserService userDetailsService;
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;


    @PostMapping("/front-login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest loginRequest,
                                   HttpServletRequest request, HttpServletResponse response,
                                   BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getFieldErrors());
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            // Get the UserDetails from the Authentication object
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();


            HttpSession session = request.getSession();
            session.setAttribute("user", authentication.getPrincipal());
            return ResponseEntity.ok(userDetails); // Return the UserDetails
        }catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }
    @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody @Valid UserDto userDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }
        try {

            userDetailsService.createUser(userDto);
            return ResponseEntity.ok("{\"message\": \"User created successfully\"}");
        } catch (EmailAlreadyExistsException e) {
            Map<String,String> error = new HashMap<>();
            error.put("error" , e.getMessage());

            return ResponseEntity.status(500).body(error);
        }catch (Exception e){
            System.out.println(e.getMessage());
            return  ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @GetMapping("/user-profile")
    public ResponseEntity<?> getUserProfile( HttpSession session) {
        Object userObj = session.getAttribute("user");
        if (userObj == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
        }

        UserDetails userDetails = (UserDetails) userObj;
        User user = userService.getProfile(userDetails.getUsername());

        ProfileDto dto = new ProfileDto();
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setImage(user.getImage());

        return ResponseEntity.ok(dto);
    }


    @PostMapping("/update-profile")
    public ResponseEntity<?> updateProfile(
            HttpSession session,
            @RequestParam String name,
            @RequestParam String phone,
            @RequestParam String oldPassword,
            @RequestParam (required = false) String newPassword,
            @RequestParam(required = false) MultipartFile profileImage
    ) {
        String result = "";

        Object userObj = session.getAttribute("user");
        if (userObj == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
        }

        UserDetails userDetails = (UserDetails) userObj;

        if (profileImage != null && !profileImage.isEmpty()) {
             result = userService.updateProfile(userDetails,name,phone,oldPassword,newPassword,profileImage);

        }else {

            result = userService.updateProfile(userDetails,name,phone,oldPassword,newPassword,null);

        }
            if (result.equals("OK")) {
                return ResponseEntity.ok("{\"message\": \"Profile updated successfully\"}");
            } else if (result.equals("Old password is incorrect")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"Old password is incorrect\"}");
            } else if (result.equals("Failed to save image")) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Failed to save image\"}");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Unexpected error\"}");
            }
        }
    }


