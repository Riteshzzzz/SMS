import uuid
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.conf import settings

from .models import Payment
from .serializers import PaymentSerializer, CreateOrderSerializer, VerifyPaymentSerializer
from .razorpay_service import create_razorpay_order, verify_payment_signature
from maintenance.models import Maintenance


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    """Payment ViewSet — list and retrieve payments, plus create orders and verify."""
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Payment.objects.all()
        return Payment.objects.filter(user=user)

    @action(detail=False, methods=['post'], url_path='create-order')
    def create_order(self, request):
        """Create a Razorpay order for a maintenance bill payment."""
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        bill_id = serializer.validated_data['maintenance_bill_id']
        amount = serializer.validated_data['amount']

        try:
            bill = Maintenance.objects.get(id=bill_id)
        except Maintenance.DoesNotExist:
            return Response({'error': 'Bill not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check bill isn't already fully paid
        if bill.status == 'paid':
            return Response({'error': 'Bill is already paid'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate receipt number
        receipt = f"RCP-{uuid.uuid4().hex[:8].upper()}"

        # Create Razorpay order
        order_data = create_razorpay_order(
            amount_inr=amount,
            receipt=receipt,
            notes={
                'bill_id': str(bill_id),
                'flat': str(bill.flat_id),
                'month': bill.month,
            }
        )

        # Save payment record
        payment = Payment.objects.create(
            flat=bill.flat,
            maintenance_bill=bill,
            user=request.user,
            razorpay_order_id=order_data['id'],
            amount=amount,
            description=f"Maintenance - {bill.month}",
            receipt_number=receipt,
            status='created',
        )

        return Response({
            'order_id': order_data['id'],
            'amount': int(float(amount) * 100),  # paise for frontend
            'currency': 'INR',
            'key': getattr(settings, 'RAZORPAY_KEY_ID', 'rzp_test_your_key_id'),
            'payment_id': payment.id,
            'receipt': receipt,
            'description': payment.description,
            'prefill': {
                'name': request.user.get_full_name() or request.user.username,
                'email': request.user.email,
                'contact': getattr(request.user, 'phone_number', ''),
            }
        })

    @action(detail=False, methods=['post'], url_path='verify')
    def verify_payment(self, request):
        """Verify Razorpay payment signature and update bill status."""
        serializer = VerifyPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        order_id = serializer.validated_data['razorpay_order_id']
        payment_id = serializer.validated_data['razorpay_payment_id']
        signature = serializer.validated_data['razorpay_signature']

        # Verify signature
        is_valid = verify_payment_signature(order_id, payment_id, signature)

        try:
            payment = Payment.objects.get(razorpay_order_id=order_id)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)

        if is_valid:
            payment.razorpay_payment_id = payment_id
            payment.razorpay_signature = signature
            payment.status = 'captured'
            payment.payment_method = request.data.get('method', 'online')
            payment.save()

            # Update the maintenance bill
            bill = payment.maintenance_bill
            if bill:
                bill.paid_amount = float(bill.paid_amount) + float(payment.amount)
                bill.balance_amount = float(bill.total_amount) - float(bill.paid_amount)
                bill.payment_date = timezone.now().date()
                bill.payment_method = 'online'
                bill.transaction_id = payment_id
                bill.receipt_number = payment.receipt_number

                if bill.paid_amount >= float(bill.total_amount):
                    bill.status = 'paid'
                else:
                    bill.status = 'partially_paid'
                bill.save()

            return Response({
                'status': 'success',
                'message': 'Payment verified and recorded successfully',
                'payment': PaymentSerializer(payment).data,
            })
        else:
            payment.status = 'failed'
            payment.save()
            return Response({
                'status': 'failed',
                'message': 'Payment verification failed',
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='history')
    def payment_history(self, request):
        """Get payment history for the current user."""
        payments = self.get_queryset().filter(status='captured')
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='summary')
    def payment_summary(self, request):
        """Get payment summary stats."""
        from django.db.models import Sum, Count
        qs = self.get_queryset()
        captured = qs.filter(status='captured')
        return Response({
            'total_paid': captured.aggregate(total=Sum('amount'))['total'] or 0,
            'total_transactions': captured.count(),
            'pending_orders': qs.filter(status='created').count(),
            'failed_payments': qs.filter(status='failed').count(),
        })
