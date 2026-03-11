from django.db import models

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
