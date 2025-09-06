package com.graduate.blog_service.services;


import com.graduate.blog_service.exceptions.ResourceNotFoundException;
import com.graduate.blog_service.models.ContactUs;

import com.graduate.blog_service.repositorys.ContactUsRepository;
import com.graduate.blog_service.repositorys.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ContactUsService {
    @Autowired
    private ContactUsRepository contactUsRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ContactUs> getAllContactUs(){
        return contactUsRepository.findAll();
    }
    public  ContactUs getContactUsById(Long id){
        return contactUsRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("ContactUs" , "id" , id));
    }

    public void deleteContactUs(Long id){
        contactUsRepository.deleteById(id);
    }

    /// ///////////////////////////front////////////////////////////

    public void CreateContactUs(String email , String title, String message) {
        ContactUs contactUs =  new ContactUs();
        contactUs.setEmail(email);
        contactUs.setTitle(title);
        contactUs.setMessage(message);
        contactUs.setCreatedAt(LocalDateTime.now());

        contactUsRepository.save(contactUs);
    }
}
