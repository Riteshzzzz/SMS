from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Poll, PollOption
from .serializers import PollSerializer
from users.permissions import IsAdmin


class PollViewSet(viewsets.ModelViewSet):
    queryset = Poll.objects.all()
    serializer_class = PollSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return super().get_permissions()

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        option_id = request.data.get('option_id')
        option = PollOption.objects.get(id=option_id, poll_id=pk)
        option.voted_by.add(request.user)
        return Response({'status': 'voted'})

