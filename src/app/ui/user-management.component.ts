import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { LeaveService } from '../services/leave.service';
import { ToastService } from '../services/toast.service';

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h3 class="text-2xl font-black text-gray-900 tracking-tight">Organization Members</h3>
          <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Manage accounts and authorization</p>
        </div>
        <div class="flex gap-3">
           <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Search employees..." 
            class="px-6 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-rose-500 transition-all w-64"
           >
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-left border-b border-gray-50">
              <th class="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Employee</th>
              <th class="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Role / Dept</th>
              <th class="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Manager</th>
              <th class="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            @for (user of filteredUsers(); track user.id) {
              <tr class="group hover:bg-gray-50/50 transition-colors">
                <td class="py-6 px-4">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 font-bold">
                      {{ user.full_name.charAt(0) }}
                    </div>
                    <div>
                      <p class="text-sm font-black text-gray-900">{{ user.full_name }}</p>
                      <p class="text-[10px] text-gray-400 font-medium">{{ user.email }}</p>
                    </div>
                    @if (!user.is_active) {
                      <span class="px-2 py-0.5 bg-gray-100 text-gray-400 text-[8px] font-black uppercase rounded-full">Inactive</span>
                    }
                  </div>
                </td>
                <td class="py-6 px-4">
                  <div class="space-y-1">
                    <span class="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg">
                      {{ user.role }}
                    </span>
                    <p class="text-[10px] text-gray-400 font-bold px-1">{{ user.department }}</p>
                  </div>
                </td>
                <td class="py-6 px-4">
                  <select 
                    [ngModel]="user.manager_id" 
                    (ngModelChange)="updateManager(user.id, $event)"
                    class="bg-transparent border-none text-[10px] font-bold text-gray-600 focus:ring-0 cursor-pointer hover:text-rose-600 transition-colors">
                    <option [value]="null">No Manager</option>
                    @for (mgr of managers; track mgr.id) {
                      @if (mgr.id !== user.id) {
                        <option [value]="mgr.id">{{ mgr.full_name }}</option>
                      }
                    }
                  </select>
                </td>
                <td class="py-6 px-4">
                  <div class="flex items-center justify-center gap-2">
                    <button 
                      (click)="editBalances(user)"
                      class="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-rose-600 hover:border-rose-100 hover:shadow-sm transition-all"
                      title="Adjust Balances">
                      ⚖️
                    </button>
                    @if (user.is_active) {
                      <button 
                        (click)="deactivateUser(user)"
                        class="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-600 hover:border-red-100 hover:shadow-sm transition-all"
                        title="Deactivate Account">
                        🚫
                      </button>
                    }
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Balance Adjustment Modal -->
      @if (selectedUserForBalance) {
        <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div class="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl animate-in zoom-in duration-300">
            <h3 class="text-2xl font-black text-gray-900 mb-2">Adjust Balances</h3>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mb-8">Override for {{ selectedUserForBalance.full_name }}</p>
            
            <div class="space-y-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vacation Days</label>
                <input type="number" [(ngModel)]="balanceEditData.vacation_days" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sick Days</label>
                <input type="number" [(ngModel)]="balanceEditData.sick_days" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Personal Days</label>
                <input type="number" [(ngModel)]="balanceEditData.personal_days" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold">
              </div>
            </div>

            <div class="flex gap-4 mt-10">
              <button (click)="selectedUserForBalance = null" class="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Cancel</button>
              <button (click)="saveBalances()" class="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-500/20 transition-all">Save Changes</button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class UserManagementComponent implements OnInit {
    users: any[] = [];
    managers: any[] = [];
    searchQuery = '';
    selectedUserForBalance: any = null;
    balanceEditData = {
        vacation_days: 20,
        sick_days: 10,
        personal_days: 5
    };

    constructor(
        private authService: AuthService,
        private leaveService: LeaveService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.authService.getAllUsers().subscribe({
            next: (users) => {
                this.users = users;
                this.managers = users.filter(u => u.role === 'manager' || u.role === 'hr_admin');
            },
            error: (err) => this.toastService.show('Failed to load users', 'error')
        });
    }

    filteredUsers(): any[] {
        if (!this.searchQuery) return this.users;
        const q = this.searchQuery.toLowerCase();
        return this.users.filter(u =>
            u.full_name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.department.toLowerCase().includes(q)
        );
    }

    updateManager(userId: number, managerId: any): void {
        this.authService.updateUserByAdmin(userId, { manager_id: managerId }).subscribe({
            next: () => this.toastService.show('Manager assigned successfully', 'success'),
            error: () => this.toastService.show('Failed to assign manager', 'error')
        });
    }

    deactivateUser(user: any): void {
        if (confirm(`Are you sure you want to deactivate ${user.full_name}?`)) {
            this.authService.deactivateUser(user.id).subscribe({
                next: () => {
                    this.toastService.show('User deactivated', 'success');
                    this.loadUsers();
                },
                error: () => this.toastService.show('Failed to deactivate user', 'error')
            });
        }
    }

    editBalances(user: any): void {
        this.selectedUserForBalance = user;
        // Potentially fetch current balances from backend if needed, 
        // or use defaults for now if the user object doesn't have them
        this.balanceEditData = {
            vacation_days: 20,
            sick_days: 10,
            personal_days: 5
        };
    }

    saveBalances(): void {
        if (!this.selectedUserForBalance) return;
        this.leaveService.updateBalances(this.selectedUserForBalance.id, this.balanceEditData).subscribe({
            next: () => {
                this.toastService.show('Balances updated successfully', 'success');
                this.selectedUserForBalance = null;
            },
            error: () => this.toastService.show('Failed to update balances', 'error')
        });
    }
}
