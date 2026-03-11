from django.db import models

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
