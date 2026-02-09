import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveService } from '../services/leave.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-leave-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 transition-all scale-100">
        <!-- Header -->
        <div class="px-8 pt-8 pb-4 flex justify-between items-center">
          <div>
            <h3 class="text-2xl font-black text-gray-900 tracking-tight">New Request</h3>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Time-Off Management</p>
          </div>
          <button (click)="close.emit()" class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 transition-all">
            <span class="text-2xl">&times;</span>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-8 pt-4 space-y-6">
          <!-- Request Type -->
          <div class="space-y-2">
            <label class="block text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
              Leave Type
            </label>
            <div class="relative group">
              <select
                formControlName="request_type"
                class="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-gray-900 font-bold transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="">Choose a type...</option>
                <option value="Vacation">Vacation</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Personal Day">Personal Day</option>
                <option value="Remote Work">Remote Work</option>
              </select>
              <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
            </div>
          </div>

          <!-- Date Range -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
                From
              </label>
              <input
                type="date"
                [min]="minDate"
                formControlName="start_date"
                class="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-gray-900 font-bold transition-all outline-none"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
                To
              </label>
              <input
                type="date"
                [min]="minDate"
                formControlName="end_date"
                class="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-gray-900 font-bold transition-all outline-none"
              />
            </div>
          </div>

          <!-- Reason -->
          <div class="space-y-2">
            <label class="block text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
              Reason (Optional)
            </label>
            <textarea
              formControlName="reason"
              rows="3"
              placeholder="Tell us more about your request..."
              class="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-gray-900 font-bold transition-all outline-none resize-none"
            ></textarea>
          </div>

          <!-- Info Box -->
          <div class="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <div class="flex gap-3">
              <span class="text-indigo-600 text-xl font-bold">ℹ️</span>
              <p class="text-xs text-indigo-700 leading-relaxed font-medium">
                Vacation and Remote Work requests automatically exclude weekends from your balance.
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              (click)="close.emit()"
              class="flex-1 px-6 py-4 bg-gray-50 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="isLoading || form.invalid"
              class="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
            >
              {{ isLoading ? 'Processing...' : 'Submit Request' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LeaveRequestFormComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  form: FormGroup;
  isLoading = false;
  minDate: string;

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      request_type: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      reason: ['']
    });

    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.form.invalid) {
      this.toastService.error('Please fill all required fields');
      return;
    }

    const startDate = new Date(this.form.get('start_date')?.value);
    const endDate = new Date(this.form.get('end_date')?.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      this.toastService.error('Cannot request past dates');
      return;
    }

    if (endDate < startDate) {
      this.toastService.error('End date must be after start date');
      return;
    }

    this.isLoading = true;
    this.leaveService.createLeaveRequest(this.form.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastService.success('Leave request submitted successfully');
        this.submitted.emit();
        this.close.emit();
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.error?.error || 'Failed to submit request');
      }
    });
  }
}
