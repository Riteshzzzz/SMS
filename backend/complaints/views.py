from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Complaint, ComplaintStatusHistory
from .serializers import ComplaintSerializer
from users.permissions import IsAdmin, IsAdminOrResident


class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [IsAdminOrResident]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Complaint.objects.all()
        elif user.role == 'resident' and user.flat:
            return Complaint.objects.filter(flat=user.flat)
        return Complaint.objects.none()

    def perform_create(self, serializer):
        serializer.save(raised_by=self.request.user, flat=self.request.user.flat)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        complaint = self.get_object()
        new_status = request.data.get('status')
        notes = request.data.get('notes', '')
        complaint.status = new_status
        if new_status == 'resolved':
            complaint.resolved_date = timezone.now()
            complaint.resolved_by = request.user
        complaint.save()
        ComplaintStatusHistory.objects.create(
            complaint=complaint,
            status=new_status,
            updated_by=request.user,
            notes=notes
        )
        return Response(ComplaintSerializer(complaint).data)

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        complaint = self.get_object()
        assigned_to_id = request.data.get('assigned_to')
        complaint.assigned_to_id = assigned_to_id
        complaint.assigned_date = timezone.now()
        complaint.status = 'acknowledged'
        complaint.save()
        return Response(ComplaintSerializer(complaint).data)

    @action(detail=True, methods=['post'])
    def submit_feedback(self, request, pk=None):
        complaint = self.get_object()
        complaint.resident_feedback = request.data.get('feedback', '')
        complaint.rating = request.data.get('rating')
        complaint.save()
        return Response(ComplaintSerializer(complaint).data)

