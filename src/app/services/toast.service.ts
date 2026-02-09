import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<Toast[]>([]);
  public toast$ = this.toastSubject.asObservable();

  show(message: string, type: 'success' | 'error', duration: number = 3000): void {
    const id = Date.now().toString();
    const toast: Toast = { id, message, type, duration };

    const currentToasts = this.toastSubject.value;
    this.toastSubject.next([...currentToasts, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  private remove(id: string): void {
    const currentToasts = this.toastSubject.value;
    this.toastSubject.next(currentToasts.filter(t => t.id !== id));
  }
}
