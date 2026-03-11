import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'society_management.settings')

app = Celery('society_management')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'generate-monthly-bills': {
        'task': 'maintenance.tasks.generate_monthly_bills',
        'schedule': 86400 * 30,  # roughly monthly
    },
    'apply-penalties': {
        'task': 'maintenance.tasks.add_penalty_to_overdue_bills',
        'schedule': 86400,  # daily
    },
    'auto-close-complaints': {
        'task': 'complaints.tasks.auto_close_resolved_complaints',
        'schedule': 86400,  # daily
    },
}
