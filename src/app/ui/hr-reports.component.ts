import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../services/leave.service';

@Component({
    selector: 'app-hr-reports',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-10">
      <div>
        <h3 class="text-2xl font-black text-gray-900 tracking-tight">Organization Insights</h3>
        <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Leave utilization and trends</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Summary Cards -->
        <div class="bg-gray-50 rounded-[30px] p-8 border border-gray-100">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Requests</p>
          <h4 class="text-4xl font-black text-gray-900">{{ reportData?.totalRequests || 0 }}</h4>
        </div>
        <div class="bg-indigo-50 rounded-[30px] p-8 border border-indigo-100/50">
          <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Approved</p>
          <h4 class="text-4xl font-black text-indigo-600">{{ getStatusCount('Approved') }}</h4>
        </div>
        <div class="bg-rose-50 rounded-[30px] p-8 border border-rose-100/50">
          <p class="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Rejected</p>
          <h4 class="text-4xl font-black text-rose-600">{{ getStatusCount('Rejected') }}</h4>
        </div>
        <div class="bg-amber-50 rounded-[30px] p-8 border border-amber-100/50">
          <p class="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">Pending</p>
          <h4 class="text-4xl font-black text-amber-600">{{ getStatusCount('Pending') }}</h4>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Request Types Distribution -->
        <div class="bg-white rounded-[40px] p-8 border border-gray-100 space-y-6">
          <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest">Request Types Distribution</h5>
          <div class="space-y-4">
            @for (item of reportData?.typeBreakdown; track item.request_type) {
              <div class="space-y-1">
                <div class="flex justify-between text-[10px] font-black text-gray-500 uppercase">
                  <span>{{ item.request_type }}</span>
                  <span>{{ item.count }}</span>
                </div>
                <div class="h-2 bg-gray-50 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                    [style.width.%]="(item.count / reportData.totalRequests) * 100">
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Recent Approvals (Upcoming) -->
        <div class="bg-white rounded-[40px] p-8 border border-gray-100 space-y-6">
          <h5 class="text-sm font-black text-gray-900 uppercase tracking-widest">Upcoming Approved Absences</h5>
          <div class="space-y-4">
            @for (leave of reportData?.upcomingLeaves; track leave.id) {
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-xs font-black text-gray-400">
                    {{ leave.full_name.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-[11px] font-black text-gray-900">{{ leave.full_name }}</p>
                    <p class="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{{ leave.request_type }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-[10px] font-black text-indigo-500">{{ leave.start_date | date:'MMM d' }}</p>
                  <p class="text-[8px] text-gray-400 font-bold uppercase">Starts</p>
                </div>
              </div>
            }
            @if (reportData?.upcomingLeaves?.length === 0) {
              <div class="py-10 text-center text-gray-400 text-xs font-bold uppercase">No upcoming absences</div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class HrReportsComponent implements OnInit {
    reportData: any = null;

    constructor(private leaveService: LeaveService) { }

    ngOnInit(): void {
        this.loadReport();
    }

    loadReport(): void {
        this.leaveService.getCompanyReport().subscribe({
            next: (data) => this.reportData = data,
            error: (err) => console.error('Failed to load HR reports', err)
        });
    }

    getStatusCount(status: string): number {
        if (!this.reportData || !this.reportData.statusBreakdown) return 0;
        const found = this.reportData.statusBreakdown.find((s: any) => s.status === status);
        return found ? found.count : 0;
    }
}
