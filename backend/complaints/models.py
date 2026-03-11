from django.db import models

class Complaint(models.Model):
    CATEGORY_CHOICES = [('plumbing','Plumbing'),('electrical','Electrical'),
                        ('security','Security'),('noise','Noise'),('lift','Lift'),('other','Other')]
    PRIORITY_CHOICES = [('low','Low'),('medium','Medium'),('high','High'),('critical','Critical')]
    STATUS_CHOICES = [('pending','Pending'),('acknowledged','Acknowledged'),
                      ('in_progress','In Progress'),('resolved','Resolved'),('closed','Closed')]

    flat = models.ForeignKey('flats.Flat', on_delete=models.CASCADE, related_name='complaints')
    raised_by = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='raised_complaints')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    location = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_to = models.ForeignKey('users.User', null=True, blank=True, on_delete=models.SET_NULL, related_name='assigned_complaints')
    assigned_date = models.DateTimeField(null=True, blank=True)
    resolution_details = models.TextField(blank=True)
    resolved_date = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey('users.User', null=True, blank=True, on_delete=models.SET_NULL, related_name='resolved_complaints')
    resident_feedback = models.TextField(blank=True)
    rating = models.PositiveSmallIntegerField(null=True, blank=True)  # 1-5
    date_raised = models.DateTimeField(auto_now_add=True)
    expected_resolution_date = models.DateField(null=True, blank=True)
    actual_resolution_date = models.DateField(null=True, blank=True)
    is_escalated = models.BooleanField(default=False)
    escalated_to = models.ForeignKey('users.User', null=True, blank=True, on_delete=models.SET_NULL, related_name='escalated_complaints')
    escalation_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ComplaintStatusHistory(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=20)
    updated_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

class ComplaintPhoto(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='photos')
    photo = models.ImageField(upload_to='complaints/')
