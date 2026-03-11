from django.urls import path
from .views import FinancialSummaryView, VisitorAnalyticsView, ComplaintAnalyticsView

urlpatterns = [
    path('financial-summary/', FinancialSummaryView.as_view(), name='financial-summary'),
    path('visitor-analytics/', VisitorAnalyticsView.as_view(), name='visitor-analytics'),
    path('complaint-analytics/', ComplaintAnalyticsView.as_view(), name='complaint-analytics'),
]
