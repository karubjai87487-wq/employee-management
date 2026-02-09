import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../services/leave.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-leave-requests-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold text-gray-900">My Leave Requests</h3>
        <button
          (click)="refresh()"
          class="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Refresh
        </button>
      </div>

      @if (isLoading) {
        <div class="text-center py-8 text-gray-500">Loading requests...</div>
      } @else if (requests.length === 0) {
        <div class="p-4 bg-gray-50 rounded-lg text-center text-gray-600">
          No leave requests yet
        </div>
      } @else {
        <div class="space-y-2">
          @for (req of requests; track req.id) {
            <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
              <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                    {{ req.request_type.charAt(0) }}
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900">{{ req.request_type }}</h4>
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {{ formatDate(req.start_date) }} — {{ formatDate(req.end_date) }}
                    </p>
                  </div>
                </div>
                <span
                  class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter"
                  [ngClass]="{
                    'bg-amber-100 text-amber-700 border border-amber-200': req.status === 'Pending',
                    'bg-emerald-100 text-emerald-700 border border-emerald-200': req.status === 'Approved',
                    'bg-rose-100 text-rose-700 border border-rose-200': req.status === 'Rejected',
                    'bg-gray-100 text-gray-600 border border-gray-200': req.status === 'Cancelled'
                  }"
                >
                  {{ req.status }}
                </span>
              </div>
              
              <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-1 bg-gray-100 rounded-md text-[10px] font-bold text-gray-600">{{ req.days_requested }} Days</span>
                  <span class="text-xs text-gray-500 italic truncate max-w-[150px]">{{ req.reason || 'No reason provided' }}</span>
                </div>
                
                @if (req.status === 'Pending') {
                  <button
                    (click)="cancelRequest(req.id)"
                    class="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    Cancel
                  </button>
                }
              </div>

              @if (req.status === 'Approved' && req.approved_by_name) {
                <div class="mt-3 flex items-center gap-1.5 opacity-60">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <p class="text-[10px] font-bold text-gray-500">Approved by {{ req.approved_by_name }}</p>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `
})
export class LeaveRequestsListComponent implements OnInit {
  requests: any[] = [];
  isLoading = false;

  constructor(
    private leaveService: LeaveService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
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
          this.refresh();
        },
        error: (err) => {
          this.toastService.error('Failed to cancel request');
        }
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
}
