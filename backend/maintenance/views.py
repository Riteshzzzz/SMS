from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Maintenance
from .serializers import MaintenanceSerializer
from users.permissions import IsAdmin, IsAdminOrResident


class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer
    permission_classes = [IsAdminOrResident]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Maintenance.objects.all()
        elif user.role == 'resident' and user.flat:
            return Maintenance.objects.filter(flat=user.flat)
        return Maintenance.objects.none()

    @action(detail=True, methods=['post'])
    def record_payment(self, request, pk=None):
        bill = self.get_object()
        amount = request.data.get('amount', 0)
        method = request.data.get('payment_method', '')
        transaction_id = request.data.get('transaction_id', '')

        bill.paid_amount += float(amount)
        bill.balance_amount = float(bill.total_amount) - bill.paid_amount
        bill.payment_method = method
        bill.transaction_id = transaction_id
        bill.payment_date = timezone.now().date()

        if bill.paid_amount >= float(bill.total_amount):
            bill.status = 'paid'
        elif bill.paid_amount > 0:
            bill.status = 'partially_paid'
        bill.save()
        return Response(MaintenanceSerializer(bill).data)

    @action(detail=False, methods=['get'])
    def outstanding_dues(self, request):
        dues = Maintenance.objects.filter(status__in=['unpaid', 'overdue', 'partially_paid'])
        serializer = MaintenanceSerializer(dues, many=True)
        return Response(serializer.data)

