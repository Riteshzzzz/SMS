from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notice, NoticeAcknowledgment
from .serializers import NoticeSerializer
from users.permissions import IsAdmin


class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.filter(is_active=True).order_by('-is_pinned', '-published_date')
    serializer_class = NoticeSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(published_by=self.request.user)

    @action(detail=True, methods=['post'])
    def acknowledge(self, request, pk=None):
        notice = self.get_object()
        NoticeAcknowledgment.objects.get_or_create(
            notice=notice,
            user=request.user
        )
        return Response({'status': 'acknowledged'})

