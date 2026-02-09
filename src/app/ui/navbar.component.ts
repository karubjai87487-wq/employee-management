import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="w-full flex items-center justify-between p-4 bg-white shadow">
      <div class="flex items-center gap-4">
        <button class="text-xl font-bold text-indigo-600">Employee</button>
      </div>
      <div class="flex items-center gap-3">
        <button (click)="onEdit()" class="px-3 py-2 rounded bg-indigo-600 text-white">Edit Profile</button>
        <button (click)="logout()" class="px-3 py-2 rounded bg-red-500 text-white">Logout</button>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  @Output() edit = new EventEmitter<void>();

  constructor(private auth: AuthService) { }

  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }

  onEdit() {
    this.edit.emit();
  }

}
