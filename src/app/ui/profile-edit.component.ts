import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <!-- Header -->
        <div class="border-b border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-2xl font-bold text-gray-900">Edit Profile</h3>
            <button (click)="close.emit()" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
          </div>
          <p class="text-sm text-gray-600 mt-1">Update your profile information</p>
        </div>

        <!-- Form -->
        @if (form) {
          <form [formGroup]="form" (ngSubmit)="save()" class="p-6 space-y-5">
            <!-- Full Name -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input 
                formControlName="full_name" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Enter your full name"
              />
            </div>

            <!-- Username -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input 
                formControlName="username" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Enter your username"
              />
            </div>

            <!-- Department -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Department</label>
              <input 
                formControlName="department" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Enter your department"
              />
            </div>

            <!-- Buttons -->
            <div class="flex gap-3 pt-4">
              <button 
                type="button" 
                (click)="close.emit()" 
                [disabled]="isSaving"
                class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button 
                type="submit"
                [disabled]="isSaving"
                class="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                @if (isSaving) {
                  Saving...
                } @else {
                  Save Changes
                }
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  `
})
export class ProfileEditComponent implements OnInit, OnChanges {
  @Input() user: any;
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;
  isSaving = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private toast: ToastService) {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      full_name: [''],
      username: [''],
      department: ['']
    });
  }

  ngOnInit(): void {
    this.updateForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.updateForm();
    }
  }

  updateForm(): void {
    if (this.user && this.form) {
      this.form.patchValue({
        full_name: this.user.full_name || '',
        username: this.user.username || '',
        department: this.user.department || ''
      });
    }
  }

  save(): void {
    if (!this.user || this.isSaving || !this.form) return;

    this.isSaving = true;
    const formData = this.form.value;

    this.auth.updateProfile(this.user.id, formData).subscribe({
      next: (res) => {
        this.isSaving = false;

        if (res && res.user) {
          // Update user in localStorage and auth service
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          const mergedUser = { ...storedUser, ...res.user };
          this.auth.setCurrentUser(mergedUser);
          this.toast.success('Profile updated successfully!');
          this.close.emit();
        }
      },
      error: (err) => {
        this.isSaving = false;
        const errorMsg = err.error?.message || err.error?.error || 'Failed to update profile';
        console.error('Update error:', err);
        this.toast.error(errorMsg);
      }
    });
  }
}
