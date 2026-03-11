from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature',
                            'status', 'receipt_number', 'created_at', 'updated_at']


class CreateOrderSerializer(serializers.Serializer):
    maintenance_bill_id = serializers.IntegerField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)


class VerifyPaymentSerializer(serializers.Serializer):
    razorpay_order_id = serializers.CharField()
    razorpay_payment_id = serializers.CharField()
    razorpay_signature = serializers.CharField()
