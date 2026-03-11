from django.db import models

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
