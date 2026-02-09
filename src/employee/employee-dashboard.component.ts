import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../app/services/auth.service';
import { ToastService } from '../app/services/toast.service';
import { LeaveService } from '../app/services/leave.service';
import { ProfileEditComponent } from '../app/ui/profile-edit.component';
import { LeaveRequestFormComponent } from '../app/ui/leave-request-form.component';
import { LeaveRequestsListComponent } from '../app/ui/leave-requests-list.component';
import { LeaveApprovalComponent } from '../app/ui/leave-approval.component';
import { MyRequestsComponent } from '../app/pages/my-requests.component';
import { CalendarComponent } from '../app/pages/calendar.component';
import { SettingsComponent } from '../app/pages/settings.component';
import { LeaveBalanceComponent } from '../app/ui/leave-balance.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProfileEditComponent,
    LeaveRequestFormComponent,
    LeaveRequestsListComponent,
    LeaveApprovalComponent,
    MyRequestsComponent,
    CalendarComponent,
    SettingsComponent,
    LeaveBalanceComponent
  ],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class EmployeeDashboardComponent implements OnInit, OnDestroy {
  user: any = null;
  remainingLeaves = 12;
  pendingRequests = 0;
  approvedLeaves = 0;
  usedDays = 0;
  showEdit = false;
  showLeaveForm = false;
  isManager = false;
  leaveBalance: any = null;
  activeView: string = 'dashboard';
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private leaveService: LeaveService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Load user
    const local = localStorage.getItem('user');
    if (local) {
      this.user = JSON.parse(local);
      this.isManager = this.user?.role === 'manager';
    } else {
      this.user = null;
    }

    // Load leave data
    this.loadLeaveBalance();
    this.loadLeaveStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLeaveBalance(): void {
    this.leaveService.getLeaveBalance().subscribe({
      next: (balance) => {
        this.leaveBalance = balance;
        this.remainingLeaves = balance.vacation_available || 0;
        this.usedDays = balance.vacation_used || 0;
      },
      error: (err) => {
        console.error('Failed to load leave balance', err);
      }
    });
  }

  loadLeaveStats(): void {
    this.leaveService.getUserLeaves().subscribe({
      next: (leaves) => {
        this.pendingRequests = leaves.filter((l: any) => l.status === 'Pending').length;
        this.approvedLeaves = leaves.filter((l: any) => l.status === 'Approved').length;
      },
      error: (err) => {
        console.error('Failed to load leave stats', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  applyLeave(): void {
    this.showLeaveForm = true;
  }

  onLeaveFormClose(): void {
    this.showLeaveForm = false;
  }

  onLeaveFormSubmitted(): void {
    this.showLeaveForm = false;
    this.loadLeaveBalance();
    this.loadLeaveStats();
  }

  openEdit(): void {
    this.showEdit = true;
  }

  onEditClose(): void {
    this.showEdit = false;
    // Reload user from localStorage
    const local = localStorage.getItem('user');
    if (local) {
      const updatedUser = JSON.parse(local);
      this.user = updatedUser;
      // Update isManager if role changed
      this.isManager = updatedUser?.role === 'manager';
    }
  }

  setView(view: string): void {
    this.activeView = view;
  }
}
