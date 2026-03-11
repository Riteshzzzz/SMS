from django.db import models

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
