import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../services/leave.service';

@Component({
  selector: 'app-leave-balance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      @for (item of balanceConfigs; track item.type) {
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div class="flex items-center justify-between mb-4">
            <div [class]="item.iconBg" class="p-3 rounded-xl">
              <span class="text-xl">{{ item.icon }}</span>
            </div>
            <span class="text-xs font-black uppercase tracking-widest text-gray-400">{{ item.type }}</span>
          </div>
          
          <div class="space-y-4">
            <div class="flex justify-between items-end">
              <div>
                <p class="text-3xl font-black text-gray-900">{{ getAvailable(item.key) }}</p>
                <p class="text-xs text-gray-500 font-medium">Days Available</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-gray-700">{{ balance[item.key] }}</p>
                <p class="text-[10px] text-gray-400 uppercase font-bold">Total</p>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                [class]="item.barColor"
                class="h-full transition-all duration-1000 ease-out rounded-full"
                [style.width.%]="getUsedPercentage(item.key)"
              ></div>
            </div>

            <div class="flex justify-between text-[10px] font-bold uppercase tracking-tight">
              <span class="text-emerald-500">{{ balance[item.key + '_used'] || 0 }} Used</span>
              <span class="text-amber-500">{{ balance[item.key + '_pending'] || 0 }} Pending</span>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class LeaveBalanceComponent implements OnInit {
  balance: any = {};
  balanceConfigs = [
    { type: 'Vacation', key: 'vacation', icon: '🏖️', iconBg: 'bg-blue-50', barColor: 'bg-blue-500' },
    { type: 'Sick Leave', key: 'sick', icon: '🤒', iconBg: 'bg-rose-50', barColor: 'bg-rose-500' },
    { type: 'Personal Day', key: 'personal', icon: '☕', iconBg: 'bg-amber-50', barColor: 'bg-amber-500' }
  ];

  constructor(private leaveService: LeaveService) { }

  ngOnInit(): void {
    this.leaveService.getLeaveBalance().subscribe(res => {
      // Maps backend keys (vacation_days) to our simplified keys
      this.balance = {
        vacation: res.vacation_days,
        vacation_used: res.vacation_used,
        vacation_pending: res.vacation_pending,
        sick: res.sick_days,
        sick_used: res.sick_used,
        sick_pending: res.sick_pending,
        personal: res.personal_days,
        personal_used: res.personal_used,
        personal_pending: res.personal_pending
      };
    });
  }

  getAvailable(key: string): number {
    return this.balance[key] - (this.balance[key + '_used'] || 0) - (this.balance[key + '_pending'] || 0);
  }

  getUsedPercentage(key: string): number {
    const total = this.balance[key] || 1;
    const used = (this.balance[key + '_used'] || 0) + (this.balance[key + '_pending'] || 0);
    return Math.min((used / total) * 100, 100);
  }
}
