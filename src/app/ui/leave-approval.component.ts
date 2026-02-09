import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../services/leave.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-leave-approval',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-black text-gray-900 tracking-tight">Team Requests</h2>
        <span class="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest rounded-full">
          {{ requests.length }} Pending
        </span>
      </div>

      @if (isLoading) {
        <div class="flex flex-col items-center justify-center py-20 text-gray-400">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
          <p class="text-sm font-bold uppercase tracking-widest">Loading Requests...</p>
        </div>
      } @else if (requests.length === 0) {
        <div class="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
          <div class="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span class="text-3xl">✅</span>
          </div>
          <h3 class="text-xl font-black text-gray-900 mb-2">All Caught Up!</h3>
          <p class="text-gray-500">There are no pending leave requests to review.</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 gap-4">
          @for (req of requests; track req.id) {
            <div class="group bg-white rounded-3xl p-6 border border-gray-100 transition-all hover:shadow-xl hover:scale-[1.01]">
              <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <!-- User Info -->
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
                    {{ req.full_name.charAt(0) }}
                  </div>
                  <div>
                    <h4 class="font-black text-gray-900 text-lg">{{ req.full_name }}</h4>
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">{{ req.department }} • {{ req.email }}</p>
                  </div>
                </div>

                <!-- Request Details -->
                <div class="flex-1 px-0 lg:px-6">
                  <div class="flex items-center gap-3 mb-2">
                    <span [class]="getLeaveTypeClass(req.request_type)" class="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                      {{ req.request_type }}
                    </span>
                    <span class="text-sm font-black text-gray-900">{{ req.days_requested }} Days</span>
                  </div>
                  <p class="text-sm text-gray-600 font-medium">
                    {{ formatDate(req.start_date) }} → {{ formatDate(req.end_date) }}
                  </p>
                  @if (req.reason) {
                    <p class="text-sm text-gray-400 mt-2 italic font-medium">"{{ req.reason }}"</p>
                  }
                </div>

                <!-- Actions -->
                <div class="flex flex-col gap-3 min-w-[240px]">
                  <input 
                    type="text" 
                    [(ngModel)]="req.tempComment"
                    placeholder="Add a comment..."
                    class="px-4 py-2 text-sm bg-gray-50 border border-transparent focus:border-indigo-500 rounded-xl outline-none transition-all"
                  >
                  <div class="flex gap-2">
                    <button 
                      (click)="updateStatus(req, 'Approved')"
                      class="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                      Approve
                    </button>
                    <button 
                      (click)="updateStatus(req, 'Rejected')"
                      class="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class LeaveApprovalComponent implements OnInit {
  requests: any[] = [];
  isLoading = false;

  constructor(private leaveService: LeaveService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.leaveService.getTeamLeaves().subscribe({
      next: (res) => {
        this.requests = res.map((r: any) => ({ ...r, tempComment: '' }));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load team requests');
      }
    });
  }

  updateStatus(request: any, status: string): void {
    this.leaveService.approveLeaveRequest(request.id, status, request.tempComment).subscribe({
      next: () => {
        this.toastService.success(`Request ${status.toLowerCase()}ed`);
        this.loadRequests();
      },
      error: (err) => {
        this.toastService.error(err.error?.error || `Failed to ${status.toLowerCase()} request`);
      }
    });
  }

  getLeaveTypeClass(type: string): string {
    const map: any = {
      'Vacation': 'bg-blue-100 text-blue-700',
      'Sick Leave': 'bg-rose-100 text-rose-700',
      'Personal Day': 'bg-amber-100 text-amber-700',
      'Remote Work': 'bg-purple-100 text-purple-700'
    };
    return map[type] || 'bg-gray-100 text-gray-700';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
