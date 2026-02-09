import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LeaveService } from '../services/leave.service';
import { AuthService } from '../services/auth.service';
import { LeaveRequestFormComponent } from '../ui/leave-request-form.component';
import { LeaveApprovalComponent } from '../ui/leave-approval.component';
import { TeamBalancesComponent } from '../ui/team-balances.component';
import { CalendarComponent } from './calendar.component';
import { MyRequestsComponent } from './my-requests.component';
import { LeaveBalanceComponent } from '../ui/leave-balance.component';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LeaveRequestFormComponent,
    LeaveApprovalComponent,
    TeamBalancesComponent,
    CalendarComponent,
    MyRequestsComponent,
    LeaveBalanceComponent
  ],
  template: `
    <div class="flex min-h-screen bg-[#F8FAFC]">
      
      <!-- Sidebar -->
      <aside class="w-80 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 z-50 shadow-2xl shadow-gray-200/50">
        
        <!-- Profile Section -->
        <div class="p-8 border-b border-gray-100">
          <div class="flex flex-col items-center text-center">
            <div class="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[35px] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-500/30 mb-5 border-4 border-white">
              {{ user?.full_name?.charAt(0) }}
            </div>
            <h2 class="text-xl font-black text-gray-900 tracking-tight mb-1">{{ user?.full_name }}</h2>
            <p class="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-3">Manager • {{ user?.department }}</p>
            <div class="px-4 py-1.5 bg-gray-50 rounded-full text-[10px] font-bold text-gray-400 truncate w-full">
              {{ user?.email }}
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-6 space-y-2 overflow-y-auto">
          <p class="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Team Management</p>
          
          <button 
            (click)="setSection('team', 'approvals')"
            [class]="isSectionActive('team', 'approvals') ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-500 hover:bg-gray-50'"
            class="w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group">
            <span class="text-xl group-hover:scale-110 transition-transform">📋</span>
            <span class="text-xs font-black uppercase tracking-widest">Pending Approvals</span>
          </button>

          <button 
            (click)="setSection('team', 'balances')"
            [class]="isSectionActive('team', 'balances') ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-500 hover:bg-gray-50'"
            class="w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group">
            <span class="text-xl group-hover:scale-110 transition-transform">📊</span>
            <span class="text-xs font-black uppercase tracking-widest">Team Balances</span>
          </button>

          <button 
            (click)="setSection('team', 'calendar')"
            [class]="isSectionActive('team', 'calendar') ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-500 hover:bg-gray-50'"
            class="w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group">
            <span class="text-xl group-hover:scale-110 transition-transform">🗓️</span>
            <span class="text-xs font-black uppercase tracking-widest">Team Calendar</span>
          </button>

          <div class="pt-6 pb-2">
            <p class="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Personal</p>
            <button 
              (click)="setSection('personal', 'requests')"
              [class]="isSectionActive('personal', 'requests') ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-500 hover:bg-gray-50'"
              class="w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group">
              <span class="text-xl group-hover:scale-110 transition-transform">👤</span>
              <span class="text-xs font-black uppercase tracking-widest">My Requests</span>
            </button>
          </div>
        </nav>

        <!-- Footer Actions -->
        <div class="p-6 border-t border-gray-100 space-y-3">
          <button (click)="logout()" class="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-500/10 mb-2">
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
                Manager Control Center • {{ activeView === 'team' ? 'Team View' : 'Personal View' }}
              </p>
            </div>
            
            @if (activeView === 'personal') {
              <button (click)="showRequestForm = true" class="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/30 active:scale-95">
                + New Request
              </button>
            }
          </div>

          <!-- Dynamic Display -->
          <div class="space-y-8">
            @if (activeView === 'team') {
              @if (teamSection === 'approvals') {
                <div class="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 min-h-[500px]">
                  <app-leave-approval></app-leave-approval>
                </div>
              } @else if (teamSection === 'balances') {
                <div class="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                  <app-team-balances></app-team-balances>
                </div>
              } @else if (teamSection === 'calendar') {
                <div class="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                  <app-calendar></app-calendar>
                </div>
              }
            } @else {
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-8">
                  <div class="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                    <app-my-requests></app-my-requests>
                  </div>
                </div>
                <div class="space-y-8">
                   <div class="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                      <h3 class="text-lg font-black text-gray-900 tracking-tight mb-6">Your Balances</h3>
                      <app-leave-balance></app-leave-balance>
                   </div>
                </div>
              </div>
            }
          </div>

        </div>

        @if (showRequestForm) {
          <app-leave-request-form (close)="showRequestForm = false"></app-leave-request-form>
        }

      </main>
    </div>
  `
})
export class ManagerDashboardComponent implements OnInit {
  user: any;
  activeView: 'team' | 'personal' = 'team';
  teamSection: 'approvals' | 'balances' | 'calendar' = 'approvals';
  showRequestForm = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  setSection(view: 'team' | 'personal', section: string): void {
    this.activeView = view;
    if (view === 'team') {
      this.teamSection = section as any;
    }
  }

  isSectionActive(view: string, section: string): boolean {
    if (this.activeView !== view) return false;
    if (view === 'personal') return true;
    return this.teamSection === section;
  }

  getContentTitle(): string {
    if (this.activeView === 'personal') return 'My Leave Requests';
    if (this.teamSection === 'approvals') return 'Manage Team Requests';
    if (this.teamSection === 'balances') return 'Team Absence Records';
    if (this.teamSection === 'calendar') return 'Department Absence Map';
    return 'Dashboard';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
