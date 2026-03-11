from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count
from maintenance.models import Maintenance
from visitors.models import Visitor
from complaints.models import Complaint
from users.permissions import IsAdmin


class FinancialSummaryView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        month = request.query_params.get('month')
        year = request.query_params.get('year')
        qs = Maintenance.objects.all()
        if month:
            qs = qs.filter(month__icontains=month)
        if year:
            qs = qs.filter(year=year)
        summary = qs.aggregate(
            total_billed=Sum('total_amount'),
            total_collected=Sum('paid_amount'),
            total_outstanding=Sum('balance_amount'),
        )
        summary['bill_count'] = qs.count()
        return Response(summary)


class VisitorAnalyticsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        total = Visitor.objects.count()
        currently_inside = Visitor.objects.filter(status='checked_in').count()
        by_type = Visitor.objects.values('visitor_type').annotate(count=Count('id'))
        return Response({
            'total_visitors': total,
            'currently_inside': currently_inside,
            'by_type': list(by_type),
        })


class ComplaintAnalyticsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        total = Complaint.objects.count()
        by_status = Complaint.objects.values('status').annotate(count=Count('id'))
        by_category = Complaint.objects.values('category').annotate(count=Count('id'))
        return Response({
            'total_complaints': total,
            'by_status': list(by_status),
            'by_category': list(by_category),
        })

