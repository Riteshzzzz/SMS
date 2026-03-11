# 🏢 BUILDING MANAGEMENT SYSTEM - AI AGENT PROMPT
## Copy & Paste This Entire Prompt Into Antigravity IDE

---

```
I need you to build a complete Building/Society Management System following the SOCIETY_MANAGEMENT_INSTRUCTION.md file.

## 🎯 PROJECT BRIEF:

**Building Management System** - A comprehensive digital platform for managing residential societies, apartment complexes, and gated communities.

**Three User Roles:**
1. **Admin** - Full system control, manages flats, billing, residents, generates reports
2. **Resident/User** - View bills, make payments, file complaints, book amenities, manage visitors
3. **Security** - Visitor entry/exit, gate management, vehicle tracking, emergency alerts

**Core Purpose:**
Replace manual, paper-based society management with a modern, automated, transparent digital system.

---

## 📋 WHAT YOU NEED TO BUILD:

### **System Components:**

1. **Backend API Server** (Django + Django REST Framework + PostgreSQL)
   - RESTful API with 50+ endpoints using DRF ViewSets and Routers
   - JWT authentication via djangorestframework-simplejwt
   - Role-based permissions via DRF custom Permission classes
   - Real-time updates via Django Channels (WebSockets)
   - Automated Celery tasks for billing and reminders
   - File upload handling (photos, documents) via django-storages + Cloudinary

2. **Admin Portal** (Next.js + React)
   - Dashboard with analytics
   - Flat management (CRUD)
   - Maintenance billing & payment tracking
   - Notice management
   - Complaint resolution
   - Visitor logs & analytics
   - Security personnel management
   - Amenities management
   - Reports & exports

3. **Resident Portal** (Next.js + React)
   - Personal dashboard
   - View/pay maintenance bills
   - File & track complaints
   - Pre-approve visitors
   - Book amenities
   - View notices & events
   - Family member management
   - Payment history

4. **Security Portal** (Next.js + React)
   - Visitor entry/exit form
   - Photo capture for visitors
   - Currently inside visitor list
   - Pre-approved visitor alerts
   - Vehicle tracking
   - Emergency contacts
   - Shift management
   - Incident reporting

---

## 🗄️ DATABASE DESIGN (Django Models in PostgreSQL):

Create these Django models with proper schemas from SOCIETY_MANAGEMENT_INSTRUCTION.md:

### 1. **User Model** (`users/models.py` — extends AbstractUser)
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
    flat = models.ForeignKey('flats.Flat', null=True, blank=True, on_delete=models.SET_NULL)
    security_profile = models.OneToOneField('security.SecurityProfile', null=True, blank=True, on_delete=models.SET_NULL)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    created_by = models.IntegerField(null=True, blank=True)
    updated_by = models.IntegerField(null=True, blank=True)

    AUTH_USER_MODEL = 'users.User'  # Set in settings.py

    class Meta:
        indexes = [
            models.Index(fields=['role', 'is_active']),
            models.Index(fields=['flat']),
        ]
```

### 2. **Flat Model** (`flats/models.py`)
```python
class Flat(models.Model):
    flat_no = models.CharField(max_length=20, unique=True)   # "A-101", "B-205"
    owner_name = models.CharField(max_length=100)
    owner_email = models.EmailField(blank=True)
    contact_no = models.CharField(max_length=15)
    alternate_contact = models.CharField(max_length=15, blank=True)
    floor_no = models.IntegerField()
    tower_block = models.CharField(max_length=10)            # "A", "B", "C"
    bhk_type = models.CharField(max_length=20, choices=[...])
    area_sqft = models.DecimalField(max_digits=8, decimal_places=2)
    occupancy_status = models.CharField(max_length=20, choices=[
        ('owner_occupied','Owner Occupied'),('rented','Rented'),('vacant','Vacant')
    ], default='owner_occupied')
    tenant_name = models.CharField(max_length=100, blank=True)
    tenant_contact = models.CharField(max_length=15, blank=True)
    tenant_email = models.EmailField(blank=True)
    lease_start_date = models.DateField(null=True, blank=True)
    lease_end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# Related models: FamilyMember, DomesticHelp, ParkingAllocation (ForeignKey to Flat)
```

### 3. **Maintenance Model** (`maintenance/models.py`)
```python
class Maintenance(models.Model):
    flat = models.ForeignKey('flats.Flat', on_delete=models.CASCADE)
    month = models.CharField(max_length=20)          # "March 2026"
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
    status = models.CharField(max_length=20, choices=[
        ('unpaid','Unpaid'),('paid','Paid'),
        ('partially_paid','Partially Paid'),('overdue','Overdue')
    ], default='unpaid')
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    balance_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_date = models.DateField(null=True, blank=True)
    payment_method = models.CharField(max_length=20, blank=True)
    transaction_id = models.CharField(max_length=100, blank=True)
    receipt_number = models.CharField(max_length=50, blank=True)
    due_date = models.DateField()
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### 4. **Notice Model** (`notices/models.py`)
```python
class Notice(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20)       # 'general', 'maintenance', 'event', 'emergency'
    priority = models.CharField(max_length=10)       # 'low', 'medium', 'high', 'urgent'
    target_audience = models.CharField(max_length=20, default='all')
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
```

### 5. **Complaint Model** (`complaints/models.py`)
```python
class Complaint(models.Model):
    flat = models.ForeignKey('flats.Flat', on_delete=models.CASCADE)
    raised_by = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='raised_complaints')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20)       # 'plumbing', 'electrical', 'security', 'noise', 'lift'
    priority = models.CharField(max_length=10)       # 'low', 'medium', 'high', 'critical'
    location = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, default='pending')
    assigned_to = models.ForeignKey('users.User', null=True, blank=True, on_delete=models.SET_NULL, related_name='assigned_complaints')
    assigned_date = models.DateTimeField(null=True, blank=True)
    resolution_details = models.TextField(blank=True)
    resolved_date = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey('users.User', null=True, blank=True, on_delete=models.SET_NULL, related_name='resolved_complaints')
    resident_feedback = models.TextField(blank=True)
    rating = models.PositiveSmallIntegerField(null=True, blank=True)  # 1-5
    date_raised = models.DateTimeField(auto_now_add=True)
    expected_resolution_date = models.DateField(null=True, blank=True)
    is_escalated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# Related: ComplaintStatusHistory, ComplaintPhoto (ForeignKey to Complaint)
```

### 6. **Visitor Model** (`visitors/models.py`)
```python
class Visitor(models.Model):
    visitor_name = models.CharField(max_length=100)
    contact_no = models.CharField(max_length=15)
    visitor_type = models.CharField(max_length=20)   # 'guest', 'delivery', 'service', 'vendor'
    id_proof_type = models.CharField(max_length=30, blank=True)
    id_proof_number = models.CharField(max_length=50, blank=True)
    photo = models.ImageField(upload_to='visitors/', blank=True, null=True)
    flat = models.ForeignKey('flats.Flat', on_delete=models.CASCADE)
    visiting_person = models.CharField(max_length=100)
    purpose = models.CharField(max_length=200)
    vehicle_type = models.CharField(max_length=10, default='none')
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
    expected_arrival_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, default='expected')
    denial_reason = models.TextField(blank=True)
    is_frequent_visitor = models.BooleanField(default=False)
    visitor_pass_id = models.CharField(max_length=50, blank=True)
    pass_validity = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### 7–15. Security, Amenities, Parking, Events, Documents, Polls, Emergency, Expenses
```
All remaining models defined in SOCIETY_MANAGEMENT_INSTRUCTION.md using Django ORM conventions.
Use JSONField for flexible nested data (operational_hours, blackout_dates, target_towers).
Use ManyToManyField for poll votes, notice acknowledgments.
Use related_name consistently for reverse lookups.
```

---

## 🔐 AUTHENTICATION & SECURITY:

### **JWT Authentication (djangorestframework-simplejwt):**
```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}

# urls.py
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns += [
    path('api/auth/login/', TokenObtainPairView.as_view()),
    path('api/auth/token/refresh/', TokenRefreshView.as_view()),
]
```

### **Role-Based Access Control (DRF Permission Classes):**
```python
# permissions.py
from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsResident(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'resident'

class IsSecurity(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'security'

class IsAdminOrResident(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'resident']

# Usage in views.py
class FlatViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]

class MaintenanceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrResident]

class VisitorViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSecurity]
```

### **Password Security (Django built-in):**
```python
# Django handles hashing automatically via AbstractUser
# set_password() uses PBKDF2 with SHA256 by default

# In serializer:
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user
```

### **Rate Limiting (django-ratelimit):**
```python
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator

class LoginView(TokenObtainPairView):
    @method_decorator(ratelimit(key='ip', rate='5/15m', method='POST', block=True))
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
```

### **Input Validation (DRF Serializers):**
```python
import re
from rest_framework import serializers

class FlatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flat
        fields = '__all__'

    def validate_contact_no(self, value):
        if not re.match(r'^[6-9]\d{9}$', value):  # Indian mobile validation
            raise serializers.ValidationError("Enter a valid Indian mobile number.")
        return value

    def validate_flat_no(self, value):
        if len(value) > 10:
            raise serializers.ValidationError("Flat number too long.")
        return value
```

---

## 🔌 API ENDPOINTS (50+ Routes via DRF Router):

### **Project URL Configuration (`urls.py`):**
```python
from rest_framework.routers import DefaultRouter
from django.urls import path, include

router = DefaultRouter()
router.register(r'flats', FlatViewSet)
router.register(r'maintenance', MaintenanceViewSet)
router.register(r'notices', NoticeViewSet)
router.register(r'complaints', ComplaintViewSet)
router.register(r'visitors', VisitorViewSet)
router.register(r'amenities', AmenityViewSet)
router.register(r'amenity-bookings', AmenityBookingViewSet)
router.register(r'parking-slots', ParkingSlotViewSet)
router.register(r'events', EventViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/login/', TokenObtainPairView.as_view()),
    path('api/auth/token/refresh/', TokenRefreshView.as_view()),
    path('api/auth/change-password/', ChangePasswordView.as_view()),
    path('api/auth/forgot-password/', ForgotPasswordView.as_view()),
    path('api/auth/reset-password/<str:token>/', ResetPasswordView.as_view()),
    path('api/reports/', include('reports.urls')),
]
```

### **Authentication Routes:**
```
POST   /api/auth/login/                  # Login — returns JWT access + refresh tokens
POST   /api/auth/token/refresh/          # Refresh JWT
POST   /api/auth/change-password/        # Change password
POST   /api/auth/forgot-password/        # Send reset email
POST   /api/auth/reset-password/<token>/ # Reset password
```

### **Flat Management Routes (via DRF Router):**
```
GET    /api/flats/                       # List all flats (Admin)
POST   /api/flats/                       # Create flat (Admin)
GET    /api/flats/{id}/                  # Get flat details
PUT    /api/flats/{id}/                  # Update flat (Admin)
DELETE /api/flats/{id}/                  # Delete flat (Admin)
POST   /api/flats/{id}/add_family_member/     # Add family member
DELETE /api/flats/{id}/remove_family_member/  # Remove member
POST   /api/flats/{id}/add_domestic_help/     # Add domestic help
```

### **Maintenance Routes:**
```
GET    /api/maintenance/                 # Get bills (filtered by role)
POST   /api/maintenance/                 # Create bill (Admin)
GET    /api/maintenance/{id}/            # Get bill details
PUT    /api/maintenance/{id}/            # Update bill (Admin)
POST   /api/maintenance/{id}/record_payment/   # Record payment
GET    /api/maintenance/{id}/receipt/          # Download PDF receipt
GET    /api/maintenance/outstanding_dues/      # Outstanding dues report
POST   /api/maintenance/generate_monthly/      # Generate bills (Admin/Celery)
```

### **Notice Routes:**
```
GET    /api/notices/                     # Get all notices
POST   /api/notices/                     # Create notice (Admin)
GET    /api/notices/{id}/                # Get notice details
PUT    /api/notices/{id}/                # Update notice (Admin)
DELETE /api/notices/{id}/                # Delete notice (Admin)
POST   /api/notices/{id}/acknowledge/    # Acknowledge notice (Resident)
```

### **Complaint Routes:**
```
GET    /api/complaints/                  # Get complaints (filtered by role)
POST   /api/complaints/                  # File complaint
GET    /api/complaints/{id}/             # Get complaint details
PUT    /api/complaints/{id}/             # Update complaint
PATCH  /api/complaints/{id}/update_status/     # Update status (Admin)
POST   /api/complaints/{id}/assign/            # Assign complaint (Admin)
POST   /api/complaints/{id}/submit_feedback/   # Submit feedback (Resident)
```

### **Visitor Routes:**
```
GET    /api/visitors/                    # Get visitor logs
POST   /api/visitors/                    # Create entry (Security)
GET    /api/visitors/{id}/               # Get visitor details
POST   /api/visitors/{id}/checkout/      # Checkout (Security)
POST   /api/visitors/pre_approve/        # Pre-approve visitor (Resident)
GET    /api/visitors/currently_inside/   # Currently inside
GET    /api/visitors/pre_approved/       # Expected visitors
```

### **Amenities Routes:**
```
GET    /api/amenities/                   # Get all amenities
POST   /api/amenities/                   # Create amenity (Admin)
GET    /api/amenities/{id}/              # Get amenity details
PUT    /api/amenities/{id}/              # Update amenity (Admin)
GET    /api/amenities/{id}/availability/ # Check available slots
```

### **Amenity Booking Routes:**
```
GET    /api/amenity-bookings/            # Get bookings
POST   /api/amenity-bookings/            # Create booking
PUT    /api/amenity-bookings/{id}/       # Update booking
DELETE /api/amenity-bookings/{id}/       # Cancel booking
PATCH  /api/amenity-bookings/{id}/approve/  # Approve (Admin)
PATCH  /api/amenity-bookings/{id}/reject/   # Reject (Admin)
GET    /api/amenity-bookings/my_bookings/   # My bookings (Resident)
```

### **Parking Routes:**
```
GET    /api/parking-slots/               # Get all slots
POST   /api/parking-slots/               # Create slot (Admin)
GET    /api/parking-slots/{id}/          # Get slot details
POST   /api/parking-slots/{id}/allocate/     # Allocate (Admin)
POST   /api/parking-slots/{id}/deallocate/   # Deallocate (Admin)
POST   /api/parking-slots/report_violation/  # Report wrong parking
```

### **Event Routes:**
```
GET    /api/events/                      # Get all events
POST   /api/events/                      # Create event (Admin)
GET    /api/events/{id}/                 # Get event details
PUT    /api/events/{id}/                 # Update event (Admin)
POST   /api/events/{id}/register/        # Register for event (Resident)
```

### **Report Routes (Admin Only):**
```
GET    /api/reports/financial-summary/?month=March&year=2026
GET    /api/reports/visitor-analytics/?from=DATE&to=DATE
GET    /api/reports/complaint-analytics/?month=March&year=2026
GET    /api/reports/amenity-utilization/
GET    /api/reports/outstanding-dues/
GET    /api/reports/collection-summary/
```

---

## ⚙️ AUTOMATED CELERY TASKS:

### **Implement These Scheduled Tasks (`tasks.py` + `celery_beat` schedule):**

```python
from celery import shared_task
from celery.schedules import crontab
from django.conf import settings

# celery.py (beat schedule)
app.conf.beat_schedule = {
    # 1. Generate monthly bills on 1st of every month at 12:01 AM
    'generate-monthly-bills': {
        'task': 'maintenance.tasks.generate_monthly_bills',
        'schedule': crontab(minute=1, hour=0, day_of_month=1),
    },
    # 2. Send first payment reminder on 5th at 9:00 AM
    'payment-reminder-first': {
        'task': 'maintenance.tasks.send_payment_reminders',
        'schedule': crontab(minute=0, hour=9, day_of_month=5),
        'kwargs': {'reminder_type': 'first_reminder'},
    },
    # 3. Second reminder on 10th
    'payment-reminder-second': {
        'task': 'maintenance.tasks.send_payment_reminders',
        'schedule': crontab(minute=0, hour=9, day_of_month=10),
        'kwargs': {'reminder_type': 'second_reminder'},
    },
    # 4. Final reminder on 15th
    'payment-reminder-final': {
        'task': 'maintenance.tasks.send_payment_reminders',
        'schedule': crontab(minute=0, hour=9, day_of_month=15),
        'kwargs': {'reminder_type': 'final_reminder'},
    },
    # 5. Apply penalty to overdue bills daily at 2 AM
    'apply-penalties': {
        'task': 'maintenance.tasks.add_penalty_to_overdue_bills',
        'schedule': crontab(minute=0, hour=2),
    },
    # 6. Auto-close resolved complaints daily at 3 AM
    'auto-close-complaints': {
        'task': 'complaints.tasks.auto_close_resolved_complaints',
        'schedule': crontab(minute=0, hour=3),
    },
    # 7. Monthly collection report on last day of month at 6 PM
    'monthly-collection-report': {
        'task': 'reports.tasks.send_monthly_collection_report',
        'schedule': crontab(minute=0, hour=18, day_of_month='last'),
    },
}

# maintenance/tasks.py
@shared_task
def generate_monthly_bills():
    from flats.models import Flat
    from maintenance.models import Maintenance
    import datetime
    today = datetime.date.today()
    for flat in Flat.objects.filter(is_active=True):
        Maintenance.objects.get_or_create(
            flat=flat,
            month=today.strftime('%B %Y'),
            year=today.year,
            billing_period=today.replace(day=1),
            defaults={
                'base_maintenance': flat.base_maintenance_amount,
                'total_amount': flat.base_maintenance_amount,
                'due_date': today.replace(day=15),
                'status': 'unpaid',
            }
        )

@shared_task
def send_payment_reminders(reminder_type='first_reminder'):
    from maintenance.models import Maintenance
    from django.core.mail import send_mail
    unpaid_bills = Maintenance.objects.filter(status__in=['unpaid', 'overdue'])
    for bill in unpaid_bills:
        resident = bill.flat.residents.filter(role='resident').first()
        if resident and resident.email:
            send_mail(
                subject=f'Maintenance Payment Reminder – {bill.month}',
                message=f'Dear {resident.get_full_name()}, your maintenance bill of ₹{bill.total_amount} is due.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[resident.email],
            )

@shared_task
def add_penalty_to_overdue_bills():
    from maintenance.models import Maintenance
    import datetime
    overdue = Maintenance.objects.filter(status='unpaid', due_date__lt=datetime.date.today())
    for bill in overdue:
        if bill.penalty == 0:
            bill.penalty = bill.total_amount * 0.02  # 2% penalty
            bill.total_amount += bill.penalty
            bill.status = 'overdue'
            bill.save()
```

---

## 🎨 UI/UX DESIGN SYSTEM:

### **Color Palette:**
```css
/* Primary Colors */
--primary: #2563EB;           /* Blue */
--primary-dark: #1D4ED8;
--primary-light: #3B82F6;

/* Secondary Colors */
--secondary: #10B981;         /* Green */
--success: #10B981;
--warning: #F59E0B;          /* Amber */
--error: #EF4444;            /* Red */
--info: #3B82F6;

/* Neutral Colors */
--background: #FFFFFF;
--surface: #F9FAFB;
--text-primary: #111827;
--text-secondary: #6B7280;
--border: #E5E7EB;

/* Dark Theme */
--dark-bg: #111827;
--dark-surface: #1F2937;
--dark-text: #F9FAFB;
```

### **Typography:**
```css
--font-primary: 'Inter', sans-serif;
--font-heading: 'Poppins', sans-serif;

--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
```

### **Component Requirements:**

**Admin Dashboard:**
- Sidebar with navigation
- Header with notifications and profile
- Stats cards (4 cards: Flats, Collection, Complaints, Visitors)
- Charts (Line chart for collection, Pie chart for complaints)
- Recent activities table
- Responsive design

**Resident Dashboard:**
- Top navigation bar
- Flat info card
- Payment due alert (if unpaid)
- Quick action buttons
- Recent notices list
- Upcoming bookings

**Security Dashboard:**
- Shift info card
- Quick stats
- Visitor entry form with photo capture
- Currently inside visitors list
- Pre-approved visitors alerts
- Emergency contact buttons

---

## 📦 TECHNOLOGY STACK:

### **Backend Dependencies (`requirements.txt`):**
```
Django==4.2.9
djangorestframework==3.15.1
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.1
django-filter==23.5
django-ratelimit==4.1.0
django-storages==1.14.2
channels==4.0.0
channels-redis==4.2.0
celery==5.3.6
django-celery-beat==2.5.0
redis==5.0.1
psycopg2-binary==2.9.9
Pillow==10.2.0
cloudinary==1.39.0
reportlab==4.1.0
WeasyPrint==62.3
twilio==8.10.3
sendgrid==6.11.0
gunicorn==21.2.0
python-dotenv==1.0.1
razorpay==1.4.1
pytest-django==4.7.0
factory-boy==3.3.0
```

### **Frontend Dependencies:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "tailwindcss": "^3.3.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.294.0",
    "zustand": "^4.4.6",
    "react-hook-form": "^7.48.2",
    "zod": "^3.22.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "axios": "^1.6.2",
    "react-hot-toast": "^2.4.1",
    "recharts": "^2.10.0",
    "date-fns": "^3.0.0"
  }
}
```

---

## 🚀 IMPLEMENTATION PHASES:

### **PHASE 1: Foundation (Week 1-2)**
✅ Django project + app structure
✅ PostgreSQL database + all migrations
✅ Custom User model + JWT auth
✅ DRF setup + permissions
✅ Flat management ViewSet (CRUD + family members)

### **PHASE 2: Financial (Week 3-4)**
✅ Maintenance billing ViewSet
✅ Celery + celery-beat for automated bill generation
✅ Payment recording + status transitions
✅ PDF receipt generation (ReportLab)
✅ Outstanding dues tracking endpoint
✅ Email payment reminders via Celery

### **PHASE 3: Communication (Week 5-6)**
✅ Notice management ViewSet
✅ Complaint system (full workflow + status history)
✅ Email/SMS notifications (SendGrid + Twilio)
✅ Django Channels WebSocket consumers
✅ Notification preferences

### **PHASE 4: Operations (Week 7-8)**
✅ Visitor management (entry/exit/photo)
✅ Amenities + booking ViewSets
✅ Booking calendar availability logic
✅ Parking management
✅ Event management

### **PHASE 5: Analytics & Polish (Week 9-10)**
✅ Reports & dashboard API endpoints
✅ Analytics aggregations (Django ORM .annotate())
✅ PDF/Excel export (ReportLab + openpyxl)
✅ Testing with pytest-django
✅ Deployment with Gunicorn + Nginx (or Railway/Render)

---

## 🎯 YOUR INSTRUCTIONS:

**BUILD THE COMPLETE SYSTEM WITH THESE STEPS:**

1. **Create Project Structure:**
```
building-management/
├── backend/
│   ├── society_management/     # Django project root
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── celery.py
│   │   └── asgi.py             # For Django Channels
│   ├── users/                  # Custom User app
│   ├── flats/
│   ├── maintenance/
│   ├── notices/
│   ├── complaints/
│   ├── visitors/
│   ├── security/
│   ├── amenities/
│   ├── parking/
│   ├── events/
│   ├── documents/
│   ├── polls/
│   ├── emergency/
│   ├── expenses/
│   ├── reports/
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend-admin/
├── frontend-resident/
├── frontend-security/
└── SOCIETY_MANAGEMENT_INSTRUCTION.md
```

2. **Set up Backend:**
- Create Django project: `django-admin startproject society_management`
- Create all 15 apps: `python manage.py startapp <app_name>`
- Configure PostgreSQL in `settings.py`
- Set `AUTH_USER_MODEL = 'users.User'`
- Configure DRF, SimpleJWT, CORS, Channels, Celery in settings
- Build all Django models with proper relationships
- Run `makemigrations` and `migrate`
- Configure DRF Routers and ViewSets
- Add DRF permission classes per role
- Set up Django Channels for WebSockets
- Configure Celery + Redis + celery-beat

3. **Build Admin Portal:**
- Dashboard with stats and charts (fetched from `/api/reports/`)
- Flat management (table, CRUD forms)
- Maintenance billing (generate, track, receipts)
- Notice management (create, publish)
- Complaint resolution (assign, update status)
- Visitor analytics
- Security management
- Amenity management
- Reports (financial, visitor, complaint)

4. **Build Resident Portal:**
- Dashboard (flat info, payment alerts)
- View/pay bills
- File complaints
- Track complaint status
- Pre-approve visitors
- Book amenities
- View notices
- Family member management

5. **Build Security Portal:**
- Visitor entry form (with photo capture)
- Currently inside list
- Check-out functionality
- Pre-approved visitor alerts
- Vehicle tracking
- Emergency contacts
- Shift management
- Attendance marking

6. **Implement Real-time Features (Django Channels):**
```python
# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class SocietyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'society_updates'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def visitor_arrival(self, event):
        await self.send(text_data=json.dumps({'type': 'visitor_arrival', 'data': event['data']}))

    async def payment_confirmed(self, event):
        await self.send(text_data=json.dumps({'type': 'payment_confirmed', 'data': event['data']}))

    async def emergency_alert(self, event):
        await self.send(text_data=json.dumps({'type': 'emergency_alert', 'data': event['data']}))
```

7. **Add Automated Celery Tasks:**
- Monthly bill generation
- Payment reminders
- Penalty calculation
- Auto-close complaints
- Monthly reports

8. **Testing (pytest-django):**
```python
# tests/test_maintenance.py
import pytest
from django.urls import reverse

@pytest.mark.django_db
def test_generate_monthly_bills(admin_client, flat_factory):
    flat = flat_factory()
    response = admin_client.post(reverse('maintenance-generate-monthly'))
    assert response.status_code == 200
    assert Maintenance.objects.filter(flat=flat).exists()
```

---

## ✅ DELIVERABLES:

When complete, I should have:

1. ✅ Django REST Framework API with 50+ endpoints
2. ✅ 15 Django apps with proper models and migrations
3. ✅ JWT authentication with RBAC (DRF permission classes)
4. ✅ Admin portal (fully functional)
5. ✅ Resident portal (fully functional)
6. ✅ Security portal (fully functional)
7. ✅ Real-time notifications (Django Channels + WebSockets)
8. ✅ Automated Celery tasks + celery-beat scheduler
9. ✅ Email/SMS integration (SendGrid + Twilio)
10. ✅ File upload (photos, documents) via django-storages + Cloudinary
11. ✅ PDF generation (receipts, reports via ReportLab)
12. ✅ Payment integration (Razorpay)
13. ✅ Reports & analytics (Django ORM aggregations)
14. ✅ Responsive UI (mobile-friendly)
15. ✅ Environment setup guide (.env.example)

---

## 🚀 START BUILDING NOW!

**Read SOCIETY_MANAGEMENT_INSTRUCTION.md and start with Phase 1.**

Build the Django project structure, configure settings, create all models and run migrations, then implement JWT authentication and the User + Flat management apps.

After completing each phase, show me the progress and wait for approval before continuing to the next phase.

Let's build a professional, production-ready Building Management System with Django! 🏢💪

BEGIN NOW! 🚀
```

---

**PASTE THE ABOVE PROMPT INTO ANTIGRAVITY IDE AND LET THE AI BUILD YOUR BUILDING MANAGEMENT SYSTEM!** ✨
