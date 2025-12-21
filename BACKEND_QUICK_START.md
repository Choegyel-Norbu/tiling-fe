# Backend Quick Start Guide

## Essential Endpoints for Booking System

### 1. Create Booking (Priority 1)
```
POST /api/bookings
Content-Type: multipart/form-data

Fields:
- serviceId: string (required)
- jobSize: "small" | "medium" | "large" (required)
- suburb: string (required)
- postcode: string, 4 digits (required)
- description: string (optional)
- date: ISO date string (required, future date)
- timeSlot: "morning" | "afternoon" | "flexible" (required)
- name: string (required)
- email: valid email (required)
- phone: string (required)
- files: File[] (optional, max 10MB each, images/PDF only)

Response:
{
  "success": true,
  "booking": {
    "bookingRef": "TR-12345",
    "status": "pending",
    ...
  }
}
```

### 2. Get Booking by Reference
```
GET /api/bookings/:bookingRef
```

### 3. Admin: List Bookings
```
GET /api/bookings?status=pending&page=1&limit=20
```

### 4. Admin: Update Status
```
PATCH /api/bookings/:id/status
Body: { "status": "confirmed" }
```

### 5. Block Dates
```
POST /api/bookings/block-dates
Body: { "dates": ["2024-03-15"] }
```

## Database Schema (Minimal)

```sql
-- Bookings Table
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  booking_ref VARCHAR(20) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  service_id VARCHAR(50) NOT NULL,
  job_size VARCHAR(20) NOT NULL,
  suburb VARCHAR(100) NOT NULL,
  postcode VARCHAR(4) NOT NULL,
  description TEXT,
  preferred_date DATE NOT NULL,
  time_slot VARCHAR(20) NOT NULL,
  customer_name VARCHAR(200) NOT NULL,
  customer_email VARCHAR(200) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Files Table
CREATE TABLE files (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  filename VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Blocked Dates Table
CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Key Validations

1. **Postcode**: Exactly 4 digits, Australian format
2. **Date**: Must be future date
3. **Email**: Valid email format
4. **Phone**: Australian format (10 digits)
5. **Files**: Max 10MB, types: image/*, application/pdf
6. **Service ID**: Must exist in services list

## Email Notifications

Send email when booking is created:
- **To Customer**: Confirmation with booking reference
- **To Admin**: New booking notification

## File Upload

1. Accept multipart/form-data
2. Validate file type and size
3. Store in secure location
4. Save file metadata to database
5. Return file URLs in response

## Booking Reference Format

Generate: `TR-{5-digit-random-number}`
Example: `TR-12345`

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": {
      "email": "Invalid email format"
    }
  }
}
```

## Implementation Checklist

- [ ] Create booking endpoint with validation
- [ ] File upload handling
- [ ] Email notification service
- [ ] Database models/schemas
- [ ] Admin endpoints (list, update status)
- [ ] Blocked dates functionality
- [ ] Error handling
- [ ] CORS configuration
- [ ] API documentation

