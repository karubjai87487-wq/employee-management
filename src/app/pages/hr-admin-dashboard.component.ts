import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LeaveService } from '../services/leave.service';
import { UserManagementComponent } from '../ui/user-management.component';
import { LeaveApprovalComponent } from '../ui/leave-approval.component';
import { HrReportsComponent } from '../ui/hr-reports.component';
import { TeamBalancesComponent } from '../ui/team-balances.component';
import { CalendarComponent } from './calendar.component';

@Component({
    selector: 'app-hr-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        UserManagementComponent,
        LeaveApprovalComponent,
        HrReportsComponent,
        TeamBalancesComponent,
        CalendarComponent
    ],
    template: `
    <div class="flex min-h-screen bg-[#F8FAFC]">
      
      <!-- Sidebar -->
      <aside class="w-80 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 z-50 shadow-2xl shadow-gray-200/50">
        
        <!-- HR Profile Section -->
        <div class="p-8 border-b border-gray-100">
          <div class="flex flex-col items-center text-center">
            <div class="w-24 h-24 bg-gradient-to-tr from-rose-600 to-orange-600 rounded-[35px] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-rose-500/30 mb-5 border-4 border-white">
              {{ user?.full_name?.charAt(0) }}
            </div>
            <h2 class="text-xl font-black text-gray-900 tracking-tight mb-1">{{ user?.full_name }}</h2>
            <p class="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-3">HR Administrator</p>
            <div class="px-4 py-1.5 bg-gray-50 rounded-full text-[10px] font-bold text-gray-400 truncate w-full">
              {{ user?.email }}
            </div>
          </div>
        </div>

        <!-- HR Navigation -->
        <nav class="flex-1 p-6 space-y-2 overflow-y-auto">
          <p class="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Administration</p>
          
          <button 
            (click)="setView('users')"
            [class]="activeView === 'users' ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'text-gray-500 hover:bg-gray-50'"
            class="w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group">
            <span class="text-xl group-hover:scale-110 transition-transform">👥</span>
            <span class="text-xs font-black uppercase tracking-widest">User Directory</span>
          </button>

          <button 
            (click)="setView('requests')"
            [class]="activeView === 'requests' ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'text-gray-500 hover:bg-gray-50'"
            class="w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group">
            <span class="text-xl group-hover:scale-110 transition-transform">📋</span>
            <span class="text-xs font-black uppercase tracking-widest">All Requests</span>
          </button>

          <button 
            (click)="setView('balances')"
            [class]="activeView === 'balances' ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'text-gray-500 hover:bg-gray-50'"
            class="w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group">
            <span class="text-xl group-hover:scale-110 transition-transform">📊</span>
            <span class="text-xs font-black uppercase tracking-widest">Global Balances</span>
          </button>

          <button 
            (click)="setView('calendar')"
            [class]="activeView === 'calendar' ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'text-gray-500 hover:bg-gray-50'"
            class="w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group">
            <span class="text-xl group-hover:scale-110 transition-transform">🗓️</span>
            <span class="text-xs font-black uppercase tracking-widest">Global Calendar</span>
          </button>

          <div class="pt-6 pb-2">
            <p class="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Insights</p>
            <button 
              (click)="setView('reports')"
              [class]="activeView === 'reports' ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'text-gray-500 hover:bg-gray-50'"
              class="w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group">
              <span class="text-xl group-hover:scale-110 transition-transform">📈</span>
              <span class="text-xs font-black uppercase tracking-widest">Analytics Reports</span>
            </button>
          </div>
        </nav>

        <!-- Footer Actions -->
        <div class="p-6 border-t border-gray-100 space-y-3">
          <button (click)="logout()" class="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-500/10">
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="ml-80 flex-1 p-8 lg:p-12 min-h-screen">
        <div class="max-w-6xl mx-auto">
          
          <!-- Content Header -->
          <div class="flex items-center justify-between mb-10">
            <div>
              <h1 class="text-4xl font-black text-gray-900 tracking-tight leading-tight">
                {{ getContentTitle() }}
              </h1>
              <p class="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">
                HR Master Control • Centralized Management System
              </p>
            </div>
            
            <div class="flex gap-4">
               <!-- Future additional global actions -->
            </div>
          </div>

          <!-- Dynamic Display -->
          <div class="space-y-8">
            <div [ngSwitch]="activeView">
              <div *ngSwitchCase="'users'" class="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <app-user-management></app-user-management>
              </div>
              <div *ngSwitchCase="'requests'" class="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <app-leave-approval></app-leave-approval>
              </div>
              <div *ngSwitchCase="'balances'" class="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <app-team-balances></app-team-balances>
              </div>
              <div *ngSwitchCase="'calendar'" class="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <app-calendar></app-calendar>
              </div>
              <div *ngSwitchCase="'reports'" class="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <app-hr-reports></app-hr-reports>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  `
})
export class HrAdminDashboardComponent implements OnInit {
    user: any;
    activeView: 'users' | 'requests' | 'balances' | 'calendar' | 'reports' = 'users';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.user = this.authService.getUser();
    }

    setView(view: any): void {
        this.activeView = view;
    }

    getContentTitle(): string {
        const titles = {
            users: 'User Directory',
            requests: 'Global Leave Requests',
            balances: 'Company Leave Balances',
            calendar: 'Organization Calendar',
            reports: 'Analytics & Insights'
        };
        return titles[this.activeView];
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
