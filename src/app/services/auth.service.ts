import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5001/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      const user = localStorage.getItem('user');
      if (user) {
        this.currentUserSubject.next(JSON.parse(user));
      }
    }
  }

  register(data: {
    username: string;
    email: string;
    password: string;
    full_name: string;
    role?: string;
    department?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  storeToken(token: string, user: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  updateProfile(userId: number, data: { username?: string; full_name?: string; department?: string; }): Observable<any> {
    // backend users route
    return this.http.patch(`http://localhost:5001/api/users/${userId}`, data);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5001/api/users`);
  }

  updateUserByAdmin(userId: number, data: any): Observable<any> {
    return this.http.patch(`http://localhost:5001/api/users/${userId}`, data);
  }

  deactivateUser(userId: number): Observable<any> {
    return this.http.delete(`http://localhost:5001/api/users/${userId}`);
  }

  setCurrentUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getUser(): any {
    return this.currentUserSubject.value;
  }
}
