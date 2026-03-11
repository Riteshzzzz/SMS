from django.db import models

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
