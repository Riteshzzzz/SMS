from django.db import models

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
