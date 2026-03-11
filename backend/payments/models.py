from django.db import models


class Payment(models.Model):
    STATUS_CHOICES = [
        ('created', 'Created'),
        ('authorized', 'Authorized'),
        ('captured', 'Captured'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    flat = models.ForeignKey('flats.Flat', on_delete=models.CASCADE, related_name='payments')
    maintenance_bill = models.ForeignKey('maintenance.Maintenance', on_delete=models.CASCADE, related_name='payments', null=True, blank=True)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='payments')

    # Razorpay fields
    razorpay_order_id = models.CharField(max_length=100, unique=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True)
    razorpay_signature = models.CharField(max_length=255, blank=True)

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='INR')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='created')
    payment_method = models.CharField(max_length=50, blank=True)  # upi, card, netbanking, wallet

    description = models.CharField(max_length=255, default='Maintenance Payment')
    receipt_number = models.CharField(max_length=50, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['razorpay_order_id']),
            models.Index(fields=['razorpay_payment_id']),
            models.Index(fields=['status']),
            models.Index(fields=['user', 'status']),
        ]

    def __str__(self):
        return f"Payment {self.razorpay_order_id} - ₹{self.amount} ({self.status})"
