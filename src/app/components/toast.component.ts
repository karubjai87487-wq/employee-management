import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      @for (toast of (toastService.toast$ | async); track toast.id) {
        <div
          class="px-4 py-3 rounded-lg shadow-lg animate-slideIn"
          [ngClass]="{
            'bg-green-500 text-white': toast.type === 'success',
            'bg-red-500 text-white': toast.type === 'error'
          }"
        >
          <p>{{ toast.message }}</p>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from {
        transform: translateX(500px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .animate-slideIn {
      animation: slideIn 0.3s ease-out;
    }
  `]
})
export class ToastComponent implements OnInit {
  constructor(public toastService: ToastService) {}

  ngOnInit(): void {}
}
