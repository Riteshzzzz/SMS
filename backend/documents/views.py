from rest_framework import viewsets
from .models import Document
from .serializers import DocumentSerializer
from users.permissions import IsAdmin


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.filter(is_archived=False)
    serializer_class = DocumentSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

