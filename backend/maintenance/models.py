from django.db import models

class Maintenance(models.Model):
    STATUS_CHOICES = [
        ('unpaid','Unpaid'),('paid','Paid'),
        ('partially_paid','Partially Paid'),('overdue','Overdue'),
    ]
    PAYMENT_METHOD_CHOICES = [
        ('cash','Cash'),('upi','UPI'),('card','Card'),('net_banking','Net Banking'),
    ]

    flat = models.ForeignKey('flats.Flat', on_delete=models.CASCADE, related_name='maintenance_bills')
    month = models.CharField(max_length=20)  # "March 2026"
    year = models.IntegerField()
    billing_period = models.DateField()
    base_maintenance = models.DecimalField(max_digits=10, decimal_places=2)
    water_charges = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    electricity_common_area = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    sinking_fund = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    repair_fund = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    parking_charges = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    amenity_charges = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    penalty = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    previous_due = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unpaid')
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    balance_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_date = models.DateField(null=True, blank=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, blank=True)
    transaction_id = models.CharField(max_length=100, blank=True)
    receipt_number = models.CharField(max_length=50, blank=True)
    due_date = models.DateField()
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['flat', 'billing_period']),
            models.Index(fields=['status', 'due_date']),
            models.Index(fields=['month', 'year']),
        ]
