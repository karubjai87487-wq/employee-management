import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service';
import { ToastService } from '../app/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showForm = true;

  roles = [
    { value: 'employee', label: 'Employee' },
    { value: 'manager', label: 'Manager' },
    { value: 'hr_admin', label: 'HR Admin' }
  ];
  departments = ['HR', 'Finance', 'IT', 'Operations', 'Sales', 'Marketing'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      full_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      department: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.showForm = true;
  }

  get username() {
    return this.registerForm.get('username');
  }

  get full_name() {
    return this.registerForm.get('full_name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get role() {
    return this.registerForm.get('role');
  }

  get department() {
    return this.registerForm.get('department');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.toastService.error('Please fill all fields correctly');
      return;
    }

    this.isLoading = true;
    const formData = this.registerForm.value;

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toastService.success('Registration successful! Logging in...');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err.error?.message || err.error?.error || 'Registration failed';
        this.toastService.error(errorMessage);
      }
    });
  }
}
