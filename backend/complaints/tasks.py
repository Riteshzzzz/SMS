from celery import shared_task
import datetime


@shared_task
def auto_close_resolved_complaints():
    from complaints.models import Complaint
    threshold = datetime.datetime.now() - datetime.timedelta(days=7)
    resolved = Complaint.objects.filter(
        status='resolved',
        resolved_date__lt=threshold
    )
    count = resolved.update(status='closed')
    return f"Auto-closed {count} complaints"
