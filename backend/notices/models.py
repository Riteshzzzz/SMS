from django.db import models

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
