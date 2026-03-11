from celery import shared_task
import datetime


@shared_task
def generate_monthly_bills():
    from flats.models import Flat
    from maintenance.models import Maintenance
    today = datetime.date.today()
    month_str = today.strftime('%B %Y')
    for flat in Flat.objects.filter(is_active=True):
        Maintenance.objects.get_or_create(
            flat=flat,
            month=month_str,
            year=today.year,
            billing_period=today.replace(day=1),
            defaults={
                'base_maintenance': 3000,
                'total_amount': 3000,
                'due_date': today.replace(day=15),
                'status': 'unpaid',
                'balance_amount': 3000,
            }
        )
    return f"Bills generated for {month_str}"


@shared_task
def send_payment_reminders(reminder_type='first_reminder'):
    from maintenance.models import Maintenance
    unpaid_bills = Maintenance.objects.filter(status__in=['unpaid', 'overdue'])
    count = 0
    for bill in unpaid_bills:
        # In production, send actual email/SMS here
        count += 1
    return f"Sent {count} {reminder_type} reminders"


@shared_task
def add_penalty_to_overdue_bills():
    from maintenance.models import Maintenance
    import datetime
    overdue = Maintenance.objects.filter(status='unpaid', due_date__lt=datetime.date.today())
    count = 0
    for bill in overdue:
        if bill.penalty == 0:
            bill.penalty = float(bill.total_amount) * 0.02  # 2% penalty
            bill.total_amount = float(bill.total_amount) + float(bill.penalty)
            bill.balance_amount = float(bill.total_amount) - float(bill.paid_amount)
            bill.status = 'overdue'
            bill.save()
            count += 1
    return f"Applied penalties to {count} bills"
