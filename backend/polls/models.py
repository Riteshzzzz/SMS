from django.db import models

class Poll(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    question = models.TextField()
    allow_multiple_choice = models.BooleanField(default=False)
    is_anonymous = models.BooleanField(default=False)
    eligible_voters = models.CharField(max_length=20, default='all')
    eligible_towers = models.JSONField(default=list, blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.CharField(max_length=10, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)

class PollOption(models.Model):
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name='options')
    option_text = models.CharField(max_length=200)
    voted_by = models.ManyToManyField('users.User', blank=True)
