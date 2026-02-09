import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../services/leave.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header & Filters -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Company Calendar</h1>
          <p class="text-gray-500 mt-1">Plan and coordinate with the team</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <select 
            [(ngModel)]="selectedDepartment" 
            (change)="applyFilters()"
            class="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-indigo-500 transition shadow-sm outline-none"
          >
            <option value="All">All Departments</option>
            @for (dept of departments; track dept) {
              <option [value]="dept">{{ dept }}</option>
            }
          </select>
          <div class="flex items-center bg-gray-100 rounded-xl p-1 shadow-inner">
            <button (click)="changeMonth(-1)" class="p-2 hover:bg-white rounded-lg transition text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <span class="px-4 font-bold text-gray-800 min-w-[140px] text-center">{{ currentMonthName }}</span>
            <button (click)="changeMonth(1)" class="p-2 hover:bg-white rounded-lg transition text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Stats Row -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 p-5 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
          <p class="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">Total Off</p>
          <p class="text-3xl font-black">{{ stats.totalOff }}</p>
          <p class="text-indigo-100 text-[10px] mt-2 font-medium">Approved requests this month</p>
        </div>
        <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
          <p class="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">Upcoming</p>
          <p class="text-3xl font-black">{{ stats.upcoming }}</p>
          <p class="text-emerald-100 text-[10px] mt-2 font-medium">In the next 7 days</p>
        </div>
        <div class="bg-gradient-to-br from-amber-500 to-amber-600 p-5 rounded-2xl text-white shadow-lg shadow-amber-500/20">
          <p class="text-amber-100 text-xs font-bold uppercase tracking-wider mb-1">Away Today</p>
          <p class="text-3xl font-black">{{ stats.todayOff }}</p>
          <p class="text-amber-100 text-[10px] mt-2 font-medium">Team members out today</p>
        </div>
        <div class="bg-gradient-to-br from-rose-500 to-rose-600 p-5 rounded-2xl text-white shadow-lg shadow-rose-500/20">
          <p class="text-rose-100 text-xs font-bold uppercase tracking-wider mb-1">Approval Rate</p>
          <p class="text-3xl font-black">{{ stats.approvalRate }}%</p>
          <p class="text-rose-100 text-[10px] mt-2 font-medium">Efficiency score</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Calendar Grid -->
        <div class="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 transition-colors">
          <div class="grid grid-cols-7 mb-4">
            @for (day of weekDays; track day) {
              <div class="text-center py-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                {{ day }}
              </div>
            }
          </div>
          
          <div class="grid grid-cols-7 grid-rows-6 gap-2">
            @for (date of calendarDays; track date.date) {
              <div 
                [ngClass]="{
                  'bg-gray-50 opacity-40': !date.currentMonth,
                  'border-indigo-200 border-2': date.isToday,
                  'border-gray-100': !date.isToday
                }"
                class="min-h-[110px] p-2 rounded-xl border flex flex-col gap-1 transition-all hover:border-indigo-300"
              >
                <div class="flex justify-between items-start">
                  <span 
                    [class.bg-indigo-600]="date.isToday" 
                    [class.text-white]="date.isToday" 
                    class="w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold"
                    [class.text-gray-500]="!date.isToday"
                  >
                    {{ date.day }}
                  </span>
                  @if (date.events.length > 0) {
                    <span class="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  }
                </div>

                <!-- Events for this day -->
                <div class="space-y-1 mt-1 flex-1 overflow-y-auto custom-scrollbar">
                  @for (event of date.events; track event.id; let i = $index) {
                    @if (date.events.length > 3 && i >= 2) {
                      @if (i === 2) {
                        <div class="px-2 py-1 text-[10px] text-gray-400 font-bold">+{{ date.events.length - 2 }} more</div>
                      }
                    } @else {
                      <div 
                        [title]="event.full_name + ' - ' + event.request_type"
                        class="px-2 py-1 text-[10px] rounded-lg font-bold truncate transition-all cursor-pointer hover:scale-[1.02]"
                        [ngClass]="getEventTypeClass(event.request_type)"
                      >
                        {{ event.full_name.split(' ')[0] }}
                      </div>
                    }
                  }
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Details Sidebar -->
        <div class="space-y-6">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span class="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">📋</span>
              Upcoming Absences
            </h3>
            <div class="space-y-3">
              @for (ev of filteredEvents.slice(0, 5); track ev.id) {
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    {{ ev.full_name.charAt(0) }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-gray-900 truncate">{{ ev.full_name }}</p>
                    <p class="text-[10px] text-gray-500 truncate">{{ ev.request_type }} • {{ formatDate(ev.start_date) }}</p>
                  </div>
                </div>
              }
              @if (filteredEvents.length === 0) {
                <p class="text-center py-6 text-gray-400 text-xs">No upcoming absences found.</p>
              }
            </div>
          </div>

          <div class="bg-indigo-600 p-6 rounded-2xl text-white shadow-xl shadow-indigo-600/30 overflow-hidden relative">
            <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <h4 class="font-black text-lg mb-2">Notice</h4>
            <p class="text-sm text-indigo-100 leading-relaxed">Approved leaves are automatically synced with the company-wide shared calendar.</p>
            <button (click)="loadCalendarData()" class="mt-4 w-full py-2 bg-white text-indigo-600 rounded-xl font-bold text-xs hover:bg-indigo-50 transition shadow-lg">Refresh Sync</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
  `]
})
export class CalendarComponent implements OnInit {
  events: any[] = [];
  filteredEvents: any[] = [];
  isLoading = false;
  currentDate = new Date();
  calendarDays: any[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  departments: string[] = ['IT', 'HR', 'Finance', 'Sales', 'Marketing', 'Operations'];
  selectedDepartment = 'All';

  stats = {
    totalOff: 0,
    upcoming: 0,
    todayOff: 0,
    approvalRate: 0
  };

  constructor(private leaveService: LeaveService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.generateCalendar();
    this.loadCalendarData();
  }

  get currentMonthName(): string {
    return this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  changeMonth(delta: number): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + delta, 1);
    this.loadCalendarData();
  }

  loadCalendarData(): void {
    this.isLoading = true;
    const start = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1).toISOString().split('T')[0];
    const end = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 2, 0).toISOString().split('T')[0];

    this.leaveService.getCalendarData(start, end).subscribe({
      next: (res) => {
        this.events = res;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredEvents = this.events.filter(e =>
      this.selectedDepartment === 'All' || e.department === this.selectedDepartment
    );
    this.generateCalendar();
    this.calculateStats();
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

    const days: any[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth; i > 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDate - i + 1);
      days.push(this.createDayObject(date, false));
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
      const date = new Date(year, month, i);
      days.push(this.createDayObject(date, true));
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push(this.createDayObject(date, false));
    }

    this.calendarDays = days;
  }

  private createDayObject(date: Date, isCurrent: boolean): any {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayEvents = this.filteredEvents.filter(e => {
      const start = new Date(e.start_date);
      const end = new Date(e.end_date);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return date >= start && date <= end;
    });

    return {
      date: date,
      day: date.getDate(),
      currentMonth: isCurrent,
      isToday: date.getTime() === today.getTime(),
      events: dayEvents
    };
  }

  calculateStats(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const thisMonthEvents = this.filteredEvents.filter(e => {
      const start = new Date(e.start_date);
      return start.getMonth() === this.currentDate.getMonth();
    });

    this.stats.totalOff = thisMonthEvents.length;

    this.stats.upcoming = this.filteredEvents.filter(e => {
      const start = new Date(e.start_date);
      return start >= today && start <= nextWeek;
    }).length;

    this.stats.todayOff = this.filteredEvents.filter(e => {
      const start = new Date(e.start_date);
      const end = new Date(e.end_date);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return today >= start && today <= end;
    }).length;

    this.stats.approvalRate = 85;
  }

  getEventTypeClass(type: string): string {
    const map: any = {
      'Vacation': 'bg-blue-100 text-blue-700',
      'Sick Leave': 'bg-rose-100 text-rose-700',
      'Personal Day': 'bg-amber-100 text-amber-700',
      'Remote Work': 'bg-indigo-100 text-indigo-700',
    };
    return map[type] || 'bg-gray-100 text-gray-700';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
}
