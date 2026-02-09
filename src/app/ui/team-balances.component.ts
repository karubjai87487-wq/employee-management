import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../services/leave.service';

@Component({
  selector: 'app-team-balances',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-black text-gray-900 tracking-tight">Team Balances</h2>
        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Available days per member</p>
      </div>

      <div class="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-100">
                <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Team Member</th>
                <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Vacation</th>
                <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Sick</th>
                <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Personal</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              @for (member of balances; track member.id) {
                <tr class="hover:bg-gray-50/50 transition-colors">
                  <td class="px-6 py-5">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm text-center">
                        <span class="w-full">{{ member.full_name.charAt(0) }}</span>
                      </div>
                      <div>
                        <p class="text-sm font-black text-gray-900">{{ member.full_name }}</p>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{{ member.department }}</p>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Vacation -->
                  <td class="px-6 py-5">
                    <div class="flex flex-col items-center gap-2 min-w-[100px]">
                      <div class="flex justify-between w-full text-[10px] font-black px-1">
                        <span class="text-gray-900">{{ member.vacation_days - member.vacation_used - member.vacation_pending }}</span>
                        <span class="text-gray-400">/ {{ member.vacation_days }}</span>
                      </div>
                      <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="bg-blue-500 h-full rounded-full transition-all duration-700"
                             [style.width.%]="((member.vacation_used + member.vacation_pending) / member.vacation_days) * 100"></div>
                      </div>
                      <div class="flex gap-2 text-[8px] font-black uppercase tracking-tighter">
                        <span class="text-emerald-500">{{ member.vacation_used }} Used</span>
                        <span class="text-amber-500">{{ member.vacation_pending }} Pend</span>
                      </div>
                    </div>
                  </td>

                  <!-- Sick -->
                  <td class="px-6 py-5">
                    <div class="flex flex-col items-center gap-2 min-w-[100px]">
                      <div class="flex justify-between w-full text-[10px] font-black px-1">
                        <span class="text-gray-900">{{ member.sick_days - member.sick_used - member.sick_pending }}</span>
                        <span class="text-gray-400">/ {{ member.sick_days }}</span>
                      </div>
                      <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="bg-rose-500 h-full rounded-full transition-all duration-700"
                             [style.width.%]="((member.sick_used + member.sick_pending) / member.sick_days) * 100"></div>
                      </div>
                      <div class="flex gap-2 text-[8px] font-black uppercase tracking-tighter">
                        <span class="text-emerald-500">{{ member.sick_used }} Used</span>
                        <span class="text-amber-500">{{ member.sick_pending }} Pend</span>
                      </div>
                    </div>
                  </td>

                  <!-- Personal -->
                  <td class="px-6 py-5">
                    <div class="flex flex-col items-center gap-2 min-w-[100px]">
                      <div class="flex justify-between w-full text-[10px] font-black px-1">
                        <span class="text-gray-900">{{ member.personal_days - member.personal_used - member.personal_pending }}</span>
                        <span class="text-gray-400">/ {{ member.personal_days }}</span>
                      </div>
                      <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="bg-amber-500 h-full rounded-full transition-all duration-700"
                             [style.width.%]="((member.personal_used + member.personal_pending) / member.personal_days) * 100"></div>
                      </div>
                      <div class="flex gap-2 text-[8px] font-black uppercase tracking-tighter">
                        <span class="text-emerald-500">{{ member.personal_used }} Used</span>
                        <span class="text-amber-500">{{ member.personal_pending }} Pend</span>
                      </div>
                    </div>
                  </td>
                </tr>
              }
              @if (balances.length === 0 && !isLoading) {
                <tr>
                  <td colspan="4" class="px-6 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">No team members found</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Template helper effectively but for balance display -->
    <ng-template #balanceCell let-total="total" let-used="used" let-pending="pending" let-color="color">
      <div class="flex flex-col items-center gap-2 min-w-[100px]">
        <div class="flex justify-between w-full text-[10px] font-black px-1">
          <span class="text-gray-900">{{ total - used - pending }}</span>
          <span class="text-gray-400">/ {{ total }}</span>
        </div>
        <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            [class]="color"
            class="h-full rounded-full transition-all duration-700"
            [style.width.%]="((used + pending) / total) * 100"
          ></div>
        </div>
        <div class="flex gap-2 text-[8px] font-black uppercase tracking-tighter">
          <span class="text-emerald-500">{{ used }} Used</span>
          <span class="text-amber-500">{{ pending }} Pend</span>
        </div>
      </div>
    </ng-template>
  `
})
export class TeamBalancesComponent implements OnInit {
  balances: any[] = [];
  isLoading = false;

  constructor(private leaveService: LeaveService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.leaveService.getTeamBalances().subscribe({
      next: (res) => {
        this.balances = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  // Purely UI descriptive - using separate function or signal could be better but this is fine for static display
  renderBalanceCell(total: any, used: any, pending: any, color: string) {
    // This is just a conceptual placeholder if I wanted to return HTML, 
    // but in Angular I'm using the template logic above.
    return '';
  }
}
