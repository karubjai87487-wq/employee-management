import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LeaveService } from '../services/leave.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">My Leave Requests</h1>
          <p class="text-gray-600">View and manage all your leave requests</p>
        </div>
      </div>

      @if (isLoading) {
        <div class="text-center py-12 text-gray-500">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          Loading requests...
        </div>
      } @else if (requests.length === 0) {
        <div class="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <p class="text-gray-600 text-lg">No leave requests yet</p>
          <p class="text-gray-500 mt-2">Start by going to Dashboard and submitting a request</p>
        </div>
      } @else {
        <div class="space-y-4">
          @for (req of requests; track req.id) {
            <div class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition shadow-sm">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-lg font-semibold text-gray-900">{{ req.request_type }}</h3>
                    <span [ngClass]="getStatusClass(req.status)" class="text-xs font-bold px-3 py-1 rounded-full">
                      {{ req.status }}
                    </span>
                  </div>
                  <p class="text-gray-600 text-sm mb-3">
                    {{ formatDate(req.start_date) }} to {{ formatDate(req.end_date) }}
                    <span class="text-gray-500 ml-2">({{ req.days_requested }} days)</span>
                  </p>
                  @if (req.reason) {
                    <p class="text-gray-700 text-sm italic">{{ req.reason }}</p>
                  }
                  @if (req.approval_comment) {
                    <p class="text-gray-600 text-sm mt-2">
                      <strong>Comment:</strong> {{ req.approval_comment }}
                    </p>
                  }
                  @if (req.approved_by_name) {
                    <p class="text-gray-500 text-sm mt-2">
                      Approved by: {{ req.approved_by_name }}
                    </p>
                  }
                </div>
                @if (req.status === 'Pending') {
                  <button
                    (click)="cancelRequest(req.id)"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                  >
                    Cancel
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class MyRequestsComponent implements OnInit {
  requests: any[] = [];
  isLoading = false;

  constructor(private leaveService: LeaveService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.leaveService.getUserLeaves().subscribe({
      next: (res) => {
        this.requests = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error('Failed to load requests');
      }
    });
  }

  cancelRequest(id: number): void {
    if (confirm('Are you sure you want to cancel this request?')) {
      this.leaveService.cancelLeaveRequest(id).subscribe({
        next: () => {
          this.toastService.success('Request cancelled');
          this.loadRequests();
        },
        error: (err) => {
          this.toastService.error('Failed to cancel request');
        }
      });
    }
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Cancelled': 'bg-gray-100 text-gray-800'
    };
    return classes[status] || classes['Pending'];
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
