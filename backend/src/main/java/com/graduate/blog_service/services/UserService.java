package com.graduate.blog_service.services;

import com.graduate.blog_service.Dto.adminDto.AdminDto;
import com.graduate.blog_service.Dto.adminDto.UpdateAdminDto;
import com.graduate.blog_service.Dto.userDto.UserDto;
import com.graduate.blog_service.Dto.userDto.UserListDto;
import com.graduate.blog_service.exceptions.EmailAlreadyExistsException;
import com.graduate.blog_service.exceptions.ResourceNotFoundException;
import com.graduate.blog_service.mapper.AdminMapper;
import com.graduate.blog_service.mapper.UserListToDto;
import com.graduate.blog_service.mapper.UserMapper;
import com.graduate.blog_service.models.Provider;
import com.graduate.blog_service.models.Role;
import com.graduate.blog_service.models.User;
import com.graduate.blog_service.repositorys.ProviderRepository;
import com.graduate.blog_service.repositorys.RoleRepository;
import com.graduate.blog_service.repositorys.UserRepository;
import com.graduate.blog_service.utils.ImageUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    private final PasswordEncoder passwordEncoder;
    @Autowired
    public UserService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Autowired
    private ImageUtils imageUtils;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private RoleRepository roleRepository;


    @Autowired
    private UserMapper userMapper;
    @Autowired
    private AdminMapper adminMapper;

    @Autowired
    private UserListToDto userListToDto;

    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional <User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            var secureUser = org.springframework.security.core.userdetails.User.withUserDetails(user.get()).password(user.get().getPassword()).roles(user.get().getRoles().toString().replace("[", "").replace("]", "")).build();
            return secureUser;
        }
        else if(!user.isPresent()) {
            Optional <Provider> provider = providerRepository.findByEmail(email);
            var secureUser = org.springframework.security.core.userdetails.User.withUserDetails(provider.get()).password(provider.get().getPassword()).roles(provider.get().getRoles().toString().replace("[", "").replace("]", "")).build();
            return secureUser;

        }  else{
            throw new UsernameNotFoundException("User not found");
        }
    }

    public AdminDto createAdmin(AdminDto adminDto){
        if (userRepository.findByEmail(adminDto.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("This email already exists");
        }
        User admin = adminMapper.toEntity(adminDto);
        Set<Role> roles = new HashSet<>();
        Role role = roleRepository.findByName("ADMIN");
        roles.add(role);
        admin.setRoles(roles);
        admin.setPassword(passwordEncoder.encode(adminDto.getPassword()));

        userRepository.save(admin);
        return adminMapper.toDto(admin);

    }

    public UserDto createUser(UserDto userDto) {
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("This email already exists");
        }
        User user = userMapper.toEntity(userDto);
        Set<Role> roles = new HashSet<>();
        Role role = roleRepository.findByName("USER");
        roles.add(role);
        user.setRoles(roles);
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setIsActive(true);
        return userMapper.toDto(userRepository.save(user));
    }
    public UpdateAdminDto updateAdmin(UpdateAdminDto updateAdminDto, Long id)  {
        User admin  = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Admin" , " id " , id));
        if (!admin.getEmail().equals(updateAdminDto.getEmail())) {
            throw new EmailAlreadyExistsException("This email already exists");
        }
        admin.setName(updateAdminDto.getName());
        admin.setEmail(updateAdminDto.getEmail());
        if (updateAdminDto.getPassword() != null && !updateAdminDto.getPassword().isEmpty()) {
            if (updateAdminDto.getPassword().length() < 8 || updateAdminDto.getPassword().length() > 25) {
                throw new IllegalArgumentException("The password should be between 8 and 25 characters");
            }
            admin.setPassword(passwordEncoder.encode(updateAdminDto.getPassword()));
        }

        admin.setIsActive(updateAdminDto.getIsActive());
        userRepository.save(admin);
        return adminMapper.toUpdateDto(admin);
    }

    public AdminDto getAdminById(Long id) {
        User admin = userRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Admin" , " id " , id));
        return adminMapper.toDto(admin);
    }
    // get All Admins
    public List<AdminDto> getAllAdmins() {
        List<User> users = userRepository.findAll();

        List<AdminDto> adminsDto = users.stream()
                .filter(user -> user.getRoles().stream()
                        .anyMatch(role -> role.getName().equals("ADMIN"))) // Check if user has ADMIN role
                .map(user -> adminMapper.toDto(user)) // Convert to AdminDto
                .collect(Collectors.toList()); // Collect results into a list

        return adminsDto;
    }

    // get All Users
    public List<UserListDto> getAllUsers() {
        List<User> users = userRepository.findAll();

        List<UserListDto> userDtos = users.stream()
                .filter(user -> user.getRoles().stream()
                        .anyMatch(role -> role.getName().equals("USER"))) // Check if user has User role
                .map(user -> userListToDto.toDto(user)) // Convert to UserDto
                .collect(Collectors.toList()); // Collect results into a list
        return userDtos;
    }


    @Transactional
    public void deleteAdmin(Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Admin", "id", userId));
            user.getRoles().clear();
            userRepository.delete(user);

        } catch (Exception e) {
            System.out.println("Error during deletion: " + e.getMessage());
            e.printStackTrace();
        }
    }
//    Delete User
    @Transactional
    public void deleteUser(Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
            user.getRoles().clear();
            userRepository.delete(user);

        } catch (Exception e) {
            System.out.println("Error during deletion: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /// /////////////////////////profile/////////////////////////////
    public User getProfile(String email){
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User" , "id" , 404L));
        return user;

    }
    public String  updateProfile(UserDetails userDetails , String name , String phone , String oldPassword , String newPassword , MultipartFile profileImage){
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(()->new ResourceNotFoundException("User" , "id" , 404l));
    if (!passwordEncoder.matches(oldPassword,user.getPassword())) {
            return "Old password is incorrect";
        }

        user.setName(name);
        user.setPhone(phone);

        if (!newPassword.isEmpty() && !passwordEncoder.matches(newPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        if (profileImage != null && !profileImage.isEmpty()) {

            try {
                String imagePath = imageUtils.saveImage(profileImage,"/profile-images/"); // Implement this to save the image

                user.setImage(imagePath);
            } catch (Exception e) {
                return "Failed to save image";
            }
        }
        userRepository.save(user);
        return "OK";
    }

    /// /////////////////dashboard///////////////////
    public long getTotalCustomer() {
        return userRepository.countByRoleName("USER");
    }

    public long getTodayCustomer() {
        return userRepository.countByRoleNameAndCreatedAtBetween(
                "USER",
                LocalDate.now().atStartOfDay(),
                LocalDate.now().plusDays(1).atStartOfDay()
        );
    }

    public Long getTotalCustomerMonth(LocalDate startDate, LocalDate endDate) {
        return userRepository.countByRoleNameAndCreatedAtBetween(
                "USER",
                startDate.atStartOfDay(),
                endDate.plusDays(1).atStartOfDay()
        );
    }
}
