from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Visitor
from .serializers import VisitorSerializer
from users.permissions import IsSecurity, IsAdminOrResident


class VisitorViewSet(viewsets.ModelViewSet):
    queryset = Visitor.objects.all()
    serializer_class = VisitorSerializer

    def perform_create(self, serializer):
        serializer.save(
            checked_in_by=self.request.user,
            check_in_time=timezone.now(),
            status='checked_in'
        )

    @action(detail=True, methods=['post'])
    def checkout(self, request, pk=None):
        visitor = self.get_object()
        visitor.check_out_time = timezone.now()
        visitor.checked_out_by = request.user
        visitor.status = 'checked_out'
        if visitor.check_in_time:
            visitor.duration = int((visitor.check_out_time - visitor.check_in_time).total_seconds() / 60)
        visitor.save()
        return Response(VisitorSerializer(visitor).data)

    @action(detail=False, methods=['post'])
    def pre_approve(self, request):
        serializer = VisitorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(
            is_pre_approved=True,
            pre_approved_by=request.user,
            pre_approval_date=timezone.now(),
            status='expected'
        )
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def currently_inside(self, request):
        visitors = Visitor.objects.filter(status='checked_in')
        serializer = VisitorSerializer(visitors, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pre_approved(self, request):
        visitors = Visitor.objects.filter(is_pre_approved=True, status='expected')
        serializer = VisitorSerializer(visitors, many=True)
        return Response(serializer.data)

