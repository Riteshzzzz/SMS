from rest_framework import viewsets
from .models import SecurityProfile, AttendanceRecord, IncidentReport
from .serializers import SecurityProfileSerializer, AttendanceRecordSerializer, IncidentReportSerializer
from users.permissions import IsAdmin


class SecurityProfileViewSet(viewsets.ModelViewSet):
    queryset = SecurityProfile.objects.all()
    serializer_class = SecurityProfileSerializer
    permission_classes = [IsAdmin]


class AttendanceRecordViewSet(viewsets.ModelViewSet):
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer


class IncidentReportViewSet(viewsets.ModelViewSet):
    queryset = IncidentReport.objects.all()
    serializer_class = IncidentReportSerializer

