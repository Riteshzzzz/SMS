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
    created_by = models.IntegerField(null=True, blank=True)
    updated_by = models.IntegerField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['role', 'is_active']),
            models.Index(fields=['flat']),
        ]

