package com.glassshop.ai.controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.glassshop.ai.dto.AuthResponse;
import com.glassshop.ai.dto.CreateStaffRequest;
import com.glassshop.ai.dto.LoginRequest;
import com.glassshop.ai.dto.RegisterShopRequest;
import com.glassshop.ai.entity.Shop;
import com.glassshop.ai.entity.User;
import com.glassshop.ai.repository.ShopRepository;
import com.glassshop.ai.repository.UserRepository;
import com.glassshop.ai.security.JwtUtil;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private ShopRepository shopRepository;

    // ✅ Allowed roles (SECURITY)
    private static final Set<String> ALLOWED_ROLES =
            Set.of("ADMIN", "STAFF");

    /* ===============================
       REGISTER USER
       =============================== */
    
    @PostMapping("/register-shop")
    public ResponseEntity<?> registerShop(@RequestBody RegisterShopRequest request) {

        Shop shop = new Shop();
        shop.setShopName(request.getShopName());
        shop = shopRepository.save(shop);

        User admin = new User();
        admin.setUserName(request.getUsername());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setRole("ROLE_ADMIN");
        admin.setShop(shop);

        userRepository.save(admin);

        return ResponseEntity.ok("Shop registered successfully");
    }





    @PostMapping("/create-staff")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createStaff(@RequestBody CreateStaffRequest request) {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        User admin =
                userRepository.findByUserName(auth.getName())
                        .orElseThrow();

        if (userRepository.findByUserName(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        User staff = new User();
        staff.setUserName(request.getUsername());
        staff.setPassword(passwordEncoder.encode(request.getPassword()));
        staff.setRole("ROLE_STAFF");
        staff.setShop(admin.getShop());

        userRepository.save(staff);

        return ResponseEntity.ok("Staff created successfully");
    }




    
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (userRepository.findByUserName(user.getUserName()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("Username already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // ✅ Default role = STAFF
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("STAFF");
        }

        // ✅ SECURITY: validate role
        if (!ALLOWED_ROLES.contains(user.getRole().toUpperCase())) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid role selected");
        }

        user.setRole(user.getRole().toUpperCase());

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    /* ===============================
       LOGIN USER
       =============================== */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = userRepository
                .findByUserName(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }

        String role = user.getRole(); // MUST be ROLE_ADMIN / ROLE_STAFF

        String token = jwtUtil.generateToken(
                user.getUserName(),
                role
        );

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "role", role
                )
        );

    }


}
