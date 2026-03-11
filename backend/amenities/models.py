from django.db import models

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
