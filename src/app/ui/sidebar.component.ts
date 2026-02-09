import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="w-64 bg-white p-4 h-full shadow">
      <ul class="space-y-2">
        <li><a class="block py-2 px-3 rounded hover:bg-gray-100" routerLink="/dashboard">Dashboard</a></li>
        <li><a class="block py-2 px-3 rounded hover:bg-gray-100" (click)="navigate('')">My Requests</a></li>
        <li><a class="block py-2 px-3 rounded hover:bg-gray-100" (click)="navigate('')">Company Calendar</a></li>
      </ul>
    </aside>
  `
})
export class SidebarComponent {
  constructor(private router: Router) { }

  navigate(path: string) {
    // placeholder navigation
  }
}
