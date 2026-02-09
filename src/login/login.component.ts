import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service';
import { ToastService } from '../app/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showForm = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Always show the form on login page
    this.showForm = true;
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastService.error('Please fill all fields correctly');
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.authService.storeToken(response.token, response.user);
        this.toastService.success('Login successful!');
        setTimeout(() => {
          let route = '/dashboard';
          if (response.user.role === 'manager') route = '/manager-dashboard';
          if (response.user.role === 'hr_admin') route = '/hr-dashboard';
          this.router.navigate([route]);
        }, 500);
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err.error?.message || err.error?.error || 'Login failed';
        this.toastService.error(errorMessage);
      }
    });
  }
}
