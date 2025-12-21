# Backend Development Requirements for TrueLine Tiling

## Overview
This document provides comprehensive backend requirements to support the TrueLine Tiling frontend application, with special focus on the booking system.

---

## 1. BOOKING SYSTEM API

### 1.1 Create Booking Endpoint
**POST** `/api/bookings`

**Request Body:**
```json
{
  "serviceId": "bathroom",
  "jobSize": "medium",  // "small" | "medium" | "large"
  "suburb": "Richmond",
  "postcode": "3121",
  "description": "Need old tiles removed and new tiles installed",
  "date": "2024-03-15",  // ISO date format
  "timeSlot": "morning",  // "morning" | "afternoon" | "flexible"
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0400000000",
  "files": [File objects]  // Multipart form data
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "booking": {
    "id": "uuid",
    "bookingRef": "TR-12345",
    "status": "pending",
    "serviceId": "bathroom",
    "jobSize": "medium",
    "suburb": "Richmond",
    "postcode": "3121",
    "description": "Need old tiles removed...",
    "preferredDate": "2024-03-15",
    "timeSlot": "morning",
    "customer": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "0400000000"
    },
    "files": [
      {
        "id": "uuid",
        "filename": "bathroom-photo.jpg",
        "url": "/uploads/bookings/uuid/bathroom-photo.jpg",
        "size": 245678,
        "mimeType": "image/jpeg"
      }
    ],
    "createdAt": "2024-03-10T10:30:00Z",
    "updatedAt": "2024-03-10T10:30:00Z"
  },
  "message": "Booking created successfully"
}
```

**Validation Rules:**
- `serviceId`: Required, must be one of: "bathroom", "kitchen", "floor", "outdoor", "waterproofing", "minor"
- `jobSize`: Required, must be "small", "medium", or "large"
- `suburb`: Required, string, min 2 characters
- `postcode`: Required, exactly 4 digits (Australian postcode format)
- `date`: Required, must be a valid future date (ISO format)
- `timeSlot`: Required, must be "morning", "afternoon", or "flexible"
- `name`: Required, string, min 2 characters
- `email`: Required, valid email format
- `phone`: Required, Australian phone format (10 digits, may include spaces/dashes)
- `description`: Optional, string, max 2000 characters
- `files`: Optional, array of files, max 10MB per file, accepted types: image/*, .pdf

**Error Responses:**
- `400 Bad Request`: Validation errors
- `413 Payload Too Large`: File size exceeds limit
- `415 Unsupported Media Type`: Invalid file type
- `500 Internal Server Error`: Server error

---

### 1.2 Get Booking by Reference
**GET** `/api/bookings/:bookingRef`

**Response (200 OK):**
```json
{
  "success": true,
  "booking": {
    "id": "uuid",
    "bookingRef": "TR-12345",
    "status": "pending",
    // ... full booking object
  }
}
```

**Error Responses:**
- `404 Not Found`: Booking not found

---

### 1.3 Get All Bookings (Admin)
**GET** `/api/bookings?status=pending&page=1&limit=20&sortBy=createdAt&order=desc`

**Query Parameters:**
- `status`: Optional, filter by status ("pending", "confirmed", "completed", "cancelled")
- `page`: Optional, default 1
- `limit`: Optional, default 20, max 100
- `sortBy`: Optional, default "createdAt"
- `order`: Optional, "asc" | "desc", default "desc"
- `search`: Optional, search by customer name, email, or bookingRef

**Response (200 OK):**
```json
{
  "success": true,
  "bookings": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

### 1.4 Update Booking Status (Admin)
**PATCH** `/api/bookings/:id/status`

**Request Body:**
```json
{
  "status": "confirmed",  // "pending" | "confirmed" | "completed" | "cancelled"
  "notes": "Customer confirmed availability"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "booking": {
    // Updated booking object
  }
}
```

---

### 1.5 Block Unavailable Dates (Admin)
**POST** `/api/bookings/block-dates`

**Request Body:**
```json
{
  "dates": ["2024-03-15", "2024-03-16"],
  "reason": "Public holiday"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "blockedDates": ["2024-03-15", "2024-03-16"]
}
```

**GET** `/api/bookings/blocked-dates`
Returns list of blocked dates.

---

## 2. DATA MODELS / SCHEMAS

### 2.1 Booking Model
```javascript
{
  id: UUID (Primary Key),
  bookingRef: String (Unique, Format: "TR-{5-digit-number}"),
  status: Enum ["pending", "confirmed", "completed", "cancelled"],
  serviceId: String (Foreign Key to Services),
  jobSize: Enum ["small", "medium", "large"],
  suburb: String,
  postcode: String (4 digits),
  description: Text (Optional),
  preferredDate: Date,
  timeSlot: Enum ["morning", "afternoon", "flexible"],
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  files: Array of File references,
  assignedTo: UUID (Optional, Foreign Key to Users/Staff),
  notes: Text (Optional, Admin notes),
  createdAt: DateTime,
  updatedAt: DateTime,
  confirmedAt: DateTime (Optional),
  completedAt: DateTime (Optional)
}
```

### 2.2 Service Model
```javascript
{
  id: String (Primary Key, e.g., "bathroom"),
  title: String,
  description: Text,
  materials: Array of Strings,
  timeframe: String,
  useCases: Array of Strings,
  isActive: Boolean,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### 2.3 File/Upload Model
```javascript
{
  id: UUID (Primary Key),
  bookingId: UUID (Foreign Key),
  filename: String,
  originalFilename: String,
  filePath: String,
  fileSize: Integer (bytes),
  mimeType: String,
  uploadedAt: DateTime
}
```

### 2.4 BlockedDate Model
```javascript
{
  id: UUID (Primary Key),
  date: Date (Unique),
  reason: String (Optional),
  blockedBy: UUID (Foreign Key to Users),
  createdAt: DateTime
}
```

---

## 3. FILE UPLOAD HANDLING

### Requirements:
- **Storage**: Use cloud storage (AWS S3, Google Cloud Storage, or Azure Blob) OR local filesystem with proper security
- **File Validation**:
  - Max file size: 10MB per file
  - Allowed types: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`
  - Max files per booking: 10 files
- **Security**:
  - Scan files for malware/viruses
  - Rename files to prevent conflicts (use UUID)
  - Store files in organized structure: `/uploads/bookings/{bookingId}/{filename}`
  - Implement file access controls (only booking owner/admin can access)
- **File Serving**:
  - Create endpoint: `GET /api/uploads/:fileId`
  - Implement proper authentication/authorization
  - Set appropriate headers (Content-Type, Content-Disposition)

### File Upload Flow:
1. Client uploads files as multipart/form-data
2. Server validates file type and size
3. Server scans file for security
4. Server generates unique filename
5. Server saves file to storage
6. Server creates File record in database
7. Server returns file metadata to client

---

## 4. EMAIL & SMS NOTIFICATIONS

### 4.1 Email Notifications

**Booking Confirmation Email (to Customer):**
- **Trigger**: When booking is created
- **Subject**: "Booking Confirmed - TrueLine Tiling"
- **Content**:
  - Booking reference number
  - Service details
  - Preferred date/time
  - Next steps
  - Contact information
- **Template**: Professional HTML email with company branding

**Admin Notification Email:**
- **Trigger**: When new booking is created
- **Recipients**: Admin/Staff email addresses
- **Content**:
  - Booking details
  - Customer information
  - Link to admin dashboard

**Status Update Email (to Customer):**
- **Trigger**: When booking status changes
- **Content**: Updated status and relevant information

### 4.2 SMS Notifications (Optional but Recommended)

**Booking Confirmation SMS:**
- **Trigger**: When booking is created
- **Content**: "Hi {name}, your booking TR-{ref} is confirmed. We'll contact you within 24hrs. TrueLine Tiling"

**Reminder SMS:**
- **Trigger**: 24 hours before scheduled appointment
- **Content**: Reminder of upcoming appointment

**Implementation Notes:**
- Use services like Twilio, AWS SNS, or MessageBird
- Store SMS delivery status
- Implement retry logic for failed sends
- Respect opt-out preferences

---

## 5. ADMIN DASHBOARD APIs

### 5.1 Authentication (if needed)
**POST** `/api/auth/login`
**POST** `/api/auth/logout`
**GET** `/api/auth/me`

### 5.2 Dashboard Statistics
**GET** `/api/admin/dashboard/stats`

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalBookings": 150,
    "pendingBookings": 12,
    "confirmedBookings": 8,
    "completedBookings": 120,
    "cancelledBookings": 10,
    "revenue": 450000,
    "bookingsThisMonth": 25,
    "bookingsLastMonth": 30
  }
}
```

### 5.3 Calendar View
**GET** `/api/admin/bookings/calendar?startDate=2024-03-01&endDate=2024-03-31`

**Response:**
```json
{
  "success": true,
  "calendar": [
    {
      "date": "2024-03-15",
      "bookings": [
        {
          "id": "uuid",
          "bookingRef": "TR-12345",
          "timeSlot": "morning",
          "customerName": "John Doe",
          "serviceId": "bathroom",
          "status": "confirmed"
        }
      ],
      "isBlocked": false
    }
  ]
}
```

---

## 6. SERVICES MANAGEMENT API

### 6.1 Get All Services
**GET** `/api/services`

**Response:**
```json
{
  "success": true,
  "services": [
    {
      "id": "bathroom",
      "title": "Bathroom Tiling",
      "description": "...",
      "materials": ["Ceramic", "Porcelain", ...],
      "timeframe": "3-7 days",
      "useCases": [...],
      "isActive": true
    }
  ]
}
```

### 6.2 Get Service by ID
**GET** `/api/services/:id`

---

## 7. CONTACT FORM API

### 7.1 Submit Contact Form
**POST** `/api/contact`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0400000000",
  "subject": "General Inquiry",
  "message": "I need a quote for..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your inquiry. We'll get back to you within 24 hours."
}
```

---

## 8. TECHNICAL REQUIREMENTS

### 8.1 Technology Stack Recommendations
- **Framework**: Node.js (Express/Fastify), Python (Django/FastAPI), or Java (Spring Boot)
- **Database**: PostgreSQL or MySQL
- **File Storage**: AWS S3, Google Cloud Storage, or local filesystem
- **Email**: SendGrid, AWS SES, or Mailgun
- **SMS**: Twilio, AWS SNS, or MessageBird
- **Validation**: Use validation libraries (Joi, Zod, Pydantic, etc.)
- **Error Handling**: Consistent error response format
- **Logging**: Implement proper logging (Winston, Pino, etc.)
- **Rate Limiting**: Implement rate limiting for API endpoints
- **CORS**: Configure CORS for frontend domain

### 8.2 Security Requirements
- **Input Validation**: Validate and sanitize all inputs
- **SQL Injection Prevention**: Use parameterized queries
- **XSS Prevention**: Sanitize user inputs
- **File Upload Security**: Validate file types, scan for malware
- **Authentication**: Implement JWT or session-based auth for admin
- **HTTPS**: Enforce HTTPS in production
- **Environment Variables**: Store sensitive data in environment variables
- **API Rate Limiting**: Prevent abuse

### 8.3 Database Indexing
Create indexes on:
- `bookings.bookingRef` (unique)
- `bookings.status`
- `bookings.preferredDate`
- `bookings.customerEmail`
- `bookings.createdAt`
- `blockedDates.date` (unique)

### 8.4 Error Response Format
All errors should follow this format:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": {
      "email": "Invalid email format",
      "postcode": "Must be 4 digits"
    }
  }
}
```

---

## 9. API ENDPOINTS SUMMARY

### Booking Endpoints
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:bookingRef` - Get booking by reference
- `GET /api/bookings` - Get all bookings (admin, paginated)
- `PATCH /api/bookings/:id/status` - Update booking status
- `POST /api/bookings/block-dates` - Block dates
- `GET /api/bookings/blocked-dates` - Get blocked dates

### Service Endpoints
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID

### Contact Endpoints
- `POST /api/contact` - Submit contact form

### Admin Endpoints
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/bookings/calendar` - Calendar view

### File Endpoints
- `GET /api/uploads/:fileId` - Get uploaded file

---

## 10. TESTING REQUIREMENTS

### Unit Tests
- Test all validation rules
- Test booking creation logic
- Test file upload handling
- Test email/SMS sending logic

### Integration Tests
- Test complete booking flow
- Test file upload and retrieval
- Test admin operations

### API Tests
- Test all endpoints with valid data
- Test all endpoints with invalid data
- Test error handling
- Test authentication/authorization

---

## 11. DEPLOYMENT CONSIDERATIONS

- **Environment Variables**: Configure for development, staging, production
- **Database Migrations**: Use migration tools
- **Backup Strategy**: Regular database backups
- **Monitoring**: Set up error tracking (Sentry, etc.)
- **Documentation**: API documentation (Swagger/OpenAPI)
- **CI/CD**: Automated testing and deployment

---

## 12. FRONTEND INTEGRATION NOTES

The frontend expects:
- CORS enabled for frontend domain
- JSON responses with consistent format
- File uploads as multipart/form-data
- Error responses in the format specified above
- Booking reference format: "TR-{5-digit-number}"

---

## Questions to Consider

1. **Authentication**: Do you need user accounts for customers, or just admin authentication?
2. **Payment**: Will you integrate payment processing for deposits/quotes?
3. **Quotes**: Do you need a separate quote system, or is booking sufficient?
4. **Notifications**: Email only, or also SMS/Push notifications?
5. **Admin Users**: Single admin or multiple staff members with roles?
6. **Analytics**: Do you need booking analytics and reporting?

---

## Priority Implementation Order

1. **Phase 1 (Critical)**:
   - Booking creation endpoint
   - File upload handling
   - Email notifications
   - Basic admin booking list

2. **Phase 2 (Important)**:
   - Booking status management
   - Calendar view
   - Blocked dates
   - Dashboard statistics

3. **Phase 3 (Enhancement)**:
   - SMS notifications
   - Advanced search/filtering
   - Analytics and reporting
   - Customer portal (if needed)

---

This document should provide a comprehensive guide for backend development. Adjust based on your specific technology choices and business requirements.

