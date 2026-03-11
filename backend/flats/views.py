from rest_framework import viewsets
from .models import Flat
from .serializers import FlatSerializer
from users.permissions import IsAdmin

class FlatViewSet(viewsets.ModelViewSet):
    queryset = Flat.objects.all()
    serializer_class = FlatSerializer
    permission_classes = [IsAdmin]
