from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Expense
from .serializers import ExpenseSerializer
from users.permissions import IsAdmin


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAdmin]

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        expense = self.get_object()
        expense.approval_status = 'approved'
        expense.approved_by = request.user
        expense.approval_date = timezone.now()
        expense.save()
        return Response(ExpenseSerializer(expense).data)

