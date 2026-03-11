from rest_framework import viewsets, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings
from .models import User
from .serializers import UserSerializer
from .permissions import IsAdmin
from django.utils import timezone

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

class DebugDBView(views.APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        return Response({
            'database': settings.DATABASES['default']['ENGINE'],
            'user_count': User.objects.count(),
            'usernames': list(User.objects.values_list('username', flat=True)),
            'now': timezone.now()
        })
