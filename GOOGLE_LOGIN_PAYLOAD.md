# Google Login Payload Format for Backend

## Overview
When a user signs in with Google, the frontend receives a JWT credential token from Google. This document outlines the payload format your backend should expect and handle.

---

## Frontend → Backend Payload

### Option 1: Send JWT Token Only (Recommended)
**Endpoint:** `POST /api/auth/google`

**Request Body:**
```json
{
  "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2ODk5NzY4MDAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMjM0NTY3ODktYWJjZGVmZ2hpamsuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxMjM0NTY3ODktYWJjZGVmZ2hpamsuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTIyMzM0NDU1NjY3Nzg4OTAiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkpvaG4gRG9lIiwicGljdHVyZSI6Imh0dHBzOi8vbGg0Lmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBY0hUdG1jR0x1Y0dGdS9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiSm9obiIsImZhbWlseV9uYW1lIjoiRG9lIiwiaWF0IjoxNjk5OTc2ODAwLCJleHAiOjE2OTk5ODA0MDB9.signature_here"
}
```

**Why this approach:**
- Backend verifies the token with Google's public keys
- Most secure - prevents token tampering
- Backend has full control over user data extraction

---

### Option 2: Send Decoded Data + Token (Alternative)
**Endpoint:** `POST /api/auth/google`

**Request Body:**
```json
{
  "credential": "eyJhbGciOiJSUzI1NiIs...",
  "user": {
    "sub": "112233445566778890",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://lh4.googleusercontent.com/a/photo.jpg",
    "email_verified": true,
    "given_name": "John",
    "family_name": "Doe"
  }
}
```

**Why this approach:**
- Faster processing (no need to decode on backend)
- Still verify the token for security
- Useful for logging/analytics

---

## JWT Token Structure (Decoded)

When you decode the JWT token on the backend, you'll get:

### Header
```json
{
  "alg": "RS256",
  "kid": "1689976800",
  "typ": "JWT"
}
```

### Payload (Claims)
```json
{
  "iss": "https://accounts.google.com",
  "azp": "392705207882-qmru3mi3bp7hv675el1b5vm0eh4ob3a5.apps.googleusercontent.com",
  "aud": "392705207882-qmru3mi3bp7hv675el1b5vm0eh4ob3a5.apps.googleusercontent.com",
  "sub": "112233445566778890",           // Google User ID (unique, stable)
  "email": "user@example.com",
  "email_verified": true,
  "name": "John Doe",
  "picture": "https://lh4.googleusercontent.com/a/photo.jpg",
  "given_name": "John",
  "family_name": "Doe",
  "iat": 1699976800,                     // Issued at (Unix timestamp)
  "exp": 1699976800                       // Expiration (Unix timestamp)
}
```

### Key Fields Explained:
- **`sub`**: Google's unique user identifier (stable, use as primary key)
- **`email`**: User's email address
- **`email_verified`**: Whether Google has verified the email
- **`name`**: Full display name
- **`picture`**: Profile picture URL
- **`given_name`**: First name
- **`family_name`**: Last name
- **`aud`**: Audience (your Client ID - verify this matches!)
- **`iss`**: Issuer (should be "https://accounts.google.com")
- **`exp`**: Token expiration (verify token hasn't expired)

---

## Backend Response Format

### Success Response (200 OK)
```json
{
  "success": true,
  "user": {
    "id": "uuid-from-your-db",
    "googleId": "112233445566778890",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://lh4.googleusercontent.com/a/photo.jpg",
    "createdAt": "2024-03-10T10:30:00Z",
    "updatedAt": "2024-03-10T10:30:00Z"
  },
  "token": "your-jwt-token-for-frontend",  // Optional: if you want to issue your own JWT
  "message": "Login successful"
}
```

### Error Response (400/401)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Google token verification failed",
    "details": "Token signature is invalid"
  }
}
```

---

## Backend Verification Steps

1. **Verify Token Signature**
   - Use Google's public keys to verify the JWT signature
   - Endpoint: `https://www.googleapis.com/oauth2/v3/certs`

2. **Verify Token Claims**
   - Check `iss` === "https://accounts.google.com"
   - Check `aud` === your Google Client ID
   - Check `exp` > current time (token not expired)

3. **Create/Update User**
   - Use `sub` (Google User ID) as unique identifier
   - Create user if doesn't exist, update if exists
   - Store: `sub`, `email`, `name`, `picture`

4. **Return Session**
   - Issue your own JWT token (optional)
   - Or return user data and let frontend manage session

---

## Example Backend Implementation (Java/Spring Boot)

### 1. Add Dependencies (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Google API Client for JWT verification -->
    <dependency>
        <groupId>com.google.api-client</groupId>
        <artifactId>google-api-client</artifactId>
        <version>2.2.0</version>
    </dependency>
    
    <!-- JWT Support -->
    <dependency>
        <groupId>com.google.auth</groupId>
        <artifactId>google-auth-library-oauth2-http</artifactId>
        <version>1.19.0</version>
    </dependency>
    
    <!-- Spring Data JPA (if using database) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
</dependencies>
```

### 2. DTO Classes

```java
// GoogleLoginRequest.java
package com.himalayantiling.dto;

import jakarta.validation.constraints.NotBlank;

public class GoogleLoginRequest {
    @NotBlank(message = "Credential is required")
    private String credential;

    public String getCredential() {
        return credential;
    }

    public void setCredential(String credential) {
        this.credential = credential;
    }
}

// GoogleUserPayload.java
package com.himalayantiling.dto;

public class GoogleUserPayload {
    private String sub;              // Google User ID
    private String email;
    private String name;
    private String picture;
    private Boolean emailVerified;
    private String givenName;
    private String familyName;
    private String aud;              // Client ID
    private String iss;              // Issuer
    private Long exp;                // Expiration

    // Getters and Setters
    public String getSub() { return sub; }
    public void setSub(String sub) { this.sub = sub; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getPicture() { return picture; }
    public void setPicture(String picture) { this.picture = picture; }
    
    public Boolean getEmailVerified() { return emailVerified; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }
    
    public String getGivenName() { return givenName; }
    public void setGivenName(String givenName) { this.givenName = givenName; }
    
    public String getFamilyName() { return familyName; }
    public void setFamilyName(String familyName) { this.familyName = familyName; }
    
    public String getAud() { return aud; }
    public void setAud(String aud) { this.aud = aud; }
    
    public String getIss() { return iss; }
    public void setIss(String iss) { this.iss = iss; }
    
    public Long getExp() { return exp; }
    public void setExp(Long exp) { this.exp = exp; }
}

// AuthResponse.java
package com.himalayantiling.dto;

public class AuthResponse {
    private Boolean success;
    private UserDto user;
    private String message;

    public AuthResponse(Boolean success, UserDto user, String message) {
        this.success = success;
        this.user = user;
        this.message = message;
    }

    // Getters and Setters
    public Boolean getSuccess() { return success; }
    public void setSuccess(Boolean success) { this.success = success; }
    
    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}

// UserDto.java
package com.himalayantiling.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class UserDto {
    private UUID id;
    private String googleId;
    private String email;
    private String name;
    private String picture;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getGoogleId() { return googleId; }
    public void setGoogleId(String googleId) { this.googleId = googleId; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getPicture() { return picture; }
    public void setPicture(String picture) { this.picture = picture; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
```

### 3. Service Class for Token Verification

```java
// GoogleTokenVerifier.java
package com.himalayantiling.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.himalayantiling.dto.GoogleUserPayload;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleTokenVerifier {
    
    @Value("${google.client.id}")
    private String googleClientId;
    
    private final GoogleIdTokenVerifier verifier;
    private final ObjectMapper objectMapper;
    
    public GoogleTokenVerifier(@Value("${google.client.id}") String googleClientId) {
        this.googleClientId = googleClientId;
        this.verifier = new GoogleIdTokenVerifier.Builder(
            new NetHttpTransport(),
            GsonFactory.getDefaultInstance()
        )
        .setAudience(Collections.singletonList(googleClientId))
        .build();
        this.objectMapper = new ObjectMapper();
    }
    
    public GoogleUserPayload verifyToken(String credential) throws Exception {
        // Verify the token
        GoogleIdToken idToken = verifier.verify(credential);
        
        if (idToken == null) {
            throw new IllegalArgumentException("Invalid Google token");
        }
        
        // Get payload
        GoogleIdToken.Payload payload = idToken.getPayload();
        
        // Verify issuer
        if (!"https://accounts.google.com".equals(payload.getIssuer())) {
            throw new IllegalArgumentException("Invalid token issuer");
        }
        
        // Verify audience (Client ID)
        if (!googleClientId.equals(payload.getAudience())) {
            throw new IllegalArgumentException("Invalid token audience");
        }
        
        // Verify expiration
        long exp = payload.getExpirationTimeSeconds();
        if (exp < System.currentTimeMillis() / 1000) {
            throw new IllegalArgumentException("Token has expired");
        }
        
        // Extract user data
        GoogleUserPayload userPayload = new GoogleUserPayload();
        userPayload.setSub(payload.getSubject());
        userPayload.setEmail(payload.getEmail());
        userPayload.setName((String) payload.get("name"));
        userPayload.setPicture((String) payload.get("picture"));
        userPayload.setEmailVerified(payload.getEmailVerified());
        userPayload.setGivenName((String) payload.get("given_name"));
        userPayload.setFamilyName((String) payload.get("family_name"));
        userPayload.setAud((String) payload.getAudience());
        userPayload.setIss((String) payload.getIssuer());
        userPayload.setExp(exp);
        
        return userPayload;
    }
}
```

### 4. Entity Class (JPA)

```java
// User.java
package com.himalayantiling.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_google_id", columnList = "google_id"),
    @Index(name = "idx_email", columnList = "email")
})
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "google_id", unique = true, nullable = false)
    private String googleId;
    
    @Column(nullable = false)
    private String email;
    
    private String name;
    
    @Column(length = 1000)
    private String picture;
    
    @Column(name = "email_verified")
    private Boolean emailVerified = false;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors, Getters, and Setters
    public User() {}
    
    public User(String googleId, String email, String name, String picture, Boolean emailVerified) {
        this.googleId = googleId;
        this.email = email;
        this.name = name;
        this.picture = picture;
        this.emailVerified = emailVerified;
    }
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getGoogleId() { return googleId; }
    public void setGoogleId(String googleId) { this.googleId = googleId; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getPicture() { return picture; }
    public void setPicture(String picture) { this.picture = picture; }
    
    public Boolean getEmailVerified() { return emailVerified; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
```

### 5. Repository Interface

```java
// UserRepository.java
package com.himalayantiling.repository;

import com.himalayantiling.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByGoogleId(String googleId);
    Optional<User> findByEmail(String email);
}
```

### 6. Service Class

```java
// AuthService.java
package com.himalayantiling.service;

import com.himalayantiling.dto.AuthResponse;
import com.himalayantiling.dto.GoogleUserPayload;
import com.himalayantiling.dto.UserDto;
import com.himalayantiling.entity.User;
import com.himalayantiling.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    
    @Autowired
    private GoogleTokenVerifier tokenVerifier;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public AuthResponse authenticateWithGoogle(String credential) throws Exception {
        // Verify Google token
        GoogleUserPayload googleUser = tokenVerifier.verifyToken(credential);
        
        // Find or create user
        User user = userRepository.findByGoogleId(googleUser.getSub())
            .orElse(null);
        
        if (user == null) {
            // Create new user
            user = new User(
                googleUser.getSub(),
                googleUser.getEmail(),
                googleUser.getName(),
                googleUser.getPicture(),
                googleUser.getEmailVerified()
            );
        } else {
            // Update existing user
            user.setEmail(googleUser.getEmail());
            user.setName(googleUser.getName());
            user.setPicture(googleUser.getPicture());
            user.setEmailVerified(googleUser.getEmailVerified());
        }
        
        user = userRepository.save(user);
        
        // Convert to DTO
        UserDto userDto = convertToDto(user);
        
        return new AuthResponse(true, userDto, "Login successful");
    }
    
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setGoogleId(user.getGoogleId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setPicture(user.getPicture());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}
```

### 7. Controller

```java
// AuthController.java
package com.himalayantiling.controller;

import com.himalayantiling.dto.AuthResponse;
import com.himalayantiling.dto.GoogleLoginRequest;
import com.himalayantiling.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Configure properly for production
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@Valid @RequestBody GoogleLoginRequest request) {
        try {
            AuthResponse response = authService.authenticateWithGoogle(request.getCredential());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse(false, "AUTH_ERROR", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(false, "SERVER_ERROR", "An error occurred during authentication"));
        }
    }
    
    // Error Response class
    public static class ErrorResponse {
        private Boolean success;
        private String code;
        private String message;
        
        public ErrorResponse(Boolean success, String code, String message) {
            this.success = success;
            this.code = code;
            this.message = message;
        }
        
        // Getters and Setters
        public Boolean getSuccess() { return success; }
        public void setSuccess(Boolean success) { this.success = success; }
        
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
```

### 8. Application Properties (application.properties)

```properties
# Google OAuth Configuration
google.client.id=392705207882-qmru3mi3bp7hv675el1b5vm0eh4ob3a5.apps.googleusercontent.com

# Database Configuration (example)
spring.datasource.url=jdbc:mysql://localhost:3306/tiling_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 9. Alternative: Using application.yml

```yaml
google:
  client:
    id: 392705207882-qmru3mi3bp7hv675el1b5vm0eh4ob3a5.apps.googleusercontent.com

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/tiling_db
    username: your_username
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

---

## Frontend Integration (To Be Implemented)

Currently, the frontend only stores user data locally. To integrate with your backend, you would:

1. **Update `AuthContext.jsx`** to call your backend API
2. **Update `ProtectedRoute.jsx`** to send credential to backend
3. **Update `App.jsx`** (One Tap login) to send credential to backend

Example:
```javascript
const handleLoginSuccess = async (credentialResponse) => {
  try {
    const response = await fetch('https://gobhutan.site/boot/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: credentialResponse.credential })
    });
    
    const data = await response.json();
    if (data.success) {
      login(data.user); // Store user in context
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

---

## Security Considerations

1. **Always verify the token on the backend** - Never trust client-side data
2. **Check token expiration** - Reject expired tokens
3. **Verify Client ID** - Ensure `aud` matches your Client ID
4. **Rate limiting** - Prevent abuse of the auth endpoint
5. **HTTPS only** - Always use HTTPS in production

---

## Database Schema

### SQL (MySQL/PostgreSQL)

```sql
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,  -- UUID as string
  google_id VARCHAR(255) UNIQUE NOT NULL,  -- 'sub' from Google
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  picture TEXT,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_email ON users(email);
```

### JPA Entity (Already shown above in User.java)

The `User` entity class includes:
- `@Entity` and `@Table` annotations
- `@Index` annotations for performance
- `@CreationTimestamp` and `@UpdateTimestamp` for automatic timestamps
- UUID primary key generation

---

## Quick Start Checklist

1. ✅ Add Google API Client dependencies to `pom.xml`
2. ✅ Create DTO classes (`GoogleLoginRequest`, `AuthResponse`, `UserDto`)
3. ✅ Create Entity class (`User.java`)
4. ✅ Create Repository interface (`UserRepository.java`)
5. ✅ Create Service class (`GoogleTokenVerifier.java`, `AuthService.java`)
6. ✅ Create Controller (`AuthController.java`)
7. ✅ Configure `application.properties` with Google Client ID
8. ✅ Test the endpoint: `POST /api/auth/google`

