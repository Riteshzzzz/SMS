from rest_framework import serializers
from .models import Poll, PollOption


class PollOptionSerializer(serializers.ModelSerializer):
    vote_count = serializers.SerializerMethodField()

    class Meta:
        model = PollOption
        fields = ['id', 'poll', 'option_text', 'vote_count']

    def get_vote_count(self, obj):
        return obj.voted_by.count()


class PollSerializer(serializers.ModelSerializer):
    options = PollOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Poll
        fields = '__all__'
        read_only_fields = ['created_at']
