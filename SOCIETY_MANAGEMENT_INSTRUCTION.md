# Society Management System
## Complete Implementation Guide

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [User Roles & Permissions](#user-roles--permissions)
6. [Feature Modules](#feature-modules)
7. [User Interface Design](#user-interface-design)
8. [Authentication & Security](#authentication--security)
9. [API Endpoints](#api-endpoints)
10. [Deployment Guide](#deployment-guide)
11. [Environment Setup](#environment-setup)

---

## 🎯 Project Overview

**Society Management System** is a comprehensive digital platform designed to streamline the management of residential societies, apartment complexes, and gated communities. The system provides role-based access for three distinct user types:

- **Admin**: Full system control, society management, financial oversight
- **Residents/Users**: Access to personal information, payments, complaints, bookings
- **Security Personnel**: Visitor management, gate control, emergency alerts

### Core Philosophy
- **Digital Transformation**: Eliminate manual, paper-based processes
- **Transparency**: Clear financial records and communication
- **Security**: Enhanced visitor tracking and access control
- **Efficiency**: Automated billing, notifications, and record-keeping
- **Community Engagement**: Foster better communication among residents

### Key Benefits
- Improved security with digital visitor logs
- Automated maintenance billing and payment tracking
- Real-time notifications and announcements
- Streamlined complaint management
- Amenities booking and management
- Comprehensive reporting and analytics
- Enhanced transparency in financial operations

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
├──────────────────┬──────────────────┬───────────────────────┤
│  Admin Portal    │  Resident Portal  │  Security Portal      │
│  (React/Next.js) │  (React/Next.js)  │  (React/Next.js)      │
│  - Dashboard     │  - My Account     │  - Visitor Entry/Exit │
│  - Flat Mgmt     │  - Payments       │  - Gate Management    │
│  - Maintenance   │  - Complaints     │  - Emergency Alerts   │
│  - Notices       │  - Notices        │  - Vehicle Tracking   │
│  - Complaints    │  - Amenities      │  - Resident Contact   │
│  - Visitors      │  - Visitors       │  - Shift Management   │
│  - Reports       │  - Community      │  - Incident Logging   │
└──────────────────┴──────────────────┴───────────────────────┘
                            ↕ HTTPS/REST API
┌─────────────────────────────────────────────────────────────┐
│              API LAYER (Django + Django REST Framework)      │
├─────────────────────────────────────────────────────────────┤
│  - Authentication Service (JWT via djangorestframework-simplejwt) │
│  - User Management Service (Django Groups + Custom Permissions)   │
│  - Flat & Resident Management                               │
│  - Maintenance Billing Service                              │
│  - Payment Processing Service                               │
│  - Notice & Announcement Service                            │
│  - Complaint Management Service                             │
│  - Visitor Management Service                               │
│  - Amenities Booking Service                                │
│  - Parking Management Service                               │
│  - Notification Service (Email/SMS/Push)                    │
│  - Report Generation Service                                │
│  - Real-time Updates (Django Channels + WebSockets)         │
└─────────────────────────────────────────────────────────────┘
                            ↕ Django ORM
┌─────────────────────────────────────────────────────────────┐
│                 DATABASE LAYER (PostgreSQL)                  │
├─────────────────────────────────────────────────────────────┤
│  Apps/Models: Users, Flats, Maintenance, Notices,           │
│              Complaints, Visitors, Security, Amenities,     │
│              Parking, Payments, Documents, Events,          │
│              Polls, EmergencyContacts, Expenses             │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Technology Stack

### Frontend
```javascript
{
  "framework": "Next.js 14 (React 18)",
  "styling": "Tailwind CSS + shadcn/ui",
  "stateManagement": "Zustand / React Context",
  "formHandling": "React Hook Form + Zod",
  "animations": "Framer Motion",
  "icons": "Lucide React",
  "charts": "Recharts / Chart.js",
  "dateHandling": "date-fns",
  "realTime": "WebSocket client (native or socket.io-client)",
  "pdfGeneration": "jsPDF / react-pdf"
}
```

### Backend
```python
{
  "language": "Python 3.11+",
  "framework": "Django 4.2 (LTS)",
  "api": "Django REST Framework (DRF)",
  "database": "PostgreSQL 15 (via psycopg2-binary)",
  "ORM": "Django ORM (built-in)",
  "authentication": "djangorestframework-simplejwt",
  "validation": "DRF Serializers + Django validators",
  "fileUpload": "django-storages + Cloudinary",
  "realTime": "Django Channels + channels-redis",
  "email": "Django email backend + SendGrid",
  "sms": "Twilio Python SDK",
  "scheduling": "Celery + django-celery-beat",
  "pdfGeneration": "reportlab / WeasyPrint",
  "rateLimiting": "django-ratelimit",
  "cors": "django-cors-headers",
  "filtering": "django-filter",
  "search": "django-haystack / PostgreSQL full-text search"
}
```

### Database: PostgreSQL
**Why PostgreSQL?**
- ✅ Robust relational DB with ACID compliance
- ✅ Excellent Django ORM support (migrations, querysets)
- ✅ Native JSON fields for flexible data
- ✅ Full-text search built-in
- ✅ Free on Supabase / Railway / Render (cloud tiers)
- ✅ Battle-tested for production systems

---

## 🗄️ Database Schema

### Django Apps & Models Overview

1. **users** app — Custom User model (Admin/Resident/Security)
2. **flats** app — Flat/apartment details, family members, domestic help
3. **maintenance** app — Monthly billing records
4. **notices** app — Announcements and notices
5. **complaints** app — Complaint tracking
6. **visitors** app — Visitor entry/exit logs
7. **security** app — Security personnel details
8. **amenities** app — Clubhouse, gym, pool, bookings
9. **parking** app — Parking slot allocation
10. **events** app — Community events
11. **documents** app — Society documents
12. **polls** app — Voting and polls
13. **emergency** app — Emergency contacts
14. **expenses** app — Society expenses

---

### 1. **Users Model** (`users/models.py`)
```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('resident', 'Resident'),
        ('security', 'Security'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=15, blank=True)
    flat = models.ForeignKey('flats.Flat', null=True, blank=True, on_delete=models.SET_NULL, related_name='residents')
    security_profile = models.OneToOneField('security.SecurityProfile', null=True, blank=True, on_delete=models.SET_NULL)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(null=True, blank=True)
    created_by = models.IntegerField(null=True, blank=True)
    updated_by = models.IntegerField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['role', 'is_active']),
            models.Index(fields=['flat']),
        ]
```

### 2. **Flats Models** (`flats/models.py`)
```python
class Flat(models.Model):
    OCCUPANCY_CHOICES = [
        ('owner_occupied', 'Owner Occupied'),
        ('rented', 'Rented'),
        ('vacant', 'Vacant'),
    ]
    BHK_CHOICES = [('1BHK','1BHK'),('2BHK','2BHK'),('3BHK','3BHK'),('4BHK','4BHK'),('Penthouse','Penthouse')]

    flat_no = models.CharField(max_length=20, unique=True)  # "A-101"
    owner_name = models.CharField(max_length=100)
    owner_email = models.EmailField(blank=True)
    contact_no = models.CharField(max_length=15)
    alternate_contact = models.CharField(max_length=15, blank=True)
    floor_no = models.IntegerField()
    tower_block = models.CharField(max_length=10)
    bhk_type = models.CharField(max_length=20, choices=BHK_CHOICES)
    area_sqft = models.DecimalField(max_digits=8, decimal_places=2)
    occupancy_status = models.CharField(max_length=20, choices=OCCUPANCY_CHOICES, default='owner_occupied')
    tenant_name = models.CharField(max_length=100, blank=True)
    tenant_contact = models.CharField(max_length=15, blank=True)
    tenant_email = models.EmailField(blank=True)
    lease_start_date = models.DateField(null=True, blank=True)
    lease_end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField(null=True, blank=True)
    updated_by = models.IntegerField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['tower_block', 'floor_no']),
            models.Index(fields=['occupancy_status']),
        ]

class FamilyMember(models.Model):
    RELATION_CHOICES = [('spouse','Spouse'),('child','Child'),('parent','Parent'),('other','Other')]
    flat = models.ForeignKey(Flat, on_delete=models.CASCADE, related_name='family_members')
    name = models.CharField(max_length=100)
    relation = models.CharField(max_length=20, choices=RELATION_CHOICES)
    age = models.PositiveIntegerField(null=True, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    photo = models.ImageField(upload_to='family/', blank=True, null=True)

class DomesticHelp(models.Model):
    TYPE_CHOICES = [('maid','Maid'),('cook','Cook'),('driver','Driver'),('other','Other')]
    flat = models.ForeignKey(Flat, on_delete=models.CASCADE, related_name='domestic_help')
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    contact = models.CharField(max_length=15, blank=True)
    photo = models.ImageField(upload_to='domestic/', blank=True, null=True)
    working_hours = models.CharField(max_length=50, blank=True)
    verification_status = models.CharField(max_length=20, default='pending')

class ParkingAllocation(models.Model):
    flat = models.ForeignKey(Flat, on_delete=models.CASCADE, related_name='parking_allocations')
    parking_number = models.CharField(max_length=20)
    vehicle_type = models.CharField(max_length=10)  # 'car', 'bike'
    vehicle_number = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)
```

### 3. **Maintenance Models** (`maintenance/models.py`)
```python
class Maintenance(models.Model):
    STATUS_CHOICES = [
        ('unpaid','Unpaid'),('paid','Paid'),
        ('partially_paid','Partially Paid'),('overdue','Overdue'),
    ]
    PAYMENT_METHOD_CHOICES = [
        ('cash','Cash'),('upi','UPI'),('card','Card'),('net_banking','Net Banking'),
    ]

    flat = models.ForeignKey('flats.Flat', on_delete=models.CASCADE, related_name='maintenance_bills')
    month = models.CharField(max_length=20)  # "March 2026"
    year = models.IntegerField()
    billing_period = models.DateField()
    base_maintenance = models.DecimalField(max_digits=10, decimal_places=2)
    water_charges = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    electricity_common_area = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    sinking_fund = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    repair_fund = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    parking_charges = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    amenity_charges = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    penalty = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    previous_due = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unpaid')
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    balance_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_date = models.DateField(null=True, blank=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, blank=True)
    transaction_id = models.CharField(max_length=100, blank=True)
    receipt_number = models.CharField(max_length=50, blank=True)
    due_date = models.DateField()
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['flat', 'billing_period']),
            models.Index(fields=['status', 'due_date']),
            models.Index(fields=['month', 'year']),
        ]
```

### 4. **Notices Models** (`notices/models.py`)
```python
class Notice(models.Model):
    CATEGORY_CHOICES = [('general','General'),('maintenance','Maintenance'),('event','Event'),('emergency','Emergency')]
    PRIORITY_CHOICES = [('low','Low'),('medium','Medium'),('high','High'),('urgent','Urgent')]
    AUDIENCE_CHOICES = [('all','All'),('specific_flats','Specific Flats'),('owners_only','Owners Only')]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    target_audience = models.CharField(max_length=20, choices=AUDIENCE_CHOICES, default='all')
    target_flats = models.ManyToManyField('flats.Flat', blank=True)
    target_towers = models.JSONField(default=list, blank=True)
    published_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    published_date = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    requires_acknowledgment = models.BooleanField(default=False)
    acknowledged_by = models.ManyToManyField('users.User', through='NoticeAcknowledgment', related_name='acknowledged_notices')
    is_pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class NoticeAcknowledgment(models.Model):
    notice = models.ForeignKey(Notice, on_delete=models.CASCADE)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    acknowledged_at = models.DateTimeField(auto_now_add=True)

class NoticeAttachment(models.Model):
    notice = models.ForeignKey(Notice, on_delete=models.CASCADE, related_name='attachments')
    file_name = models.CharField(max_length=255)
    file = models.FileField(upload_to='notice_attachments/')
    file_type = models.CharField(max_length=50)
    file_size = models.IntegerField()
```

### 5. **Complaints Models** (`complaints/models.py`)
```python
class Complaint(models.Model):
    CATEGORY_CHOICES = [('plumbing','Plumbing'),('electrical','Electrical'),
                        ('security','Security'),('noise','Noise'),('lift','Lift'),('other','Other')]
    PRIORITY_CHOICES = [('low','Low'),('medium','Medium'),('high','High'),('critical','Critical')]
    STATUS_CHOICES = [('pending','Pending'),('acknowledged','Acknowledged'),
                      ('in_progress','In Progress'),('resolved','Resolved'),('closed','Closed')]

    flat = models.ForeignKey('flats.Flat', on_delete=models.CASCADE, related_name='complaints')
    raised_by = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='raised_complaints')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    location = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_to = models.ForeignKey('users.User', null=True, blank=True, on_delete=models.SET_NULL, related_name='assigned_complaints')
    assigned_date = models.DateTimeField(null=True, blank=True)
    resolution_details = models.TextField(blank=True)
    resolved_date = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey('users.User', null=True, blank=True, on_delete=models.SET_NULL, related_name='resolved_complaints')
    resident_feedback = models.TextField(blank=True)
    rating = models.PositiveSmallIntegerField(null=True, blank=True)  # 1-5
    date_raised = models.DateTimeField(auto_now_add=True)
    expected_resolution_date = models.DateField(null=True, blank=True)
    actual_resolution_date = models.DateField(null=True, blank=True)
    is_escalated = models.BooleanField(default=False)
    escalated_to = models.ForeignKey('users.User', null=True, blank=True, on_delete=models.SET_NULL, related_name='escalated_complaints')
    escalation_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ComplaintStatusHistory(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=20)
    updated_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

class ComplaintPhoto(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='photos')
    photo = models.ImageField(upload_to='complaints/')
```

### 6. **Visitors Models** (`visitors/models.py`)
```python
class Visitor(models.Model):
    VISITOR_TYPE_CHOICES = [('guest','Guest'),('delivery','Delivery'),('service','Service'),('vendor','Vendor')]
    STATUS_CHOICES = [('expected','Expected'),('checked_in','Checked In'),('checked_out','Checked Out'),('denied','Denied')]
    VEHICLE_TYPE_CHOICES = [('car','Car'),('bike','Bike'),('none','None')]

    visitor_name = models.CharField(max_length=100)
    contact_no = models.CharField(max_length=15)
    visitor_type = models.CharField(max_length=20, choices=VISITOR_TYPE_CHOICES)
    id_proof_type = models.CharField(max_length=30, blank=True)
    id_proof_number = models.CharField(max_length=50, blank=True)
    photo = models.ImageField(upload_to='visitors/', blank=True, null=True)
    flat = models.ForeignKey('flats.Flat', on_delete=models.CASCADE, related_name='visitors')
    visiting_person = models.CharField(max_length=100)
    purpose = models.CharField(max_length=200)
    vehicle_type = models.CharField(max_length=10, choices=VEHICLE_TYPE_CHOICES, default='none')
    vehicle_number = models.CharField(max_length=20, blank=True)
    vehicle_photo = models.ImageField(upload_to='vehicles/', blank=True, null=True)
    check_in_time = models.DateTimeField(null=True, blank=True)
    check_out_time = models.DateTimeField(null=True, blank=True)
    duration = models.IntegerField(null=True, blank=True)  # minutes
    checked_in_by = models.ForeignKey('users.User', null=True, blank=True, on_delete=models.SET_NULL, related_name='checked_in_visitors')
    checked_out_by = models.ForeignKey('users.User', null=True, blank=True, on_delete=models.SET_NULL, related_name='checked_out_visitors')
    entry_gate = models.CharField(max_length=50, blank=True)
    exit_gate = models.CharField(max_length=50, blank=True)
    is_pre_approved = models.BooleanField(default=False)
    pre_approved_by = models.ForeignKey('users.User', null=True, blank=True, on_delete=models.SET_NULL, related_name='pre_approved_visitors')
    pre_approval_date = models.DateTimeField(null=True, blank=True)
    expected_arrival_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='expected')
    denial_reason = models.TextField(blank=True)
    is_frequent_visitor = models.BooleanField(default=False)
    visitor_pass_id = models.CharField(max_length=50, blank=True)
    pass_validity = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['flat', 'check_in_time']),
            models.Index(fields=['status', 'check_in_time']),
            models.Index(fields=['contact_no']),
        ]
```

### 7. **Security Models** (`security/models.py`)
```python
class SecurityProfile(models.Model):
    SHIFT_CHOICES = [('day','Day'),('night','Night')]
    EMPLOYMENT_TYPE_CHOICES = [('permanent','Permanent'),('contract','Contract')]

    name = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='security/', blank=True, null=True)
    contact_no = models.CharField(max_length=15)
    alternate_contact = models.CharField(max_length=15, blank=True)
    email = models.EmailField(blank=True)
    employee_id = models.CharField(max_length=30, unique=True)
    aadhar_number = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_number = models.CharField(max_length=15, blank=True)
    date_of_joining = models.DateField()
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES)
    agency_name = models.CharField(max_length=100, blank=True)
    shift = models.CharField(max_length=10, choices=SHIFT_CHOICES)
    shift_timing = models.CharField(max_length=50)
    assigned_gate = models.CharField(max_length=50, blank=True)
    performance_rating = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    termination_date = models.DateField(null=True, blank=True)
    termination_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class AttendanceRecord(models.Model):
    STATUS_CHOICES = [('present','Present'),('absent','Absent'),('late','Late')]
    security = models.ForeignKey(SecurityProfile, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    check_in = models.DateTimeField(null=True, blank=True)
    check_out = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    marked_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    remarks = models.TextField(blank=True)

class IncidentReport(models.Model):
    security = models.ForeignKey(SecurityProfile, on_delete=models.CASCADE, related_name='incident_reports')
    date = models.DateField()
    incident_type = models.CharField(max_length=50)
    description = models.TextField()
    reported_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
```

### 8. **Amenities Models** (`amenities/models.py`)
```python
class Amenity(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=100)
    capacity = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    booking_allowed = models.BooleanField(default=True)
    requires_approval = models.BooleanField(default=False)
    advance_booking_days = models.IntegerField(default=7)
    max_booking_hours = models.IntegerField(default=4)
    booking_slot_duration = models.IntegerField(default=60)  # minutes
    is_chargeable = models.BooleanField(default=False)
    charges_per_hour = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    refundable_deposit = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    cleaning_charges = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    max_bookings_per_flat_per_month = models.IntegerField(default=2)
    operational_hours = models.JSONField(default=dict)  # {monday: {open, close}, ...}
    blackout_dates = models.JSONField(default=list)
    rules_and_regulations = models.TextField(blank=True)
    manager_name = models.CharField(max_length=100, blank=True)
    manager_contact = models.CharField(max_length=15, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class AmenityBooking(models.Model):
    BOOKING_STATUS_CHOICES = [('pending','Pending'),('approved','Approved'),('rejected','Rejected'),
                               ('cancelled','Cancelled'),('completed','Completed')]
    PAYMENT_STATUS_CHOICES = [('pending','Pending'),('paid','Paid'),('refunded','Refunded')]

    amenity = models.ForeignKey(Amenity, on_delete=models.CASCADE, related_name='bookings')
    flat = models.ForeignKey('flats.Flat', on_delete=models.CASCADE)
    booked_by = models.ForeignKey('users.User', on_delete=models.CASCADE)
    booking_date = models.DateField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    duration_hours = models.DecimalField(max_digits=4, decimal_places=1)
    purpose = models.CharField(max_length=200)
    expected_guests = models.IntegerField(default=0)
    total_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deposit_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment_date = models.DateField(null=True, blank=True)
    payment_method = models.CharField(max_length=30, blank=True)
    transaction_id = models.CharField(max_length=100, blank=True)
    booking_status = models.CharField(max_length=20, choices=BOOKING_STATUS_CHOICES, default='pending')
    approved_by = models.ForeignKey('users.User', null=True, blank=True, on_delete=models.SET_NULL, related_name='approved_bookings')
    approval_date = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    cancellation_reason = models.TextField(blank=True)
    refund_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    damage_reported = models.BooleanField(default=False)
    damage_details = models.TextField(blank=True)
    damage_charges = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    rating = models.PositiveSmallIntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### 9. **Parking Models** (`parking/models.py`)
```python
class ParkingSlot(models.Model):
    SLOT_TYPE_CHOICES = [('car','Car'),('bike','Bike')]
    ALLOCATION_TYPE_CHOICES = [('permanent','Permanent'),('temporary','Temporary'),('visitor','Visitor')]

    slot_number = models.CharField(max_length=20, unique=True)
    slot_type = models.CharField(max_length=10, choices=SLOT_TYPE_CHOICES)
    location = models.CharField(max_length=50)
    zone = models.CharField(max_length=10, blank=True)
    allocation_type = models.CharField(max_length=20, choices=ALLOCATION_TYPE_CHOICES)
    allocated_to_flat = models.ForeignKey('flats.Flat', null=True, blank=True, on_delete=models.SET_NULL)
    allocation_date = models.DateField(null=True, blank=True)
    vehicle_type = models.CharField(max_length=10, blank=True)
    vehicle_number = models.CharField(max_length=20, blank=True)
    vehicle_make_model = models.CharField(max_length=100, blank=True)
    vehicle_color = models.CharField(max_length=30, blank=True)
    rc_book_photo = models.ImageField(upload_to='rc_books/', blank=True, null=True)
    is_occupied = models.BooleanField(default=False)
    is_reserved = models.BooleanField(default=False)
    monthly_charges = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    parking_sticker_number = models.CharField(max_length=30, blank=True)
    sticker_issued_date = models.DateField(null=True, blank=True)
    temporary_allocation_start = models.DateField(null=True, blank=True)
    temporary_allocation_end = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### 10–15. **Remaining Models** (`events`, `documents`, `polls`, `emergency`, `expenses` apps)
```python
# events/models.py
class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    event_type = models.CharField(max_length=30)
    event_date = models.DateField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    venue = models.CharField(max_length=100)
    is_open_to_all = models.BooleanField(default=True)
    max_participants = models.IntegerField(null=True, blank=True)
    registration_required = models.BooleanField(default=False)
    registration_deadline = models.DateField(null=True, blank=True)
    participation_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    poster_image = models.ImageField(upload_to='events/', blank=True, null=True)
    status = models.CharField(max_length=20, default='upcoming')
    estimated_budget = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    actual_expense = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# documents/models.py
class Document(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=30)
    file = models.FileField(upload_to='documents/')
    file_type = models.CharField(max_length=20)
    file_size = models.IntegerField()
    access_level = models.CharField(max_length=20, default='all')
    version = models.CharField(max_length=10, blank=True)
    uploaded_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    upload_date = models.DateTimeField(auto_now_add=True)
    is_archived = models.BooleanField(default=False)
    has_expiry = models.BooleanField(default=False)
    expiry_date = models.DateField(null=True, blank=True)

# polls/models.py
class Poll(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    question = models.TextField()
    allow_multiple_choice = models.BooleanField(default=False)
    is_anonymous = models.BooleanField(default=False)
    eligible_voters = models.CharField(max_length=20, default='all')
    eligible_towers = models.JSONField(default=list, blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.CharField(max_length=10, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)

class PollOption(models.Model):
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name='options')
    option_text = models.CharField(max_length=200)
    voted_by = models.ManyToManyField('users.User', blank=True)

# emergency/models.py
class EmergencyContact(models.Model):
    name = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=15)
    alternate_number = models.CharField(max_length=15, blank=True)
    email = models.EmailField(blank=True)
    category = models.CharField(max_length=30)
    is_24x7_available = models.BooleanField(default=False)
    available_hours = models.CharField(max_length=50, blank=True)
    priority_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

# expenses/models.py
class Expense(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=30)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()
    payment_method = models.CharField(max_length=30)
    paid_to = models.CharField(max_length=100)
    invoice_number = models.CharField(max_length=50, blank=True)
    invoice_date = models.DateField(null=True, blank=True)
    invoice_attachment = models.FileField(upload_to='invoices/', blank=True, null=True)
    requires_approval = models.BooleanField(default=True)
    approval_status = models.CharField(max_length=20, default='pending')
    approved_by = models.ForeignKey('users.User', null=True, blank=True, on_delete=models.SET_NULL)
    approval_date = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    is_budgeted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

---

## 🎉 Quick Start

### For AI Agent Integration

Use these prompts with your AI coding assistant:

**Prompt 1: Initial Setup**
```
Read SOCIETY_MANAGEMENT_INSTRUCTION.md and create the complete Django project structure with:
1. Django project named 'society_management'
2. All Django apps (users, flats, maintenance, notices, complaints, visitors, security, amenities, parking, events, documents, polls, emergency, expenses)
3. requirements.txt with all Python dependencies
4. settings.py with PostgreSQL, DRF, Channels, Celery configuration
5. Environment variable templates (.env.example)
```

**Prompt 2: Database Models**
```
Based on SOCIETY_MANAGEMENT_INSTRUCTION.md database schema section, create all Django models with:
- Exact field definitions using Django ORM field types
- Proper relationships (ForeignKey, ManyToManyField, OneToOneField)
- Meta class with indexes
- __str__ methods
- Run makemigrations and migrate
```

**Prompt 3: Authentication**
```
Implement the complete Authentication Module from SOCIETY_MANAGEMENT_INSTRUCTION.md using Django:
- Custom User model extending AbstractUser
- JWT via djangorestframework-simplejwt
- Admin creates user accounts (no self-registration)
- Password reset via email token
- Role-based permissions using DRF permissions classes
- django-ratelimit on login endpoint
```

**Prompt 4: Core Features**
```
Build the following modules according to SOCIETY_MANAGEMENT_INSTRUCTION.md using Django REST Framework:
1. Flat Management (ModelViewSet with CRUD operations)
2. Maintenance Billing (Auto-generation via Celery task, payment tracking)
3. Notice Management (Create, publish, acknowledge with DRF ViewSets)
4. Complaint System (File, track, resolve with status history)
```

**Continue this pattern for remaining modules...**

---

## 📊 Development Phases

### Phase 1: Foundation (Week 1-2)
- ✅ Django project & app setup
- ✅ PostgreSQL database + migrations
- ✅ JWT authentication system
- ✅ Custom user management
- ✅ Flat management

### Phase 2: Financial (Week 3-4)
- ✅ Maintenance billing
- ✅ Celery task for auto bill generation
- ✅ Payment processing
- ✅ PDF receipt generation (ReportLab)
- ✅ Outstanding dues tracking

### Phase 3: Communication (Week 5-6)
- ✅ Notice management
- ✅ Complaint system
- ✅ Email/SMS notifications
- ✅ Django Channels real-time updates

### Phase 4: Operations (Week 7-8)
- ✅ Visitor management
- ✅ Amenities booking
- ✅ Parking management
- ✅ Event management

### Phase 5: Analytics & Polish (Week 9-10)
- ✅ Reports & dashboards
- ✅ Testing (pytest-django)
- ✅ Bug fixes
- ✅ Deployment (Gunicorn + Nginx / Railway / Render)

---

**Built for Modern Residential Communities**
**Version 1.0 | March 2026**
